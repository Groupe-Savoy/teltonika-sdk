import { TeltonikaDataCodec, TeltonikaGPRSCodec, TeltonikaTCPServer } from '@/index';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  },
  timeout: 60000
});

server.on('data', (device, data) => {
  console.log(device.imei, data.records);
});

server.on('buffer', (device, data) => {
  console.log(device.imei, data.toString('hex'))
});

server.on('error', (device, error) => {
  console.log('error', device.imei, error)
});

server.listen(4041, '0.0.0.0')