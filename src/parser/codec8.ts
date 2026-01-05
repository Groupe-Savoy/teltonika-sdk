import { TeltonikaDataCodec, type TeltonikaCodec } from '@/codec';
import { TeltonikaBaseParser } from './base';
import { TeltonikaCodec8AVLPacket } from '@/packet/codec8';

/**
 * Parser for Teltonika Codec 8 packets.
 * Extends TeltonikaBaseParser to handle Codec 8 specific packet parsing.
 * 
 * @class TeltonikaCodec8Parser
 * @group Parser
 * @extends TeltonikaBaseParser<TeltonikaCodec8AVLPacket>
 * @example
 * ```ts
 * const parser = new TeltonikaCodec8Parser();
 * const packet = parser.parsePacket(rawBuffer);
 * console.log(packet.records);
 * ```
 */
export class TeltonikaCodec8Parser extends TeltonikaBaseParser<TeltonikaCodec8AVLPacket> {
  /**
   * The codec identifier for Codec 8.
   * @type {TeltonikaCodec}
   */
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8;

  /**
   * Parses the raw buffer into a TeltonikaCodec8AVLPacket.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {TeltonikaCodec8AVLPacket} The parsed packet.
   */
  parsePacket(data: Buffer): TeltonikaCodec8AVLPacket {
    return new TeltonikaCodec8AVLPacket(data);
  }
}