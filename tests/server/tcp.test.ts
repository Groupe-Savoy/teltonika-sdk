import { createConnection, Socket } from 'net';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  TeltonikaCodec12Command,
  TeltonikaCodec12ResponsePacket, 
  TeltonikaCodec8eAVLPacket, 
  TeltonikaDataCodec, 
  TeltonikaGPRSCodec, 
  TeltonikaTCPServer 
} from '../../src';

function wait(
  c: Socket|TeltonikaTCPServer<TeltonikaDataCodec.Codec8e, TeltonikaGPRSCodec.Codec12>, 
  event: string
) {
  return new Promise<void>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    c.once(event, resolve);
  });
}

describe('TeltonikaTCPServer', () => {
  let server: TeltonikaTCPServer<TeltonikaDataCodec.Codec8e, TeltonikaGPRSCodec.Codec12>;

  beforeEach(async () => {
    vi.clearAllMocks();

    server = new TeltonikaTCPServer({
      codecs: {
        data: TeltonikaDataCodec.Codec8e,
        gprs: TeltonikaGPRSCodec.Codec12
      },
      timeout: 10000,
    });

    await server.listen(4040, '0.0.0.0');
  });

  afterEach(async () => {
    await server.close();
  });

  it('should register a device', async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040 });
    
    server.on('init', spy);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    expect(server.getDevice('356307042441013').imei).toBe('356307042441013');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should get device data', async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040 });
    
    server.on('data', spy);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    client.write(Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex'));
    await wait(client, 'data');

    const device = server.getDevice('356307042441013');
    const packet = new TeltonikaCodec8eAVLPacket(Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex'));

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(device, packet);
  });

  it('should get device data buffered', async () => {
    const spyBuffer = vi.fn();
    const spyData = vi.fn();
    const client = createConnection({ port: 4040 });
    
    server.on('data', spyData);
    server.on('buffer', spyBuffer);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    client.write(Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B0000000035', 'hex'));
    client.write(Buffer.from('44C87A000E000000001DD7E06A00000100002994', 'hex'));
    await wait(client, 'data');

    const device = server.getDevice('356307042441013');
    const packet = new TeltonikaCodec8eAVLPacket(Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', 'hex'));

    expect(spyBuffer).toHaveBeenCalledTimes(2);
    expect(spyData).toHaveBeenCalledTimes(1);
    expect(spyData).toHaveBeenCalledWith(device, packet);
  });

  it('should get device responce', async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040 });
    
    server.on('response', spy);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    client.write(Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex'));
    await wait(server, 'response');

    const device = server.getDevice('356307042441013');
    const packet = new TeltonikaCodec12ResponsePacket(Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex'));

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(device, packet);
  });

  it('should get a device timeout', { timeout: 20000 }, async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040, keepAlive: false });

    server.on('timeout', spy);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(server, 'timeout');

    const device = server.getDevice('356307042441013');

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(device);
  });

  it('should get a device error', async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040 });
    
    server.on('error', spy);
    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    client.write(Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F3724444220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex'));
    await wait(server, 'error');

    const device = server.getDevice('356307042441013');

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(device, new Error('CRC-16 validation failed: expected 51087 got 7778'));
  });

  it('should send a command to the device', async () => {
    const spy = vi.fn();
    const client = createConnection({ port: 4040 });

    await wait(client, 'connect');
    
    client.write(Buffer.from('000F333536333037303432343431303133', 'hex'));
    await wait(client, 'data');

    client.on('data', spy);
    server.sendCommand('356307042441013', 'getver');
    await wait(client, 'data');

    const cmd = new TeltonikaCodec12Command('getver');

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(cmd.toBuffer());
  });
});