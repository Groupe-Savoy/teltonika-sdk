import { TeltonikaGPRSCodec } from "@/codec";
import { TeltonikaCodec12Command } from "./codec12";

export interface CommandRegistry {
  [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Command;
}

type CommandClass<T> = new (cmd: string) => T;

export class TeltonikaCommandFactory {
  private static readonly commands: {
    [K in keyof CommandRegistry]: CommandClass<CommandRegistry[K]>;
  } = {
    [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Command,
  };

  static createCommand(codec: TeltonikaGPRSCodec, cmd: string) {
    const Command = this.commands[codec as keyof CommandRegistry];

    return new Command(cmd);
  }
}
