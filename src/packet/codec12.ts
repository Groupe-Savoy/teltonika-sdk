import { HEADER_RESPONSE_LENGTH, TeltonikaBasePacket } from './base';

export const CODEC12_RESPONSE_TYPE_LENGTH = 1;
export const CODEC12_RESPONSE_SIZE_LENGTH = 4;
export const CODEC12_HEADER_LENGTH = HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH + CODEC12_RESPONSE_SIZE_LENGTH;

/**
 * Represents a response record for Teltonika Codec 12.
 * Contains the response type, size, and response string.
 * 
 * @group Packet
 * @typedef {object} TeltonikaCodec12ResponseRecord
 * @property {number} type - The type of the response.
 * @property {number} size - The size of the response data.
 * @property {string} response - The response string.
 */
export type TeltonikaCodec12ResponseRecord = {
  type: number,
  size: number,
  response: string,
}

/**
 * Class for parsing Teltonika Codec 12 response packets.
 * Extends TeltonikaBasePacket to handle Codec 12 specific response parsing.
 * 
 * @class TeltonikaCodec12ResponsePacket
 * @group Packet
 * @extends TeltonikaBasePacket<TeltonikaCodec12ResponseRecord>
 * @example
 * ```ts
 * const packet = new TeltonikaCodec12ResponsePacket(rawBuffer);
 * const records = packet.records; // Array of TeltonikaCodec12ResponseRecord
 * ```
 */
export class TeltonikaCodec12ResponsePacket extends TeltonikaBasePacket<TeltonikaCodec12ResponseRecord> {
  /**
   * Parses the raw buffer into an array of TeltonikaCodec12ResponseRecord objects.
   * 
   * @param {Buffer} raw - The raw buffer containing the packet data.
   * @returns {TeltonikaCodec12ResponseRecord[]} An array of parsed response records.
   */
  parseRecords(raw: Buffer): TeltonikaCodec12ResponseRecord[] {
    const type = raw.subarray(HEADER_RESPONSE_LENGTH, HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH).readInt8(0);
    const size = raw.subarray(HEADER_RESPONSE_LENGTH + CODEC12_RESPONSE_TYPE_LENGTH, CODEC12_HEADER_LENGTH).readUInt32BE(0);
    const response = raw.subarray(CODEC12_HEADER_LENGTH, CODEC12_HEADER_LENGTH + size).toString();

    return [{
      type,
      size, 
      response,
    }];
  }
}
