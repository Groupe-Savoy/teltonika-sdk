import { type TeltonikaCodec, TeltonikaGPRSCodec } from '@/codec';
import { TeltonikaBaseParser } from './base';
import { TeltonikaCodec14ResponsePacket } from '@/packet/codec14';

/**
 * Parser for Teltonika Codec 14 response packets.
 * Extends TeltonikaBaseParser to handle Codec 14 specific packet parsing.
 * 
 * @class TeltonikaCodec14Parser
 * @group Parser
 * @extends TeltonikaBaseParser<TeltonikaCodec14ResponsePacket>
 * @example
 * ```ts
 * const parser = new TeltonikaCodec14Parser();
 * const packet = parser.parsePacket(rawBuffer);
 * console.log(packet.records);
 * ```
 */
export class TeltonikaCodec14Parser extends TeltonikaBaseParser<TeltonikaCodec14ResponsePacket> {
  /**
   * The codec identifier for Codec 14.
   * @type {TeltonikaCodec}
   */
  static codec: TeltonikaCodec = TeltonikaGPRSCodec.Codec14;

  /**
   * Checks if the buffer contains a Codec 14 response packet.
   * Overrides the base method to include codec and type checks.
   * @param {Buffer} data - The raw buffer from the device.
   * @returns {boolean} True if the buffer is a Codec 14 response packet.
   */
  public isPacket(data: Buffer): boolean {
    const base = data.subarray(0, 4);
    const codec = data[8];
    const type = data[10];

    return base.equals(Buffer.from([0x00,0x00,0x00,0x00])) && [0x06, 0x11].includes(type) && codec === TeltonikaGPRSCodec.Codec14;
  }

  /**
   * Parses the raw buffer into a TeltonikaCodec14ResponsePacket.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {TeltonikaCodec14ResponsePacket} The parsed packet.
   */
  parsePacket(data: Buffer) {
    return new TeltonikaCodec14ResponsePacket(data);
  }
}