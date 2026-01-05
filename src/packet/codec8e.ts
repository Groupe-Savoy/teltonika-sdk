import { HEADER_AVL_LENGTH, TeltonikaBasePacket, TeltonikaIoGroup } from './base';
import type { TeltonikaCodec8AVLRecord } from './codec8';

export const CODEC8E_AVL_TIMESTAMP_LENGTH = 8;
export const CODEC8E_AVL_PRIORITY_LENGTH = 1;
export const CODEC8E_AVL_GPS_LENGTH = 15;
export const CODEC8E_AVL_EVENT_IO_LENGTH = 2;
export const CODEC8E_AVL_NUMBER_IO_LENGTH = 2;

export const CODEC8E_IO_GROUPS = [
  TeltonikaIoGroup.N1,
  TeltonikaIoGroup.N2,
  TeltonikaIoGroup.N4,
  TeltonikaIoGroup.N8,
  TeltonikaIoGroup.NX,
];

export const CODEC8E_IO_LAYOUT = {
  countLength: 2,
  idLength: 2,
};

/**
 * Represents an AVL record for Teltonika Codec 8e.
 * Alias for TeltonikaCodec8AVLRecord.
 * 
 * @group Packet
 * @typedef {TeltonikaCodec8AVLRecord} TeltonikaCodec8eAVLRecord
 */
export type TeltonikaCodec8eAVLRecord = TeltonikaCodec8AVLRecord;

/**
 * Class for parsing Teltonika Codec 8e AVL packets.
 * Extends TeltonikaBasePacket to handle Codec 8e specific record parsing.
 * 
 * @class TeltonikaCodec8eAVLPacket
 * @group Packet
 * @extends TeltonikaBasePacket<TeltonikaCodec8eAVLRecord>
 * @example
 * ```ts
 * const packet = new TeltonikaCodec8eAVLPacket(rawBuffer);
 * const records = packet.records; // Array of TeltonikaCodec8eAVLRecord
 * ```
 */
export class TeltonikaCodec8eAVLPacket extends TeltonikaBasePacket<TeltonikaCodec8eAVLRecord> {
  /**
   * Parses the raw buffer into an array of TeltonikaCodec8eAVLRecord objects.
   * 
   * @param {Buffer} raw - The raw buffer containing the packet data.
   * @returns {TeltonikaCodec8eAVLRecord[]} An array of parsed AVL records.
   */
  parseRecords(raw: Buffer): TeltonikaCodec8eAVLRecord[] {
    let offset = HEADER_AVL_LENGTH;
    const records: TeltonikaCodec8eAVLRecord[] = [];

    for (let i = 0; i < this.numberOfData1; i++) {
      const timestamp = new Date(Number(raw.readBigUInt64BE(offset)));
      offset += CODEC8E_AVL_TIMESTAMP_LENGTH;

      const priority = raw.readUInt8(offset);
      offset += CODEC8E_AVL_PRIORITY_LENGTH;

      const gps = {
        longitude: raw.readInt32BE(offset) / 1e7,
        latitude: raw.readInt32BE(offset + 4) / 1e7,
        altitude: raw.readInt16BE(offset + 8),
        angle: raw.readUInt16BE(offset + 10),
        satellites: raw.readUInt8(offset + 12),
        speed: raw.readUInt16BE(offset + 13),
      };
      offset += CODEC8E_AVL_GPS_LENGTH;

      const event = raw.readUInt16BE(offset);
      offset += CODEC8E_AVL_EVENT_IO_LENGTH;

      const total = raw.readUInt16BE(offset);
      offset += CODEC8E_AVL_NUMBER_IO_LENGTH;

      const start = offset;
      const io = this.parseIo(raw.subarray(start), total, CODEC8E_IO_GROUPS, CODEC8E_IO_LAYOUT);

      offset += this.calculateIoLength(raw.subarray(start), CODEC8E_IO_GROUPS, CODEC8E_IO_LAYOUT);

      records.push({
        timestamp,
        priority,
        gps,
        event,
        io,
      });
    }

    return records;
  }
}
