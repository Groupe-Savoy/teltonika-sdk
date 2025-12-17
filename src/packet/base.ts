import type { TeltonikaCodec } from "@/codec";
import { calculateCrc, createBuffer } from "@/utils";

export const PREAMBLE_LENGTH = 4;
export const SIZE_LENGTH = 4;
export const CODEC_ID_LENGTH = 1;
export const NUMBER_OF_DATA_LENGTH = 1;
export const CRC_OFFSET_FROM_END = 4;
export const HEADER_LENGTH = PREAMBLE_LENGTH + SIZE_LENGTH;
export const HEADER_AVL_LENGTH = HEADER_LENGTH + CODEC_ID_LENGTH + NUMBER_OF_DATA_LENGTH;

export enum TeltonikaIoGroup {
  N1 = 1,
  N2 = 2,
  N4 = 4,
  N8 = 8,
  NX = 0
}

export type TeltonikaIo = Record<number, Buffer>;

export type TeltonikaIoLayout = {
  countLength?: number;
  idLength?: number;
}

export abstract class TeltonikaBasePacket<T = any> {
  protected preamble!: Buffer;
  protected size!: number;
  protected codecId!: TeltonikaCodec;
  protected numberOfData1!: number;
  protected numberOfData2!: number;
  protected data!: Buffer;
  protected crc!: number;
  protected raw!: Buffer;
  public records!: T[];

  get state() {
    return {
      preamble: this.preamble,
      size: this.size,
      codecId: this.codecId,
      numberOfData1: this.numberOfData1,
      numberOfData2: this.numberOfData2,
      data: this.data,
      crc: this.crc,
      raw: this.raw,
    }
  }

  get calculatedCrc() {
    return calculateCrc(this.data);
  }

  get response() {
    return createBuffer(4, Buffer.from([this.numberOfData1]));
  }

  constructor(raw: Buffer) {
    this.raw = raw;
    this.parse(raw);

    if (this.crc !== this.calculatedCrc) {
      throw new Error(
        `CRC-16 validation failed: expected ${this.crc} got ${this.calculatedCrc}`
      );
    }

    this.records = this.parseRecords(raw);
  }

  /**
   * Parse Teltonika packet header fields from the raw buffer.
   *
   * Packet structure (Codec8 / Codec8E):
   *
   * 0–3   : Preamble (always 0x00000000)
   * 4–7   : Data Field Length
   * 8     : Codec ID
   * 9     : Number of Data 1 (records count)
   * 10..  : AVL Data
   * -5    : Number of Data 2 (records count)
   * -4..-1: CRC-16
   *
   * @param raw - Full Teltonika packet buffer
   *
   * @example
   * Codec8E packet example:
   *
   * ```text
   * 00 00 00 00   // Preamble
   * 00 00 00 4A   // Data Field Length (74 bytes)
   * 8E            // Codec ID (Codec8E)
   * 01            // Number of Data 1
   * ...           // AVL Data
   * 01            // Number of Data 2
   * 00 00 29 94   // CRC-16
   * ```
   *
   * ```ts
   * const buffer = Buffer.from(
   *   "000000000000004A8E01" +
   *   "0000016B4F831C6801" + // timestamp + priority
   *   "000000000000000000000000" +
   *   "00010005000100010100010011001d" +
   *   "00010010015e2c88" +
   *   "0002000b000000003544c87a000e000000001dd7e06a" +
   *   "0001" +
   *   "00002994",
   *   "hex"
   * );
   *
   * packet.parse(buffer);
   *
   * console.log(packet.codecId);        // 0x8E
   * console.log(packet.numberOfData1);  // 1
   * console.log(packet.numberOfData2);  // 1
   * console.log(packet.size);           // 74
   * ```
   */
  public parse(raw: Buffer) {
    this.preamble = raw.subarray(0, PREAMBLE_LENGTH);
    this.size = raw.subarray(PREAMBLE_LENGTH, PREAMBLE_LENGTH + SIZE_LENGTH).readUInt32BE(0);
    this.codecId = raw.readUInt8(HEADER_LENGTH);
    this.numberOfData1 = raw.readUInt8(HEADER_LENGTH + CODEC_ID_LENGTH);
    this.data = raw.subarray(HEADER_LENGTH, HEADER_LENGTH + this.size);
    this.numberOfData2 = raw.readUInt8(raw.length - CRC_OFFSET_FROM_END - NUMBER_OF_DATA_LENGTH);
    this.crc = raw.readUInt32BE(raw.length - CRC_OFFSET_FROM_END);
  }

