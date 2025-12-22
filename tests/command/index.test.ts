import { describe, it, expect } from 'vitest';
import { TeltonikaCommandFactory, TeltonikaGPRSCodec } from '../../src/';

describe('TeltonikaCommandFactory', () => {
  it('should create a codec 12 command', () => {
    const cmd = TeltonikaCommandFactory.createCommand(TeltonikaGPRSCodec.Codec12, 'getinfo');
    const result = '000000000000000F0C010500000007676574696E666F0100004312';
    
    expect(cmd.toString()).toEqual(result);
    expect(cmd.toBuffer()).toStrictEqual(Buffer.from(result, 'hex'));
  });

  it('should create a codec 14 command', () => {
    const cmd = TeltonikaCommandFactory.createCommand(TeltonikaGPRSCodec.Codec14, 'getver', '0352093081452251');
    const result = '00000000000000160E01050000000E0352093081452251676574766572010000D2C1';

    expect(cmd.toString()).toEqual(result);
    expect(cmd.toBuffer()).toStrictEqual(Buffer.from(result, 'hex'));
  });
});