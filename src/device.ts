import type { Socket } from 'node:net';
import { v4 as uuid } from 'uuid';
import { createBuffer } from './utils';
import type { TeltonikaGPRSCodec } from './codec';
import { TeltonikaCommandFactory } from './command';

/**
 * Represents a single Teltonika device connection over a network socket.
 * This class manages the device's state, incoming data buffering, and command sending.
 * 
 * @class TeltonikaDevice
 * @group Device
 */
export class TeltonikaDevice<T extends Socket> {
  /**
   * Unique identifier for this device instance.
   */
  public uuid: string;

  /**
   * IMEI of the connected Teltonika device.
   * Undefined until the device is initialized.
   */
  public imei?: string;

  /**
   * The GPRS codec used by this device for command communication.
   * Undefined until the device is initialized.
   */
  public gprs?: TeltonikaGPRSCodec;

  /**
   * The underlying network socket for communicating with the device.
   */
  public socket: T;

  /**
   * Buffer to temporarily store incoming data from the device until processed.
   */
  public buffer: Buffer = Buffer.from([]);

  /**
   * Indicates whether the device currently has unprocessed buffered data.
   * @readonly
   */
  get isWaitingPacket() {
    return this.buffer.length !== 0;
  }

  /**
   * Indicates whether the device has been initialized (IMEI assigned).
   * @readonly
   */
  get isInit() {
    return this.imei !== undefined;
  }

  /**
   * Creates a new TeltonikaDevice instance.
   * @param {Object} options
   * @param {T} options.socket - The network socket to use for communication.
   */
  constructor({ socket }: { socket: T }) {
    this.uuid = uuid();
    this.socket = socket;
  }

  /**
   * Initializes the device with its IMEI and GPRS codec.
   * Sends a handshake byte (0x01) to the device after initialization.
   * @param {string} imei - The IMEI of the device.
   * @param {TeltonikaGPRSCodec} gprs - The GPRS codec for command communication.
   */
  init(imei: string, gprs: TeltonikaGPRSCodec) {
    this.imei = imei;
    this.gprs = gprs;
    this.socket.write(createBuffer(1, Buffer.from([0x01])));
  }

  /**
   * Sends a command to the device using the specified codec or the device's default GPRS codec.
   * @param {string} cmd - The command string to send.
   * @param {TeltonikaGPRSCodec} [codec] - Optional codec to override the device's default codec.
   */
  sendCommand(cmd: string, codec?:  TeltonikaGPRSCodec) {
    const command = TeltonikaCommandFactory.createCommand(codec || this.gprs!, cmd, this.imei);

    this.socket.write(command.toBuffer());
  }

  /**
   * Appends incoming data to the device's internal buffer.
   * @param {Buffer} data - The incoming data chunk.
   */
  bufferPacket(data: Buffer) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }

  /**
   * Clears the device's internal buffer.
   */
  clearBuffer() {
    this.buffer = Buffer.from([]);
  }

  /**
   * Closes the connection with the device.
   */
  close() {
    this.socket.destroy();
  }
}