  private readUIntByLength(
    data: Buffer,
    offset: number,
    length: number
  ): number {
    switch (length) {
      case 1: return data.readUInt8(offset);
      case 2: return data.readUInt16BE(offset);
      case 4: return data.readUInt32BE(offset);
      default:
        throw new Error(`Unsupported integer length: ${length}`);
    }
  }

  /**
   * Parse a single IO group from an AVL record.
   *
   * This method parses one IO group (N1, N2, N4, N8 or NX) according to
   * Teltonika Codec8E specification.
   *
   * @param data - Buffer containing IO data starting at the group counter
   * @param offset - Current offset in the buffer
   * @param n - Value size in bytes:
   *   - 1 → N1 (1 byte values)
   *   - 2 → N2 (2 byte values)
   *   - 4 → N4 (4 byte values)
   *   - 8 → N8 (8 byte values)
   *   - 0 → NX (variable length values)
   * @param layout - Define the layout to parse io group.
   *
   * @returns Parsed IO values and updated offset
   *
   * @example
   * Codec8E N1 (1 byte IO) example:
   *
   * N1 of One Byte IO   00 01
   * IO ID              00 01 (DIN1)
   * IO Value           01
   *
   * ```ts
   * const buffer = Buffer.from(
   *   "0001000101", // count=1, id=1, value=01
   *   "hex"
   * );
   *
   * const { io, offset } = packet.parseIoGroup(buffer, 0, 1);
   *
   * console.log(io);
   * // { 1: <Buffer 01> }
   * console.log(offset);
   * // 5
   * ```
   */
  public parseIoGroup(
    data: Buffer,
    offset: number,
    n: TeltonikaIoGroup,
    layout: TeltonikaIoLayout = {}
  ) {
    const { countLength = 2, idLength = 2 } = layout;
    const io: Record<number, Buffer> = {};
    const count = this.readUIntByLength(data, offset, countLength);

    offset += countLength;

    for (let i = 0; i < count; i++) {
      let value: Buffer;
      const id = this.readUIntByLength(data, offset, idLength);

      offset += idLength;

      if (n > 0) {
        value = data.subarray(offset, offset + n);
        offset += n;
      } else {
        const length = data.readUInt8(offset);

        offset += 1;
        value = data.subarray(offset, offset + length);
        offset += length;
      }

      io[id] = value;
    }

    return { io, offset };
  }

