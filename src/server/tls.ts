import { logger } from '@/logger';
import { TeltonikaBaseServer } from './base';
import { Server, createServer, TLSSocket, type TlsOptions } from 'node:tls';
import type { TeltonikaDataCodec, TeltonikaGPRSCodec } from '@/codec';

export class TeltonikaTLSServer<
  DC extends TeltonikaDataCodec, 
  GC extends TeltonikaGPRSCodec
> extends TeltonikaBaseServer<Server, TLSSocket, DC, GC> {
  constructor(options: {
    codecs: {
      data: DC;
      gprs: GC;
    };
    timeout?: number;
  } & TlsOptions) {
    super(options);
    this.server = createServer(options, this.onDeviceConnect.bind(this));
    this.server.on('tlsClientError', (e) => this.onDeviceError(undefined, e));
  }

  listen(port: number, host: string): Promise<void> {
    return new Promise<void>((res) => {
      this.server.listen(port, host, () => {
        logger.info(`tls server listen: ${host}:${port}`);
        res();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((res) => {  
      this.closeAllDevices();
      this.server.close(() => res());
    });
  }
}