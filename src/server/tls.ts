import { logger } from '@/logger';
import { TeltonikaBaseServer } from './base';
import { Server, createServer, TLSSocket, type TlsOptions } from 'node:tls';
import type { TeltonikaDataCodec, TeltonikaGPRSCodec } from '@/codec';

/**
 * TLS server for handling secure Teltonika device connections.
 * Extends TeltonikaBaseServer to provide TLS-based communication.
 * 
 * @class TeltonikaTLSServer
 * @group Server
 * @extends TeltonikaBaseServer<Server, TLSSocket, DC, GC>
 * @template DC - Data codec type
 * @template GC - GPRS codec type
 * @example
 * ```ts
 * const server = new TeltonikaTLSServer({
 *   codecs: { 
 *     data: TeltonikaDataCodec.Codec8e, 
 *     gprs: TeltonikaGPRSCodec.Codec12 
 *   },
 *   key: fs.readFileSync('server-key.pem'),
 *   cert: fs.readFileSync('server-cert.pem')
 * });
 * 
 * await server.listen(8443, '0.0.0.0');
 * ```
 */
export class TeltonikaTLSServer<
  DC extends TeltonikaDataCodec, 
  GC extends TeltonikaGPRSCodec
> extends TeltonikaBaseServer<Server, TLSSocket, DC, GC> {
  /**
   * Creates an instance of TeltonikaTLSServer.
   * @param {object} options - Server configuration options including TLS options.
   * @param {object} options.codecs - Codec configuration.
   * @param {DC} options.codecs.data - Data codec.
   * @param {GC} options.codecs.gprs - GPRS codec.
   * @param {number} [options.timeout] - Optional socket timeout.
   */
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

  /**
   * Starts the TLS server listening on the specified port and host.
   * 
   * @param {number} port - The port to listen on.
   * @param {string} host - The host address to bind to.
   * @returns {Promise<void>} A promise that resolves when the server starts listening.
   */
  listen(port: number, host: string): Promise<void> {
    return new Promise<void>((res) => {
      this.server.listen(port, host, () => {
        logger.info(`tls server listen: ${host}:${port}`);
        res();
      });
    });
  }

  /**
   * Closes the TLS server and all connected devices.
   * 
   * @returns {Promise<void>} A promise that resolves when the server is closed.
   */
  close(): Promise<void> {
    return new Promise((res) => {  
      this.closeAllDevices();
      this.server.close(() => res());
    });
  }
}