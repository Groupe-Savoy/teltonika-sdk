import { logger } from "@/logger";
import { TeltonikaBaseServer } from "./base";
import { Server, createServer, Socket } from 'node:net';
import type { TeltonikaDataCodec, TeltonikaGPRSCodec } from "@/codec";

export class TeltonikaTCPServer<
  DC extends TeltonikaDataCodec, 
  GC extends TeltonikaGPRSCodec
> extends TeltonikaBaseServer<Server, Socket, DC, GC> {
  constructor(options: {
    codecs: {
      data: DC;
      gprs: GC;
    };
    timeout?: number;
  }) {
    super(options);
    this.server = createServer(this.onDeviceConnect.bind(this));
  }

  listen(port: number, host: string): void {
    this.server.listen(port, host, () => logger.info(`tcp server listen: ${host}:${port}`));
  }

  close() {
    this.server.close();
    this.closeAllDevices();
  }
}