import { TeltonikaGPRSCodec } from '@/codec';
import { TeltonikaBaseCommand } from './base';
import { createBuffer, imeiToBuffer } from '@/utils';

/**
 * Represents a command for Teltonika Codec 14.
 * This class extends TeltonikaBaseCommand to handle Codec 14 specific command formatting,
 * including IMEI support.
 * 
 * @class TeltonikaCodec14Command
 * @group Command
 * @document ../../docs/command.md
 * @example
 * const command = new TeltonikaCodec14Command('getinfo', '123456789012345');
 * const buffer = command.toBuffer();
 */
export class TeltonikaCodec14Command extends TeltonikaBaseCommand {
  /**
   * Creates an instance of TeltonikaCodec14Command.
   * @param {string} cmd - The command string to be sent.
   * @param {string?} imei - The IMEI string for the device (optional, defaults to empty).
   */
  constructor(cmd: string, imei: string = '') {
    super({
      codecId: Buffer.from([TeltonikaGPRSCodec.Codec14]),
      type: Buffer.from([0x05]), 
      numberOfCmd: Buffer.from([0x01]),
      cmd,
      imei: imeiToBuffer(imei),
    });
  }

  /**
   * Gets the content buffer for the command.
   * 
   * @returns {Buffer} The concatenated buffer containing codec ID, number of commands,
   * type, command size (including IMEI), IMEI, command, and number of commands.
   */
  getContent() {
    return Buffer.concat([
      this.codecId, 
      this.numberOfCmd, 
      this.type, 
      createBuffer(4, Buffer.from([this.cmd.length + this.imei!.length])), 
      this.imei!,
      this.cmd, 
      this.numberOfCmd
    ]);
  }

  /**
   * Converts the command to a full buffer including preamble, data size, content, and CRC.
   * 
   * @returns {Buffer} The complete buffer representation of the command.
   */
  toBuffer() {
    return Buffer.concat([this.preamble, this.dataSize, this.content, this.crc]);
  }
}