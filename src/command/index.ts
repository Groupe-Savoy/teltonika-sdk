import { TeltonikaGPRSCodec } from '@/codec';
import { TeltonikaCodec12Command } from './codec12';
import { TeltonikaCodec14Command } from './codec14';

/**
 * @group Command
 */
export interface CommandRegistry {
  [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Command;
  [TeltonikaGPRSCodec.Codec14]: TeltonikaCodec14Command;
}

type CommandClass<T> = new (cmd: string, imei?: string) => T;

/**
 * @class TeltonikaCommandFactory
 * @group Command
 */
export class TeltonikaCommandFactory {
  private static readonly commands: {
    [K in keyof CommandRegistry]: CommandClass<CommandRegistry[K]>;
  } = {
    [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Command,
    [TeltonikaGPRSCodec.Codec14]: TeltonikaCodec14Command,
  };

  static createCommand(codec: TeltonikaGPRSCodec, cmd: string, imei?: string) {
    const Command = this.commands[codec as keyof CommandRegistry];

    return new Command(cmd, imei);
  }
}
