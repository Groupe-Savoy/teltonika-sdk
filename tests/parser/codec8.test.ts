import { describe, it, expect } from 'vitest';
import { TeltonikaCodec8Parser, TeltonikaDataCodec } from '../../src/';

describe('TeltonikaCodec8Parser', () => {
  const parser = new TeltonikaCodec8Parser();

  describe('parsePacket', () => {
    it('should parse a codec 8 packet', () => {
      const raw = Buffer.from('000000000000004308020000016B40D57B480100000000000000000000000000000001010101000000000000016B40D5C198010000000000000000000000000000000101010101000000020000252C', 'hex');
      const packet = parser.parsePacket(raw);
      const [first, second] = packet.records;

      expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
      expect(packet.state.size).toBe(67);
      expect(packet.state.codecId).toBe(TeltonikaDataCodec.Codec8);
      expect(packet.state.numberOfData1).toBe(2);
      expect(packet.state.numberOfData2).toBe(2);
      expect(packet.state.crc).toBe(packet.calculatedCrc);

      expect(first?.timestamp).toStrictEqual(new Date('2019-06-10T10:01:01.000Z'));
      expect(first?.priority).toBe(1);
      expect(first?.event).toBe(1);
      expect(first?.gps).toStrictEqual({
        longitude: 0,
        latitude: 0,
        altitude: 0,
        angle: 0,
        satellites: 0,
        speed: 0
      });

      expect(first?.io).toStrictEqual({
        1: Buffer.from([0x00]),
      });

      expect(second?.timestamp).toStrictEqual(new Date('2019-06-10T10:01:19.000Z'));
      expect(second?.priority).toBe(1);
      expect(second?.event).toBe(1);
      expect(second?.gps).toStrictEqual({
        longitude: 0,
        latitude: 0,
        altitude: 0,
        angle: 0,
        satellites: 0,
        speed: 0
      });

      expect(second?.io).toStrictEqual({
        1: Buffer.from([0x01]),
      });
    });
  });
});
