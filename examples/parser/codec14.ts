import { TeltonikaCodec14Parser } from "@/parser/codec14";

const parser = new TeltonikaCodec14Parser();
const rawImei = Buffer.from('000F333536333037303432343431303133', "hex");
const rawPacket = Buffer.from('00000000000000AB0E0106000000A303520930814522515665723A30332E31382E31345F3034204750533A41584E5F352E31305F333333332048773A464D42313230204D6F643A313520494D45493A33353230393330383134353232353120496E69743A323031382D31312D323220373A313320557074696D653A3137323334204D41433A363042444430303136323631205350433A312830292041584C3A30204F42443A3020424C3A312E362042543A340100007AAE', "hex");

const isImei = parser.isImei(rawImei)
const imei = parser.parseImei(rawImei);
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei: ', isImei);
console.log('imei: ', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('imei:', packet.records.at(0)?.imei);
console.log('response:', packet.records.at(0)?.response);