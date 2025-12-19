import { TeltonikaDataCodec, TeltonikaGPRSCodec, TeltonikaTLSServer } from '@/index';
import { readFileSync } from 'node:fs';

const server = new TeltonikaTLSServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  },
  timeout: 60000,

  // Generate certificate from https://wiki.teltonika-gps.com/view/How_to_generate_TLS_certificates_(Windows)%3F# 
  key: readFileSync('./examples/server/platform.key'),
  cert: readFileSync('./examples/server/platform.crt'),
});

server.on('data', (device, data) => {
  console.log(device.imei, data.records);
});

server.on('buffer', (device, data) => {
  console.log(device.imei, data.toString('hex'));
});

server.on('error', (device, error) => {
  console.log('error', device?.imei, error);
});

server.listen(4041, '0.0.0.0');