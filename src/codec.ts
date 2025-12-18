export enum TeltonikaDataCodec {
  Codec8 = 0x08,
  Codec8e = 0x8E,
  Codec16 = 0x10,
}

export enum TeltonikaGPRSCodec {
  Codec12 = 0x0C,
  Codec14 = 0x0E
}

export type TeltonikaCodec = TeltonikaDataCodec | TeltonikaGPRSCodec;
