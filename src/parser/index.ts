import {
  type TeltonikaCodec,
  TeltonikaDataCodec,
  TeltonikaGPRSCodec
} from '@/codec';

import { TeltonikaCodec8Parser } from './codec8';
import { TeltonikaCodec8eParser } from './codec8e';
import { TeltonikaCodec12Parser } from './codec12';
import { TeltonikaCodec16Parser } from './codec16';
import { TeltonikaCodec14Parser } from './codec14';

/**
 * @group Parser
 */
export interface DataParserRegistry {
  [TeltonikaDataCodec.Codec8]: TeltonikaCodec8Parser;
  [TeltonikaDataCodec.Codec8e]: TeltonikaCodec8eParser;
  [TeltonikaDataCodec.Codec16]: TeltonikaCodec16Parser;
}

/**
 * @group Parser
 */
export interface GprsParserRegistry {
  [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Parser;
  [TeltonikaGPRSCodec.Codec14]: TeltonikaCodec14Parser;
}

type ParserRegistry = DataParserRegistry & GprsParserRegistry;
type ParserClass<T> = new () => T;

/**
 * @class TeltonikaParserFactory
 * @group Parser
 */
export class TeltonikaParserFactory {
  private static readonly parsers: {
    [K in keyof ParserRegistry]: ParserClass<ParserRegistry[K]>;
  } = {
    [TeltonikaDataCodec.Codec8]: TeltonikaCodec8Parser,
    [TeltonikaDataCodec.Codec8e]: TeltonikaCodec8eParser,
    [TeltonikaDataCodec.Codec16]: TeltonikaCodec16Parser,

    [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12Parser,
    [TeltonikaGPRSCodec.Codec14]: TeltonikaCodec14Parser,
  };

  static createParser<K extends keyof DataParserRegistry>(
    codec: K
  ): DataParserRegistry[K];

  static createParser<K extends keyof GprsParserRegistry>(
    codec: K
  ): GprsParserRegistry[K];

  static createParser(codec: TeltonikaCodec) {
    const Parser = this.parsers[codec as keyof ParserRegistry];

    return new Parser();
  }
}
