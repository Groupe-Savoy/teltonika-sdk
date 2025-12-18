import { HEADER_AVL_LENGTH, TeltonikaBasePacket, TeltonikaIoGroup, type TeltonikaIo } from './base';

export const CODEC8_AVL_TIMESTAMP_LENGTH = 8;
export const CODEC8_AVL_PRIORITY_LENGTH = 1;
export const CODEC8_AVL_GPS_LENGTH = 15;
export const CODEC8_AVL_EVENT_IO_LENGTH = 1;
export const CODEC8_AVL_NUMBER_IO_LENGTH = 1;

export const CODEC8_IO_GROUPS = [
  TeltonikaIoGroup.N1,
  TeltonikaIoGroup.N2,
  TeltonikaIoGroup.N4,
  TeltonikaIoGroup.N8,
];

export const CODEC8_IO_LAYOUT = {
  countLength: 1,
  idLength: 1,
};

export type TeltonikaCodec8AVLRecord = {
  timestamp: Date;
  priority: number;
  gps: {
    longitude: number;
    latitude: number;
    altitude: number;
    angle: number;
    satellites: number;
    speed: number;
  };
  event: number;
  io: TeltonikaIo;
}

export class TeltonikaCodec8AVLPacket extends TeltonikaBasePacket<TeltonikaCodec8AVLRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec8AVLRecord[] {
    let offset = HEADER_AVL_LENGTH;
    const records: TeltonikaCodec8AVLRecord[] = [];

    for (let i = 0; i < this.numberOfData1; i++) {
      const timestamp = new Date(Number(raw.readBigUInt64BE(offset)));
      offset += CODEC8_AVL_TIMESTAMP_LENGTH;

      const priority = raw.readUInt8(offset);
      offset += CODEC8_AVL_PRIORITY_LENGTH;

      const gps = {
        longitude: raw.readInt32BE(offset) / 1e7,
        latitude: raw.readInt32BE(offset + 4) / 1e7,
        altitude: raw.readInt16BE(offset + 8),
        angle: raw.readUInt16BE(offset + 10),
        satellites: raw.readUInt8(offset + 12),
        speed: raw.readUInt16BE(offset + 13),
      };
      offset += CODEC8_AVL_GPS_LENGTH;

      const event = raw.readUInt8(offset);
      offset += CODEC8_AVL_EVENT_IO_LENGTH;

      const total = raw.readUInt8(offset);
      offset += CODEC8_AVL_NUMBER_IO_LENGTH;

      const start = offset;
      const io = this.parseIo(raw.subarray(start), total, CODEC8_IO_GROUPS, CODEC8_IO_LAYOUT);

      offset += this.calculateIoLength(raw.subarray(start), CODEC8_IO_GROUPS, CODEC8_IO_LAYOUT);

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
