import { TeltonikaCodec12Parser } from "@/parser/codec12";

const parser = new TeltonikaCodec12Parser();
const rawImei = Buffer.from('000F333536333037303432343431303133', "hex");
const rawPacket = Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', "hex");

const isImei = parser.isImei(rawImei)
const imei = parser.parseImei(rawImei);
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei: ', isImei);
console.log('imei: ', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('response:', packet.records.at(0)?.response);