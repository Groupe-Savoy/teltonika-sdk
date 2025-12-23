import type { TeltonikaCodec } from '@/codec';
import type { TeltonikaBasePacket } from '@/packet/base';

/**
 * Base abstract parser class for Teltonika device packets.
 * Provides utility methods to identify and parse IMEI data and device packets.
 * Subclasses must implement `parsePacket` to handle specific codec formats.
 * 
 * @abstract
 * @class TeltonikaBaseParser
 * @group Parser
 *  @document ../../docs/parser.md
 * @example
 * ```ts
 * class TeltonikaCodec8Parser extends TeltonikaBaseParser<TeltonikaCodec8AVLPacket> {
 *   static codec = TeltonikaDataCodec.Codec8;
 *
 *   parsePacket(data: Buffer) {
 *     // implement parsing logic for Codec 8
 *   }
 * }
 * ```
 */
export abstract class TeltonikaBaseParser<T extends TeltonikaBasePacket> {
  /**
   * The Teltonika codec associated with this parser.
   * Must be defined in subclasses.
   */
  static codec: TeltonikaCodec;

  /**
   * Checks if the buffer contains an IMEI message.
   * IMEI packets are 17 bytes long and start with `0x00 0x0F`.
   * 
   * @param {Buffer} data - The raw buffer from the device.
   * @returns {boolean} True if the buffer contains an IMEI message.
   */
  public isImei(data: Buffer) {
    const base = data.subarray(0, 2);
    return base.equals(Buffer.from([0x00, 0x0F])) && data.length === 17;
  }

  /**
   * Parses the IMEI string from an IMEI buffer.
   * 
   * @param {Buffer} data - The buffer containing the IMEI.
   * @returns {string} The IMEI extracted from the buffer.
   */
  public parseImei(data: Buffer) {
    return data.subarray(2).toString();
  }

  /**
   * Checks if the buffer contains the start of a Teltonika data packet.
   * Standard packets begin with 4 bytes `0x00 0x00 0x00 0x00`.
   * 
   * @param {Buffer} data - The raw buffer from the device.
   * @returns {boolean} True if the buffer is a packet.
   */
  public isPacket(data: Buffer) {
    const base = data.subarray(0, 4);
    return base.equals(Buffer.from([0x00,0x00,0x00,0x00]));
  }

  /**
   * Checks if the buffer contains a complete Teltonika packet.
   * It compares the length specified in the packet header with the actual payload size.
   * 
   * @param {Buffer} data - The raw buffer from the device.
   * @returns {boolean} True if the buffer contains a complete packet.
   */
  public isCompletPacket(data: Buffer) {
    try {      
      const size = data.subarray(4, 8).readUInt32BE(0);
      const dataSize = data.subarray(8, data.length - 4).length;
      
      return size === dataSize;
    } catch {
      return false;
    }
  }

  /**
   * Abstract method to parse a buffer into a typed Teltonika packet.
   * Must be implemented by subclasses for specific codecs.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {T} Parsed packet of type T.
   */
  abstract parsePacket(data: Buffer): T
}