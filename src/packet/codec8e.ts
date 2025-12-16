import { TeltonikaBasePacket } from "./base";

export interface TeltonikaCodec8eAVLRecord {
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
  io: Record<number, number>;
}

export class TeltonikaCodec8eAVLPacket extends TeltonikaBasePacket<TeltonikaCodec8eAVLRecord> {
  parseRecords(raw: Buffer): TeltonikaCodec8eAVLRecord[] {
    let buffer = raw.subarray(10);
  
    const records = Array.from({ length: this.numberOfData1 }).reduce<TeltonikaCodec8eAVLRecord[]>((acc) => {
      const timestamp = new Date(Number(buffer.readBigUInt64BE(0)));
      buffer = buffer.subarray(8);
  
      const priority = buffer.readUInt8(0);
      buffer = buffer.subarray(1);
  
      const gps = {
        longitude: buffer.readInt32BE(0),
        latitude: buffer.readInt32BE(4),
        altitude: buffer.readInt16BE(8),
        angle: buffer.readUInt16BE(10),
        satellites: buffer.readUInt8(12),
        speed: buffer.readUInt16BE(13),
      };
      buffer = buffer.subarray(15);
  
      const event = buffer.readUInt16BE(0);
      const total = buffer.readUInt16BE(2);
  
      buffer = buffer.subarray(4);
  
      acc.push({
        timestamp,
        priority,
        gps,
        event,
        io: this.parseIo(buffer, total),
      });
  
      return acc;
    }, []);
  
    return records;
  }

  parseIo(data: Buffer, total: number) {
    const io: Record<number, number> = {};
    // TODO: Parse io
    return io;
  }
}