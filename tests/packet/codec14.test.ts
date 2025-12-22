import { describe, it, assert, expect } from 'vitest';
import { TeltonikaCodec14ResponsePacket, TeltonikaGPRSCodec } from '../../src';

describe('TeltonikaCodec14ResponsePacket', () => {
  it('should throw an error if crc 16 is not matching', () => {
    assert.throws(
      () => {
        new TeltonikaCodec14ResponsePacket(
          Buffer.from('123456789123456789123456789')
        );
      },
      /CRC-16 validation failed/
    );
  });

  it('should parse response correctly (wiki example 1)', () => {
    const raw = Buffer.from('00000000000000AB0E0106000000A303520930814522515665723A30332E31382E31345F3034204750533A41584E5F352E31305F333333332048773A464D42313230204D6F643A313520494D45493A33353230393330383134353232353120496E69743A323031382D31312D323220373A313320557074696D653A3137323334204D41433A363042444430303136323631205350433A312830292041584C3A30204F42443A3020424C3A312E362042543A340100007AAE', 'hex');
    const packet = new TeltonikaCodec14ResponsePacket(raw);
    const record = packet.records.at(0);

    expect(packet.state.preamble).toStrictEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(packet.state.size).toBe(171);
    expect(packet.state.codecId).toBe(TeltonikaGPRSCodec.Codec14);
    expect(packet.state.numberOfData1).toBe(1);
    expect(packet.state.numberOfData2).toBe(1);
    expect(packet.state.crc).toBe(packet.calculatedCrc);

    expect(record?.size).toStrictEqual(163);
    expect(record?.type).toStrictEqual(6);
    expect(record?.response).toBe('Ver:03.18.14_04 GPS:AXN_5.10_3333 Hw:FMB120 Mod:15 IMEI:352093081452251 Init:2018-11-22 7:13 Uptime:17234 MAC:60BDD0016261 SPC:1(0) AXL:0 OBD:0 BL:1');
  });
});
