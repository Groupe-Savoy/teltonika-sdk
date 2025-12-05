import debug from "debug";

export const logger = {
  info: debug('teltonika-sdk:info'),
  error: debug('teltonika-sdk:error')
}