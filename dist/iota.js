"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachToTangle = void 0;
const converter_1 = require("@iota/converter");
const core_1 = require("@iota/core");
/**
 * Attach a payload to the tangle.
 * @param provider The node to use for attaching.
 * @param depth The depth for the attach.
 * @param mwm The minimum weight magniture for the attach.
 * @param seed The seed to generate the address.
 * @param addressIndex The address index to generate.
 * @param tag The tag for the payload.
 * @param payload The payload contents.
 * @param progress Callback to send progress to.
 * @returns The transaction hash that was attached.
 */
function attachToTangle(provider, depth, mwm, seed, addressIndex, tag, payload, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSON.stringify(payload);
        const ascii = encodeNonASCII(json);
        const messageTrytes = converter_1.asciiToTrytes(ascii);
        progress("Preparing transactions");
        progress(`\tMessage Trytes Length: ${messageTrytes.length}`);
        progress(`\tNumber of Transactions: ${Math.ceil(messageTrytes.length / 2187)}`);
        try {
            const iota = core_1.composeAPI({
                provider
            });
            const address = core_1.generateAddress(seed, addressIndex);
            const trytes = yield iota.prepareTransfers("9".repeat(81), [
                {
                    address,
                    value: 0,
                    message: messageTrytes,
                    tag
                }
            ]);
            progress("Sending trytes");
            const bundles = yield iota.sendTrytes(trytes, depth, mwm);
            return bundles[0].hash;
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : err;
            throw new Error(`Sending trytes failed.\n${msg.replace("Error: ", "")}`);
        }
    });
}
exports.attachToTangle = attachToTangle;
/**
 * Replace non ascii characters with their equivalent.
 * @param value The value to convert.
 * @returns The converted value.
 */
function encodeNonASCII(value) {
    return value
        ? value.replace(/[\u007F-\uFFFF]/g, chr => `\\u${`0000${chr.charCodeAt(0).toString(16)}`.slice(-4)}`)
        : "";
}
