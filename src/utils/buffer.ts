/**
 * Create a fixed-size buffer and right-align the provided data.
 * Commonly used for CRC comparison or protocol-aligned values.
 *
 * @param {number} size - Desired buffer size
 * @param {Buffer} data - Source data buffer
 * @returns Right-aligned buffer with zero-padding
 *
 * @example
 * ```ts
 * const buf = packet.createBuffer(4, Buffer.from("2994", "hex"));
 * console.log(buf);
 * // <Buffer 00 00 29 94>
 * ```
 */
export function createBuffer(size: number, data: Buffer) {
  const buf = Buffer.alloc(size, 0x00);
  const value = Buffer.from(data);

  value.copy(buf, size - value.length);

  return buf;
}

/**
 * Converts an IMEI decimal string into an 8-byte BCD (Binary-Coded Decimal) buffer
 * using low-nibble-first digit order.
 *
 * Each byte encodes two decimal digits:
 *   - low nibble  = first digit
 *   - high nibble = second digit
 *
 * If the IMEI has an odd number of digits, it is left-padded with `'0'`
 * to produce an even number of digits.
 *
 * Example:
 *   "868373071752218"
 *   → <Buffer 08 68 37 30 71 75 22 18>
 *
 * @param {string} imei - IMEI as a numeric string (digits only).
 * @returns {Buffer} A Buffer containing the BCD-encoded IMEI.
 *
 * @throws {TypeError} If the input contains non-digit characters.
 */
export function imeiToBuffer(imei: string) {
  if (!/^\d+$/.test(imei)) {
    throw new TypeError('IMEI must contain digits only');
  }

  if (imei.length % 2 !== 0) {
    imei = '0' + imei;
  }

  return Buffer.from(imei, 'hex');
}
