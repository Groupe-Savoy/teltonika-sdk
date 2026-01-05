import { type TeltonikaCodec, TeltonikaGPRSCodec } from '@/codec';
import { TeltonikaBaseParser } from './base';
import { TeltonikaCodec12ResponsePacket } from '@/packet/codec12';

/**
 * Parser for Teltonika Codec 12 response packets.
 * Extends TeltonikaBaseParser to handle Codec 12 specific packet parsing.
 * 
 * @class TeltonikaCodec12Parser
 * @group Parser
 * @extends TeltonikaBaseParser<TeltonikaCodec12ResponsePacket>
 * @example
 * ```ts
 * const parser = new TeltonikaCodec12Parser();
 * const packet = parser.parsePacket(rawBuffer);
 * console.log(packet.records);
 * ```
 */
export class TeltonikaCodec12Parser extends TeltonikaBaseParser<TeltonikaCodec12ResponsePacket> {
  /**
   * The codec identifier for Codec 12.
   * @type {TeltonikaCodec}
   */
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec12;

  /**
   * Checks if the buffer contains a Codec 12 response packet.
   * Overrides the base method to include codec and type checks.
   * @param {Buffer} data - The raw buffer from the device.
   * @returns {boolean} True if the buffer is a Codec 12 response packet.
   */
  public isPacket(data: Buffer): boolean {
    const base = data.subarray(0, 4);
    const codec = data[8];
    const type = data[10];

    return base.equals(Buffer.from([0x00,0x00,0x00,0x00])) && type === 0x06 && codec === TeltonikaGPRSCodec.Codec12;
  }

  /**
   * Parses the raw buffer into a TeltonikaCodec12ResponsePacket.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {TeltonikaCodec12ResponsePacket} The parsed packet.
   */
  parsePacket(data: Buffer) {
    return new TeltonikaCodec12ResponsePacket(data);
  }
}