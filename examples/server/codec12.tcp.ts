import { TeltonikaDataCodec, TeltonikaGPRSCodec, TeltonikaTCPServer } from '@/index';

const server = new TeltonikaTCPServer({
  codecs: {
    data: TeltonikaDataCodec.Codec8e,
    gprs: TeltonikaGPRSCodec.Codec12
  },
  timeout: 60000
});

server.on('init', (device) => {
  setTimeout(() => device.sendCommand('getver'), 1000);
  setTimeout(() => device.sendCommand('getinfo'), 2000);

  // The server can also send direct command to a specific device.
  setTimeout(() => server.sendCommand(device.imei!, 'cpureset'), 10000);
});

server.on('response', (device, data) => {
  console.log(device.imei, data.records)
})

server.on('error', (device, error) => {
  console.log('error', device.imei, error)
});

server.listen(4041, '0.0.0.0')