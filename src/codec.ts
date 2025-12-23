/**
 * @group Codec
 */
export enum TeltonikaDataCodec {
  Codec8 = 0x08,
  Codec8e = 0x8E,
  Codec16 = 0x10,
}

/**
 * @group Codec
 */
export enum TeltonikaGPRSCodec {
  Codec12 = 0x0C,
  Codec14 = 0x0E
}

/**
 * @group Codec
 */
export type TeltonikaCodec = TeltonikaDataCodec | TeltonikaGPRSCodec;
