import { describe, it, assert, expect } from 'vitest';
import { TeltonikaCodec12ResponsePacket, TeltonikaGPRSCodec } from '../../src';

describe('TeltonikaCodec12ResponsePacket', () => {
  it('should throw an error if crc 16 is not matching', () => {
    assert.throws(
      () => {
        new TeltonikaCodec12ResponsePacket(
          Buffer.from('123456789123456789123456789')
        );
      },
      /CRC-16 validation failed/
    );
  });

  it('should parse response correctly (wiki example 1)', () => {
    const raw = Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex');
    const packet = new TeltonikaCodec12ResponsePacket(raw);
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

  it('should parse response correctly (wiki example 2)', () => {
    const raw = Buffer.from('00000000000000370C01060000002F4449313A31204449323A30204449333A302041494E313A302041494E323A313639323420444F313A3020444F323A3101000066E3', 'hex');
    const packet = new TeltonikaCodec12ResponsePacket(raw);
    const record = packet.records.at(0);

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(55);
    expect(packet.state.codecId).toBe(TeltonikaGPRSCodec.Codec12);
    expect(packet.state.numberOfData1).toBe(1);
    expect(packet.state.numberOfData2).toBe(1);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(record?.size).toStrictEqual(47);
    expect(record?.type).toStrictEqual(6);
    expect(record?.response).toBe('DI1:1 DI2:0 DI3:0 AIN1:0 AIN2:16924 DO1:0 DO2:1');
  });
});
