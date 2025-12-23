/**
 * Represents the **data codecs** used by Teltonika devices for encoding telemetry data.
 * These codecs define the format in which GPS and sensor data are transmitted to a server.
 * 
 * @group Codec
 * @enum {number}
 */
export enum TeltonikaDataCodec {
  Codec8 = 0x08,
  Codec8e = 0x8E,
  Codec16 = 0x10,
}

/**
 * Represents the **GPRS command codecs** used by Teltonika devices to handle commands and responses.
 * These codecs are typically used for sending remote configuration or control commands to the device.
 * 
 * @group Codec
 * @enum {number}
 */
export enum TeltonikaGPRSCodec {
  Codec12 = 0x0C,
  Codec14 = 0x0E
}

/**
 * Represents any Teltonika codec, whether a **data codec** or a **GPRS command codec**.
 * This type can be used in functions or classes that need to accept any valid codec type.
 * 
 * @group Codec
 * @typedef {TeltonikaDataCodec | TeltonikaGPRSCodec} TeltonikaCodec
 */
export type TeltonikaCodec = TeltonikaDataCodec | TeltonikaGPRSCodec;
