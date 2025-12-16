import { HEADER_AVL_LENGTH, TeltonikaBasePacket, TeltonikaIoGroup } from "./base";
import type { TeltonikaCodec8AVLRecord } from "./codec8";

export const CODEC16_AVL_TIMESTAMP_LENGTH = 8;
export const CODEC16_AVL_PRIORITY_LENGTH = 1;
export const CODEC16_AVL_GPS_LENGTH = 15;
export const CODEC16_AVL_EVENT_IO_LENGTH = 2;
export const CODEC16_AVL_TYPE_IO_LENGTH = 1;
export const CODEC16_AVL_NUMBER_IO_LENGTH = 1;

export const CODEC16_IO_GROUPS = [
  TeltonikaIoGroup.N1,
  TeltonikaIoGroup.N2,
  TeltonikaIoGroup.N4,
  TeltonikaIoGroup.N8,
];

export const CODEC16_IO_LAYOUT = {
  countLength: 1,
  idLength: 2,
}

export enum TeltonikaCodec16IoType {
  OnExit = 0,
  OnEntrance = 1,
  OnBoth = 2,
  Reserved = 3,
  Hysteresis = 4,
  OnChange = 5,
  Eventual = 6,
  Periodical = 7
}

export type TeltonikaCodec16AVLRecord = TeltonikaCodec8AVLRecord & {
  type: TeltonikaCodec16IoType,
};

export class TeltonikaCodec16AVLPacket extends TeltonikaBasePacket<TeltonikaCodec16AVLRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec16AVLRecord[] {
    let offset = HEADER_AVL_LENGTH;
    const records: TeltonikaCodec16AVLRecord[] = [];

    for (let i = 0; i < this.numberOfData1; i++) {
      const timestamp = new Date(Number(raw.readBigUInt64BE(offset)));
      offset += CODEC16_AVL_TIMESTAMP_LENGTH;

      const priority = raw.readUInt8(offset);
      offset += CODEC16_AVL_PRIORITY_LENGTH;

      const gps = {
        longitude: raw.readInt32BE(offset) / 1e7,
        latitude: raw.readInt32BE(offset + 4) / 1e7,
        altitude: raw.readInt16BE(offset + 8),
        angle: raw.readUInt16BE(offset + 10),
        satellites: raw.readUInt8(offset + 12),
        speed: raw.readUInt16BE(offset + 13),
      };
      offset += CODEC16_AVL_GPS_LENGTH;

      const event = raw.readUInt16BE(offset);
      offset += CODEC16_AVL_EVENT_IO_LENGTH;

      const type = raw.readUInt8(offset);
      offset += CODEC16_AVL_TYPE_IO_LENGTH;

      const total = raw.readUInt8(offset);
      offset += CODEC16_AVL_NUMBER_IO_LENGTH;

      const start = offset;
      const io = this.parseIo(raw.subarray(start), total, CODEC16_IO_GROUPS, CODEC16_IO_LAYOUT);

      offset += this.calculateIoLength(raw.subarray(start), CODEC16_IO_GROUPS, CODEC16_IO_LAYOUT);

      records.push({
        timestamp,
        priority,
        gps,
        event,
        type,
        io,
      });
    }

    return records;
  }
}
