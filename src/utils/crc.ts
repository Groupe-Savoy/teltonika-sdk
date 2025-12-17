
/**
* Calculate CRC-16 (IBM / ANSI) checksum for Teltonika packets.
* CRC is calculated over the "data field":
* from Codec ID (byte 8) up to Number of Data 2.
*
* @param {Buffer} data - Buffer containing the data field
* @returns Calculated CRC-16 value
*
* @example
* ```ts
* const data = Buffer.from(
*   "8E01" +     // Codec ID + Number of Data 1
*   "0000016B4F831C6801" +
*   "000000000000000000000000" +
*   "00010005000100010100010011001d" +
*   "00010010015e2c88" +
*   "0002000b000000003544c87a000e000000001dd7e06a" +
*   "01",        // Number of Data 2
*   "hex"
* );
*
* const crc = packet.calculateCrc(data);
* console.log(crc.toString(16)); // "2994"
* ```
*/
export function calculateCrc(data: Buffer) {
  let crc = 0;

  data.forEach((byte) => {
    crc = crc ^ byte;
    let bitNumber = 0;

    do {
      const carry = crc & 1;
      crc = crc >>> 1;

      if (carry === 1) {
        crc = crc ^ 0xa001;
      }
      bitNumber += 1;
    } while (bitNumber !== 8);
  });

  return crc;
}