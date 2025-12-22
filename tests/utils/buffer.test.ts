import { describe, it, expect, assert } from 'vitest';
import { createBuffer, imeiToBuffer } from '../../src';

describe('Buffer', () => {
  describe('createBuffer', () => {
    it('should create a buffer of 4 bit with default value', () => {
      expect(createBuffer(4, Buffer.from('2994', 'hex'))).toStrictEqual(Buffer.from([0x00, 0x00, 0x29, 0x94]));
    });
  });

  describe('imeiToBuffer', () => {
    it('should throw an error if not an imei', () => {
      assert.throws(() => {
        imeiToBuffer('ABCD');
      }, 'IMEI must contain digits only');
    });

    it('should create convert the imei string to a buffer', () => {
      expect(imeiToBuffer('868373071752218')).toStrictEqual(Buffer.from([0x08, 0x68, 0x37, 0x30, 0x71, 0x75, 0x22, 0x18]));
    });
  });
});