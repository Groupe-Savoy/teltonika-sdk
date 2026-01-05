import { type TeltonikaCodec, TeltonikaDataCodec } from '@/codec';
import { TeltonikaBaseParser } from './base';
import { TeltonikaCodec16AVLPacket } from '@/packet/codec16';

/**
 * Parser for Teltonika Codec 16 packets.
 * Extends TeltonikaBaseParser to handle Codec 16 specific packet parsing.
 * 
 * @class TeltonikaCodec16Parser
 * @group Parser
 * @extends TeltonikaBaseParser<TeltonikaCodec16AVLPacket>
 * @example
 * ```ts
 * const parser = new TeltonikaCodec16Parser();
 * const packet = parser.parsePacket(rawBuffer);
 * console.log(packet.records);
 * ```
 */
export class TeltonikaCodec16Parser extends TeltonikaBaseParser<TeltonikaCodec16AVLPacket> {
  /**
   * The codec identifier for Codec 16.
   * @type {TeltonikaCodec}
   */
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec16;

  /**
   * Parses the raw buffer into a TeltonikaCodec16AVLPacket.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {TeltonikaCodec16AVLPacket} The parsed packet.
   */
  parsePacket(data: Buffer): TeltonikaCodec16AVLPacket {
    return new TeltonikaCodec16AVLPacket(data);
  }
}