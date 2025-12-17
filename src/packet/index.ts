import type { TeltonikaDataCodec } from "..";
import type { TeltonikaCodec16AVLPacket } from "./codec16";
import type { TeltonikaCodec8AVLPacket } from "./codec8";
import type { TeltonikaCodec8eAVLPacket } from "./codec8e";

export interface PacketRegistry {
  [TeltonikaDataCodec.Codec8]: TeltonikaCodec8AVLPacket;
  [TeltonikaDataCodec.Codec8e]: TeltonikaCodec8eAVLPacket;
  [TeltonikaDataCodec.Codec16]: TeltonikaCodec16AVLPacket;
}