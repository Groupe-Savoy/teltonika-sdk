import { TeltonikaCodec8Parser } from "@/parser/codec8";

const parser = new TeltonikaCodec8Parser();
const rawImei = Buffer.from('000F333536333037303432343431303133', "hex");
const rawPacket = Buffer.from('000000000000003608010000016B40D8EA30010000000000000000000000000000000105021503010101425E0F01F10000601A014E0000000000000000010000C7CF', "hex");

const isImei = parser.isImei(rawImei)
const imei = parser.parseImei(rawImei);
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei: ', isImei);
console.log('imei: ', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('records:', packet.records)
