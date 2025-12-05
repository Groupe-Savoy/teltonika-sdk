import { TeltonikaDataCodec, TeltonikaGPRSCodec, TeltonikaTCPServer } from '@/index';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  }
});

server.on('data', (device, data) => {
  console.log(device.imei);
  console.log(data);
});

server.listen(4041, '0.0.0.0')