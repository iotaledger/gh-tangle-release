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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAndHash = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
/**
 * Download a file and return the sha256 hash of it.
 * @param url The url of the file to download.
 * @param githubToken The access token.
 * @returns The sha256 hash of the file.
 */
function downloadAndHash(url, githubToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `token ${githubToken}`
                },
                responseType: "arraybuffer"
            });
            if (response.data) {
                const hash = crypto_1.createHash("sha256");
                hash.update(Buffer.from(response.data, "binary"));
                return hash.digest("base64");
            }
            throw new Error(`No data in asset ${url}`);
        }
        catch (err) {
            throw new Error(`Failed retrieving asset ${url}\n${err.msg}`);
        }
    });
}
exports.downloadAndHash = downloadAndHash;
