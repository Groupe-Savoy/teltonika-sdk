import { describe, it, assert, expect } from 'vitest';
import { TeltonikaCodec8AVLPacket, TeltonikaDataCodec } from '../../src/';

describe('TeltonikaCodec8AVLPacket', () => {
  it('should throw an error if crc 16 is not matching', () => {
    assert.throws(
      () => {
        new TeltonikaCodec8AVLPacket(
          Buffer.from('123456789123456789123456789')
        );
      },
      /CRC-16 validation failed/
    );
  });

  it('should parse IO correctly (wiki example 1)', () => {
    const raw = Buffer.from('000000000000003608010000016B40D8EA30010000000000000000000000000000000105021503010101425E0F01F10000601A014E0000000000000000010000C7CF', 'hex');
    const packet = new TeltonikaCodec8AVLPacket(raw);
    const record = packet.records.at(0);

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(54);
    expect(packet.state.codecId).toBe(TeltonikaDataCodec.Codec8);
    expect(packet.state.numberOfData1).toBe(1);
    expect(packet.state.numberOfData2).toBe(1);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(record?.timestamp).toStrictEqual(new Date('2019-06-10T10:04:46.000Z'));
    expect(record?.priority).toBe(1);
    expect(record?.event).toBe(1);
    expect(record?.gps).toStrictEqual({
      longitude: 0,
      latitude: 0,
      altitude: 0,
      angle: 0,
      satellites: 0,
      speed: 0
    });

    expect(record?.io).toStrictEqual({
      1: Buffer.from([0x01]),
      21: Buffer.from([0x03]),
      66: Buffer.from([0x5e, 0x0f]),
      78: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      241: Buffer.from([0x00, 0x00, 0x60, 0x1a]),
    });
  });

  it('should parse IO correctly (wiki example 2)', () => {
    const raw = Buffer.from('000000000000002808010000016B40D9AD80010000000000000000000000000000000103021503010101425E100000010000F22A', 'hex'); 
    const packet = new TeltonikaCodec8AVLPacket(raw);
    const record = packet.records.at(0);

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(40);
    expect(packet.state.codecId).toBe(TeltonikaDataCodec.Codec8);
    expect(packet.state.numberOfData1).toBe(1);
    expect(packet.state.numberOfData2).toBe(1);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(record?.timestamp).toStrictEqual(new Date('2019-06-10T10:05:36.000Z'));
    expect(record?.priority).toBe(1);
    expect(record?.event).toBe(1);
    expect(record?.gps).toStrictEqual({
      longitude: 0,
      latitude: 0,
      altitude: 0,
      angle: 0,
      satellites: 0,
      speed: 0
    });

    expect(record?.io).toStrictEqual({
      1: Buffer.from([0x01]),
      21: Buffer.from([0x03]),
      66: Buffer.from([0x5e, 0x10])
    });
  });

  it('should parse multiple records and IO (wiki example 3)', () => {
    const raw = Buffer.from('000000000000004308020000016B40D57B480100000000000000000000000000000001010101000000000000016B40D5C198010000000000000000000000000000000101010101000000020000252C', 'hex');
    const packet = new TeltonikaCodec8AVLPacket(raw);
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
