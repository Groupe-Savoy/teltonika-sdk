import { describe, it, expect } from 'vitest';
import { TeltonikaCodec8eParser, TeltonikaDataCodec } from '../../src/';

describe('TeltonikaCodec8eParser', () => {
  const parser = new TeltonikaCodec8eParser();

  describe('isImei', () => {
    it('should return false if is not an imei', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
      const isImei = parser.isImei(raw);

      expect(isImei).toBe(false);
    });

    it('should return true if is an imei', () => {
      const raw = Buffer.from('000F333536333037303432343431303133', 'hex');
      const isImei = parser.isImei(raw);

      expect(isImei).toBe(true);
    });
  });

  describe('parseImei', () => {
    it('should parse the imei of a packet', () => {
      const raw = Buffer.from('000F333536333037303432343431303133', 'hex');
      const imei = parser.parseImei(raw);

      expect(imei).toBe('356307042441013');
    });
  });

  describe('isPacket', () => {
    it('should false if is not a codec8e packet', () => {
      const raw = Buffer.from('000F333536333037303432343431303133', 'hex');
      const isPacket = parser.isPacket(raw);

      expect(isPacket).toBe(false);
    });

    it('should true if is a codec8e packet', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
      const isPacket = parser.isPacket(raw);

      expect(isPacket).toBe(true);
    });
  });

  describe('isCompletPacket', () => {
    it('should return false if the packet is uncomplet', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015', 'hex');
      const isComplet = parser.isCompletPacket(raw);

      expect(isComplet).toBe(false);
    });

    it('should return true if the packet is complet', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
      const isComplet = parser.isCompletPacket(raw);

      expect(isComplet).toBe(true);
    });
  });

  describe('parsePacket', () => {
    it('should parse a codec8e packet', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
      const packet = parser.parsePacket(raw);
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
});
