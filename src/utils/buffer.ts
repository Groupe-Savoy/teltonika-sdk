
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
