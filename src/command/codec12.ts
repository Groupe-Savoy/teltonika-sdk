import { TeltonikaGPRSCodec } from '@/codec';
import { TeltonikaBaseCommand } from './base';

/**
 * Represents a command for Teltonika Codec 12.
 * This class extends TeltonikaBaseCommand to handle Codec 12 specific command formatting.
 * 
 * @class TeltonikaCodec12Command
 * @group Command
 * @document ../../docs/command.md
 * @example
 * const command = new TeltonikaCodec12Command('getinfo');
 * const buffer = command.toBuffer();
 */
export class TeltonikaCodec12Command extends TeltonikaBaseCommand {
  /**
   * Creates an instance of TeltonikaCodec12Command.
   * @param {string} cmd - The command string to be sent.
   */
  constructor(cmd: string) {
    super({
      codecId: Buffer.from([TeltonikaGPRSCodec.Codec12]),
      type: Buffer.from([0x05]), 
      numberOfCmd: Buffer.from([0x01]),
      cmd,
    });
  }

  /**
   * Gets the content buffer for the command.
   * 
   * @returns {Buffer} The concatenated buffer containing codec ID, number of commands,
   * type, command size, command, and number of commands.
   */
  getContent() {
    return Buffer.concat([
      this.codecId, 
      this.numberOfCmd, 
      this.type, 
      this.cmdSize, 
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