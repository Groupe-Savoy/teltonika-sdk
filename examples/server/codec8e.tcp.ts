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
  device.sendCommand(TeltonikaGPRSCodec.Codec12, 'getver')
});

server.on('response', (device, data) => {
  console.log(device.imei, data.records)
});

server.listen(4041, '0.0.0.0')