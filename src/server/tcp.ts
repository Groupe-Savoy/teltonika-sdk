import { logger } from '@/logger';
import { TeltonikaBaseServer } from './base';
import { Server, createServer, Socket } from 'node:net';
import type { TeltonikaDataCodec, TeltonikaGPRSCodec } from '@/codec';

/**
 * TCP server for handling Teltonika device connections.
 * Extends TeltonikaBaseServer to provide TCP-based communication.
 * 
 * @class TeltonikaTCPServer
 * @group Server
 * @extends TeltonikaBaseServer<Server, Socket, DC, GC>
 * @template DC - Data codec type
 * @template GC - GPRS codec type
 * @example
 * ```ts
 * const server = new TeltonikaTCPServer({
 *   codecs: { 
 *     data: TeltonikaDataCodec.Codec8e, 
 *     gprs: TeltonikaGPRSCodec.Codec12 
 *   },
 * });
 * 
 * await server.listen(8080, '0.0.0.0');
 * ```
 */
export class TeltonikaTCPServer<
  DC extends TeltonikaDataCodec, 
  GC extends TeltonikaGPRSCodec
> extends TeltonikaBaseServer<Server, Socket, DC, GC> {
  /**
   * Creates an instance of TeltonikaTCPServer.
   * @param {object} options - Server configuration options.
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
  }) {
    super(options);
    this.server = createServer(this.onDeviceConnect.bind(this));
  }

  /**
   * Starts the TCP server listening on the specified port and host.
   * 
   * @param {number} port - The port to listen on.
   * @param {string} host - The host address to bind to.
   * @returns {Promise<void>} A promise that resolves when the server starts listening.
   */
  listen(port: number, host: string): Promise<void> {
    return new Promise<void>((res) => {
      this.server.listen(port, host, () => {
        logger.info(`tcp server listen: ${host}:${port}`);
        return res();
      });
    });
  }

  /**
   * Closes the TCP server and all connected devices.
   * 
   * @returns {Promise<void>} A promise that resolves when the server is closed.
   */
  close() {
    return new Promise<void>((res) => {      
      this.closeAllDevices();
      this.server.close(() => res());
    });
  }
}