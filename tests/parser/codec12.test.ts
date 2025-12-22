import { describe, it, expect } from 'vitest';
import { TeltonikaCodec12Parser, TeltonikaGPRSCodec } from '../../src/';

describe('TeltonikaCodec8Parser', () => {
  const parser = new TeltonikaCodec12Parser();

  describe('isPacket', () => {
    it('should return false if is a codec 12 packet', () => {
      const raw = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex');
      const isPacket = parser.isPacket(raw);

      expect(isPacket).toBe(false);
    });

    it('should return true if is a codec 12 packet', () => {
      const raw = Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex');
      const isPacket = parser.isPacket(raw);

      expect(isPacket).toBe(true);
    });
  });

  describe('parsePacket', () => {
    it('should parse a codec 12 packet', () => {
      const raw = Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex');
      const packet = parser.parsePacket(raw);
      const record = packet.records.at(0);

      expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
      expect(packet.state.size).toBe(144);
      expect(packet.state.codecId).toBe(TeltonikaGPRSCodec.Codec12);
      expect(packet.state.numberOfData1).toBe(1);
      expect(packet.state.numberOfData2).toBe(1);
      expect(packet.state.crc).toBe(packet.calculatedCrc);

      expect(record?.size).toStrictEqual(136);
      expect(record?.type).toStrictEqual(6);
      expect(record?.response).toBe('INI:2019/7/22 7:22 RTC:2019/7/22 7:53 RST:2 ERR:1 SR:0 BR:0 CF:0 FG:0 FL:0 TU:0/0 UT:0 SMS:0 NOGPS:0:30 GPS:1 SAT:0 RS:3 RF:65 SF:1 MD:0');
    });
  });
});
