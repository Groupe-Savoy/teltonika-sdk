import { TeltonikaCodec8eParser } from "@/index";

const parser = new TeltonikaCodec8eParser();
const rawImei = Buffer.from('000F333536333037303432343431303133', "hex");
const rawPacket = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', "hex");

const isImei = parser.isImei(rawImei)
const imei = parser.parseImei(rawImei);
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei: ', isImei);
console.log('imei: ', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('records:', packet.records)

