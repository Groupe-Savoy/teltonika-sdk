import type { TeltonikaCodec } from "@/codec";

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

  get calculatedCrc() {
    return this.calculateCrc(this.data);
  }

  constructor(raw: Buffer) {
    this.raw = raw;
    this.parse(raw);

    if (this.crc !== this.calculatedCrc) {
      throw new Error(
        `CRC-16 validation failed: expected ${this.crc} got ${this.calculatedCrc}`
      );
    }

    if (this.numberOfData1 !== this.numberOfData2) {
      throw new Error('Number of data validation failed');
    }

    this.records = this.parseRecords(raw);
  }

  protected parse(raw: Buffer) {
    this.preamble = raw.subarray(0, 4);
    this.size = raw.subarray(4, 8).readUInt32BE(0);
    this.codecId = raw.readUInt8(8);
    this.numberOfData1 = raw.readUInt8(9);
    this.data = raw.subarray(8, 8 + this.size);
    this.numberOfData2 = raw.readUInt8(raw.length - 5);
    this.crc = raw.readUInt32BE(raw.length - 4);
  }

  abstract parseRecords(raw: Buffer): T[];

  public createBuffer(size: number, data: Buffer) {
    const buf = Buffer.alloc(size, 0x00);
    const value = Buffer.from(data);

    value.copy(buf, size - value.length);

    return buf;
  }

  public calculateCrc(data: Buffer) {
    let crc = 0;

    data.forEach((byte) => {
      crc = crc ^ byte;
      let bitNumber = 0;

      do {
        const carry = crc & 1;
        crc = crc >>> 1;

        if (carry === 1) {
          crc = crc ^ 0xa001;
        }
        bitNumber += 1;
      } while (bitNumber !== 8);
    });

    return crc;
  }
}