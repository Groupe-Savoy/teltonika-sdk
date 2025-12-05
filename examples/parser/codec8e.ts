import { TeltonikaCodec8eParser } from "@/index";

const parser = new TeltonikaCodec8eParser();
const imei = Buffer.from('000F333536333037303432343431303133', "hex");
const avl = Buffer.from('000000000000004A8E010000016B412CEE000100000000000000000000000000000000010005000100010100010011001D00010010015E2C880002000B000000003544C87A000E000000001DD7E06A00000100002994', "hex");

console.log('isImei: ', parser.isImei(imei));
console.log('imei: ', parser.parseImei(imei));
console.log('isAvl:', parser.isAVL(avl));
console.log('avl:', parser.parseAVL(avl))