  /**
   * Parse all IO groups (N1, N2, N4, N8, NX) of an AVL record
   * and merge them into a single IO object.
   *
   * @param {Buffer} data - Buffer containing IO section of the AVL record
   * @param {number} total - Total number of IO properties (N)
   * @param {TeltonikaIoGroup[]} groups - IO group value sizes (default: [1, 2, 4, 8, 0])
   * @param {TeltonikaIoLayout} layout - Define the layout to parse IO.
   *
   * @returns Object mapping AVL IO IDs to raw Buffer values
   *
   * @example
   * From https://wiki.teltonika-gps.com/view/Codec#Codec_8_Extended  
   * Codec8E AVL IO example:  
   * **Event IO ID:**          
   * 00 01  
   * **N of Total ID:**        
   * 00 05  
   * **N1 (1 byte):**  
   *   00 01   
   *   00 01 | 01   
   * **N2 (2 bytes):**  
   *   00 01    
   *   00 11 | 00 1D  
   * **N4 (4 bytes):**  
   *   00 01  
   *   00 10 | 01 5E 2C 88  
   * **N8 (8 bytes):**  
   *   00 02  
   *   00 0B | 00 00 00 00 35 44 C8 7A  
   *   00 0E | 00 00 00 00 1D D7 E0 6A  
   * **NX:**  
   *   00 00  
   * 
   * ```ts
   * const ioBuffer = Buffer.from(
   *   "0001000101" +
   *   "00010011001d" +
   *   "00010010015e2c88" +
   *   "0002000b000000003544c87a000e000000001dd7e06a" +
   *   "0000",
   *   "hex"
   * );
   *
   * const io = packet.parseIo(ioBuffer, 5);
   * console.log(io);
   * // {
   * //   1:  <Buffer 01>,                      // DIN1
   * //   17: <Buffer 00 1d>,                   // Axis X
   * //   16: <Buffer 01 5e 2c 88>,             // Total Odometer
   * //   11: <Buffer 00 00 00 00 35 44 c8 7a>, // ICCID1
   * //   14: <Buffer 00 00 00 00 1d d7 e0 6a>  // ICCID2
   * // }
   * ```
   */
  public parseIo(
    data: Buffer,
    total: number,
    groups: TeltonikaIoGroup[] = [1, 2, 4, 8, 0],
    layout: TeltonikaIoLayout = {}
  ): Record<number, Buffer> {
    const initial = { io: {} as TeltonikaIo, offset: 0 };
    const result = groups.reduce((acc, size) => {
      const { io, offset } = this.parseIoGroup(
        data,
        acc.offset,
        size,
        layout
      );

      return {
        io: { ...acc.io, ...io },
        offset
      };
    }, initial);

    if (Object.keys(result.io).length !== total) {
      throw new Error(
        `Parsed IO count ${Object.keys(result.io).length} does not match total ${total}`
      );
    }

    return result.io;
  }

  /**
   * Calculate the byte length of the IO section.  
   * This method walks through all IO groups in the order defined by
   * Teltonika Codec8E specification:
   *
   * Each group starts with a 2-byte counter followed by that many
   * IO entries. The total IO section length is derived exclusively
   * from these counters and value sizes.
   *
   * @param {Buffer} data - Buffer containing the IO section, starting at `N1 of One Byte IO`
   * @param {TeltonikaIoGroup[]} groups - IO group value sizes (default: [1, 2, 4, 8, 0])
   * @param {TeltonikaIoLayout} layout - Define the layout to calcul IO length.
   * @returns Total number of bytes occupied by the IO section
   */
  public calculateIoLength(
    data: Buffer,
    groups: TeltonikaIoGroup[] = [1, 2, 4, 8, 0],
    layout: TeltonikaIoLayout = {}
  ): number {
    const { countLength = 2, idLength = 2 } = layout;
    let offset = 0;

    for (const size of groups) {
      const count = this.readUIntByLength(data, offset, countLength);
      offset += countLength;

      for (let i = 0; i < count; i++) {
        offset += idLength;

        if (size > 0) {
          offset += size;
        } else {
          const len = data.readUInt8(offset);
          offset += 1 + len;
        }
      }
    }

    return offset;
  }

  /**
   * Parse records from a Teltonika packet.  
   * This method must be implemented by codec-specific packet classes
   * (e.g. Codec8, Codec8E, Codec16).
   *
   * The implementation is responsible for:
   * - Parsing all AVL records from the packet
   * - Decoding record fields (timestamp, priority, GPS, IO, etc.)
   * - Returning an array of typed records
   *
   * @param {Buffer} raw - Full Teltonika packet buffer
   * @returns {T[]} Array of parsed records
   */
  abstract parseRecords(raw: Buffer): T[];
}