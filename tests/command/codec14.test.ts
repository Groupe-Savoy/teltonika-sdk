import { describe, it, expect } from 'vitest';
import { TeltonikaCodec14Command } from '../../src/command/codec14';

describe('TeltonikaCodec14Command', () => {
  it('should create a getver command (wiki example 1)', () => {
    const cmd = new TeltonikaCodec14Command('getver', '0352093081452251');
    const result = '00000000000000160E01050000000E0352093081452251676574766572010000D2C1';

    expect(cmd.toString()).toEqual(result);
    expect(cmd.toBuffer()).toStrictEqual(Buffer.from(result, 'hex'));
  });
});