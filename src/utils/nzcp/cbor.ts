/* eslint-disable @typescript-eslint/ban-ts-comment */
import util from "util";
import cbor from "cbor";

global.TextDecoder = util.TextDecoder;
global.TextEncoder = util.TextEncoder;

export const encodeCBOR = (object: (string | Buffer)[]): Buffer =>
  cbor.encode(object);
export const decodeCBOR = (buffer: Buffer | Uint8Array): any =>
  cbor.decode(buffer);
