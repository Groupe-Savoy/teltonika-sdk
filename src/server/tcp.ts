import { logger } from "@/logger";
import { TeltonikaBaseServer, type TeltonikaBaseServerOptions } from "./base";
import { Server, createServer, Socket } from 'node:net';
import { TeltonikaDevice } from "@/device";

export type TeltonikaTCPServerOptions = TeltonikaBaseServerOptions;

export class TeltonikaTCPServer extends TeltonikaBaseServer<Server, Socket> {
  constructor(options: TeltonikaTCPServerOptions) {
    super(options);
    this.server = createServer(this.onDeviceConnect.bind(this));
  }

  onDeviceConnect(socket: Socket) {
    const device = new TeltonikaDevice<Socket>({ socket });

    logger.info(`connect: ${device.uuid}`);
    this.addDevice(device);

    socket.on('data', (data) => {
      this.parsers.data.isImei(data) 
        ? this.onDeviceInit(device, data) 
        : this.onDeviceData(device, data);
    });

    socket.on('close', () => this.onDeviceClose(device));
  }

  onDeviceInit(device: TeltonikaDevice<Socket>, data: Buffer<ArrayBuffer>) {
    logger.info(`init: ${device.uuid}`);
    device.init(data.toString());

    this.emit('init', device);
  }

  onDeviceData(device: TeltonikaDevice<Socket>, data: Buffer<ArrayBuffer>) {
    logger.info(`data: ${device.uuid}`)
    
    device.socket.write(Buffer.from([0x00, 0x00, 0x00, 0x01]))
    this.emit('data', device, this.parsers.data.parseAVL(data));
  }

  onDeviceClose(device: TeltonikaDevice<Socket>) {
    logger.info(`close: ${device.uuid}`);
    this.removeDevice(device);
    this.emit('close', device);
  }

  listen(port: number, host: string): void {
    this.server.listen(port, host, () => logger.info(`listen: ${host}:${port}`));
  }
}