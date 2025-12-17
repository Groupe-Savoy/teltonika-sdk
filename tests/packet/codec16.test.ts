import { describe, it, assert, expect } from 'vitest';
import { TeltonikaCodec16AVLPacket } from '../../src/packet/codec16';
import { TeltonikaDataCodec } from '../../src/codec';

describe('TeltonikaCodec8eAVLPacket', () => {
  it('should throw an error if crc 16 is not matching', () => {
    assert.throws(
      () => {
        new TeltonikaCodec16AVLPacket(
          Buffer.from('123456789123456789123456789')
        );
      },
      /CRC-16 validation failed/
    );
  });

  it('should parse IO correctly (wiki example 1)', () => {
    const raw = Buffer.from('000000000000005F10020000016BDBC7833000000000000000000000000000000000000B05040200010000030002000B00270042563A00000000016BDBC7871800000000000000000000000000000000000B05040200010000030002000B00260042563A00000200005FB3', 'hex');
    const packet = new TeltonikaCodec16AVLPacket(raw);
    const [first, second] = packet.records;

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(95);
    expect(packet.state.codecId).toBe(TeltonikaDataCodec.Codec16);
    expect(packet.state.numberOfData1).toBe(2);
    expect(packet.state.numberOfData2).toBe(2);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(first?.timestamp).toStrictEqual(new Date('2019-07-10T12:06:54.000Z'));
    expect(first?.priority).toBe(0);
    expect(first?.event).toBe(11);
    expect(first.type).toBe(5);
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
      3: Buffer.from([0x00]),
      11: Buffer.from([0x00, 0x27]),
      66: Buffer.from([0x56, 0x3a])
    });

    expect(second?.timestamp).toStrictEqual(new Date('2019-07-10T12:06:55.000Z'));
    expect(second?.priority).toBe(0);
    expect(second?.event).toBe(11);
    expect(second?.type).toBe(5);

    expect(second?.gps).toStrictEqual({
      longitude: 0,
      latitude: 0,
      altitude: 0,
      angle: 0,
      satellites: 0,
      speed: 0
    });

    expect(second?.io).toStrictEqual({
      1: Buffer.from([0x00]),
      3: Buffer.from([0x00]),
      11: Buffer.from([0x00, 0x26]),
      66: Buffer.from([0x56, 0x3a])
    });
  });
});
