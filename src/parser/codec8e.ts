import { TeltonikaDataCodec, type TeltonikaCodec } from '@/codec';
import { TeltonikaBaseParser } from './base';
import { TeltonikaCodec8eAVLPacket } from '@/packet/codec8e';

/**
 * Parser for Teltonika Codec 8e packets.
 * Extends TeltonikaBaseParser to handle Codec 8e specific packet parsing.
 * 
 * @class TeltonikaCodec8eParser
 * @group Parser
 * @extends TeltonikaBaseParser<TeltonikaCodec8eAVLPacket>
 * @example
 * ```ts
 * const parser = new TeltonikaCodec8eParser();
 * const packet = parser.parsePacket(rawBuffer);
 * console.log(packet.records);
 * ```
 */
export class TeltonikaCodec8eParser extends TeltonikaBaseParser<TeltonikaCodec8eAVLPacket> {
  /**
   * The codec identifier for Codec 8e.
   * @type {TeltonikaCodec}
   */
  static codec: TeltonikaCodec = TeltonikaDataCodec.Codec8e;

  /**
   * Parses the raw buffer into a TeltonikaCodec8eAVLPacket.
   * 
   * @param {Buffer} data - The raw packet buffer.
   * @returns {TeltonikaCodec8eAVLPacket} The parsed packet.
   */
  parsePacket(data: Buffer): TeltonikaCodec8eAVLPacket {
    return new TeltonikaCodec8eAVLPacket(data);
  }  
}