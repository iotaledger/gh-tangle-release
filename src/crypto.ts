import axios from "axios";
import { createHash } from "crypto";

/**
 * Download a file and return the sha256 hash of it.
 * @param url The url of the file to download.
 * @param githubToken The access token.
 * @returns The sha256 hash of the file.
 */
export async function downloadAndHash(url: string, githubToken: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${githubToken}`
            },
            responseType: "arraybuffer"
        });

        if (response.data) {
            const hash = createHash("sha256");
            hash.update(Buffer.from(response.data, "binary"));
            return hash.digest("base64");
        }

        throw new Error(`No data in asset ${url}`);
    } catch (err) {
        throw new Error(`Failed retrieving asset ${url}\n${err.msg}`);
    }
}
