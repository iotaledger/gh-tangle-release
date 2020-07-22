import { asciiToTrytes } from "@iota/converter";
import { composeAPI, generateAddress, Transaction } from "@iota/core";
import { IPayload } from "./models/IPayload";

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
export async function attachToTangle(
    provider: string,
    depth: number,
    mwm: number,
    seed: string,
    addressIndex: number,
    tag: string,
    payload: IPayload,
    progress: (message: string) => void): Promise<string> {
    const json = JSON.stringify(payload);
    const ascii = encodeNonASCII(json);
    const messageTrytes = asciiToTrytes(ascii);

    progress("Preparing transactions");
    progress(`\tMessage Trytes Length: ${messageTrytes.length}`);
    progress(`\tNumber of Transactions: ${Math.ceil(messageTrytes.length / 2187)}`);

    try {
        const iota = composeAPI({
            provider
        });

        const address = generateAddress(seed, addressIndex);

        const trytes = await iota.prepareTransfers("9".repeat(81), [
            {
                address,
                value: 0,
                message: messageTrytes,
                tag
            }
        ]);

        progress("Sending trytes");
        const bundles: readonly Transaction[] = await iota.sendTrytes(trytes, depth, mwm);
        return bundles[0].hash;
    } catch (err) {
        const msg = err instanceof Error ? err.message : err;

        throw new Error(`Sending trytes failed.\n${msg.replace("Error: ", "")}`);
    }
}

/**
 * Replace non ascii characters with their equivalent.
 * @param value The value to convert.
 * @returns The converted value.
 */
function encodeNonASCII(value: string): string {
    return value
        ? value.replace(/[\u007F-\uFFFF]/g, chr => `\\u${`0000${chr.charCodeAt(0).toString(16)}`.slice(-4)}`)
        : "";
}
