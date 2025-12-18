import { describe, it, expect } from 'vitest';
import { TeltonikaCodec12Command } from '../../src/command/codec12';

describe('TeltonikaCodec12Command', () => {
  it('should create a getinfo command (wiki example 1)', () => {
    const cmd = new TeltonikaCodec12Command('getinfo');
    const result = '000000000000000F0C010500000007676574696E666F0100004312';
    
    expect(cmd.toString()).toEqual(result);
    expect(cmd.toBuffer()).toStrictEqual(Buffer.from(result, 'hex'))
  });

  it('should create a getio command (wiki example 2)', () => {
    const cmd = new TeltonikaCodec12Command('getio');
    const result = '000000000000000D0C010500000005676574696F01000000CB';
    
    expect(cmd.toString()).toEqual(result);
    expect(cmd.toBuffer()).toStrictEqual(Buffer.from(result, 'hex'))
  });
});