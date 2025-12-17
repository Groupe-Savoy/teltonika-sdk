import { describe, it, assert, expect } from 'vitest';
import { TeltonikaCodec8eAVLPacket } from '../../src/packet/codec8e';
import { TeltonikaDataCodec } from '../../src/codec';

describe('TeltonikaCodec8eAVLPacket', () => {
  it('should throw an error if crc 16 is not matching', () => {
    assert.throws(
      () => {
        new TeltonikaCodec8eAVLPacket(
          Buffer.from('123456789123456789123456789')
        );
      },
      /CRC-16 validation failed/
    );
  });

  it('should parse IO correctly (wiki example 1)', () => {
    const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
    const packet = new TeltonikaCodec8eAVLPacket(raw);
    const record = packet.records.at(0);

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(74);
    expect(packet.state.codecId).toBe(TeltonikaDataCodec.Codec8e);
    expect(packet.state.numberOfData1).toBe(1);
    expect(packet.state.numberOfData2).toBe(1);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(record?.timestamp).toStrictEqual(new Date('2019-06-10T11:36:32.000Z'));
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
      11: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x35, 0x44, 0xC8, 0x7A]),
      14: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x1D, 0xD7, 0xE0, 0x6A]),
      16: Buffer.from([0x01, 0x5E, 0x2C, 0x88]),
      17: Buffer.from([0x00, 0x1D]),
    });
  });
});
