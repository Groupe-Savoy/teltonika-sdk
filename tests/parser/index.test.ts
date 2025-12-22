import { describe, it, expect } from 'vitest';
import { 
  TeltonikaParserFactory, 
  TeltonikaGPRSCodec, 
  TeltonikaDataCodec, 
  TeltonikaCodec8Parser, 
  TeltonikaCodec8eParser, 
  TeltonikaCodec12Parser, 
  TeltonikaCodec14Parser, 
  TeltonikaCodec16Parser 
} from '../../src/';

describe('TeltonikaParserFactory', () => {
  it('should create a codec 8 parser', () => {
    expect(TeltonikaParserFactory.createParser(TeltonikaDataCodec.Codec8)).toBeInstanceOf(TeltonikaCodec8Parser);
  });

  it('should create a codec 8 extended parser', () => {
    expect(TeltonikaParserFactory.createParser(TeltonikaDataCodec.Codec8e)).toBeInstanceOf(TeltonikaCodec8eParser);
  });

  it('should create a codec 16 parser', () => {
    expect(TeltonikaParserFactory.createParser(TeltonikaDataCodec.Codec16)).toBeInstanceOf(TeltonikaCodec16Parser);
  });

  it('should create a codec 12 parser', () => {
    expect(TeltonikaParserFactory.createParser(TeltonikaGPRSCodec.Codec12)).toBeInstanceOf(TeltonikaCodec12Parser);
  });

  it('should create a codec 14 parser', () => {
    expect(TeltonikaParserFactory.createParser(TeltonikaGPRSCodec.Codec14)).toBeInstanceOf(TeltonikaCodec14Parser);
  });
});