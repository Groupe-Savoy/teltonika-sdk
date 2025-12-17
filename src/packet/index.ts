import type { TeltonikaDataCodec, TeltonikaGPRSCodec } from "..";
import type { TeltonikaCodec12ResponsePacket } from "./codec12";
import type { TeltonikaCodec16AVLPacket } from "./codec16";
import type { TeltonikaCodec8AVLPacket } from "./codec8";
import type { TeltonikaCodec8eAVLPacket } from "./codec8e";

export interface PacketDataRegistry {
  [TeltonikaDataCodec.Codec8]: TeltonikaCodec8AVLPacket;
  [TeltonikaDataCodec.Codec8e]: TeltonikaCodec8eAVLPacket;
  [TeltonikaDataCodec.Codec16]: TeltonikaCodec16AVLPacket;
}

// TODO: implement codec13 and codec14
export interface PacketResponseRegistry {
  [TeltonikaGPRSCodec.Codec12]: TeltonikaCodec12ResponsePacket;
  [TeltonikaGPRSCodec.Codec13]: any;
  [TeltonikaGPRSCodec.Codec14]: any;
}