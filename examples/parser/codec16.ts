import { TeltonikaCodec16Parser } from '@/parser/codec16';

const parser = new TeltonikaCodec16Parser();
const rawImei = Buffer.from('000F333536333037303432343431303133', 'hex');
const rawPacket = Buffer.from('000000000000005F10020000016BDBC7833000000000000000000000000000000000000B05040200010000030002000B00270042563A00000000016BDBC7871800000000000000000000000000000000000B05040200010000030002000B00260042563A00000200005FB3', 'hex');

const isImei = parser.isImei(rawImei);
const imei = parser.parseImei(rawImei);
const isPacket = parser.isPacket(rawPacket);
const packet = parser.parsePacket(rawPacket);

console.log('isImei: ', isImei);
console.log('imei: ', imei);
console.log('isPacket:', isPacket);
console.log('packet:', packet);
console.log('records:', packet.records);