import { inspect } from 'util';
import { calculateCrc, createBuffer } from '@/utils';

/**
 * @group Command
 * @typedef {Object} TeltonikaBaseCommandConstructor
 * @property {Buffer} [preamble] - Optional preamble of the command (default: 4 zero bytes).
 * @property {Buffer} type - Command type identifier.
 * @property {Buffer} codecId - Codec ID used for the command.
 * @property {Buffer} numberOfCmd - Number of commands in this message.
 * @property {string} cmd - The actual command string.
 * @property {Buffer} [imei] - Optional IMEI buffer for device-specific commands.
 */
export type TeltonikaBaseCommandConstructor = {
  preamble?: Buffer;
  type: Buffer;
  codecId: Buffer;
  numberOfCmd: Buffer;
  cmd: string;
  imei?: Buffer;
}

/**
 * Abstract base class representing a Teltonika GPRS command.
 * Handles building the command buffer, computing CRC, and formatting for transmission.
 * Subclasses must implement `getContent` and `toBuffer` for codec-specific behavior.
 * 
 * @abstract
 * @class TeltonikaBaseCommand
 * @group Command
 * @document ../../docs/command.md
 * @example
 * export class TeltonikaCodec12Command extends TeltonikaBaseCommand {
 *  constructor(cmd: string) {
 *    super({
 *      codecId: Buffer.from([TeltonikaGPRSCodec.Codec12]),
 *      type: Buffer.from([0x05]), 
 *      numberOfCmd: Buffer.from([0x01]),
 *      cmd,
 *    });
 *  }
 *
 *  getContent() {
 *    return Buffer.concat([ 
 *      // Add the codec specification 
 *    ])
 *  }
 *
 *  toBuffer() {
 *    return Buffer.concat([
 *      // Add the codec specification
 *    ])
 *  }
 * }
 */
export abstract class TeltonikaBaseCommand {
  /** Command preamble (default 4 zero bytes) */
  protected preamble!: Buffer;

  /** Codec ID for this command */
  protected codecId!: Buffer;

  /** Command type identifier */
  protected type!: Buffer;

  /** Number of commands in the message */
  protected numberOfCmd!: Buffer;

  /** Size of the command string */
  protected cmdSize!: Buffer;

  /** Full content buffer of the command (to be sent) */
  protected content!: Buffer;

  /** Command as a buffer */
  protected cmd!: Buffer;

  /** IMEI buffer for device-specific commands */
  protected imei?: Buffer;

  /**
   * Returns the 4-byte buffer representing the size of the content.
   * @readonly
   */
  get dataSize() {
    return createBuffer(4, Buffer.from([this.content.length]));
  }

  /**
   * Returns the 4-byte CRC-16 checksum buffer for the content.
   * @readonly
   */
  get crc() {
    return createBuffer(4, Buffer.from(calculateCrc(this.content).toString(16), 'hex'));
  }

  /**
   * Initializes the command with the provided constructor data.
   * Computes content and command size buffers.
   * @param {TeltonikaBaseCommandConstructor} data - Command initialization data.
   */
  constructor(data: TeltonikaBaseCommandConstructor) {
    this.preamble = data.preamble || Buffer.from([0x00, 0x00, 0x00, 0x00]);
    this.codecId = data.codecId;
    this.numberOfCmd = data.numberOfCmd;
    this.type = data.type;
    this.cmd = Buffer.from(data.cmd);
    this.imei = data.imei;

    this.cmdSize = createBuffer(4, Buffer.from([this.cmd.length]));
    this.content = this.getContent();
  }

  /**
   * Custom inspection for Node.js console to display the command buffer.
   */
  [inspect.custom]() {
    return this.toBuffer();
  }

  /**
   * Returns the command as a hexadecimal string representation.
   * @returns {string} Hex string of the command buffer.
   */
  public toString() {
    return this.toBuffer().toString('hex').toUpperCase();
  }

  /**
   * Returns the content buffer of the command.
   * Must be implemented in subclasses.
   * @abstract
   * @returns {Buffer}
   */
  abstract getContent(): Buffer;

  /**
   * Returns the full command buffer ready for transmission.
   * Must be implemented in subclasses.
   * @abstract
   * @returns {Buffer}
   */
  abstract toBuffer(): Buffer;
}