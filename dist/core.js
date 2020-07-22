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
exports.tangleRelease = exports.sanitizeInput = void 0;
/* eslint-disable camelcase */
const github_1 = require("@actions/github");
const crypto_1 = require("./crypto");
const iota_1 = require("./iota");
/**
 * Santirize the input parameters.
 * @param config The config for the release.
 * @returns The config as non partial.
 */
function sanitizeInput(config) {
    if (!config.githubToken) {
        throw new Error("You must provide the GitHub token option");
    }
    if (!config.owner) {
        throw new Error("You must provide the owner option");
    }
    if (!config.repository) {
        throw new Error("You must provide the repository option");
    }
    if (!config.releaseTag) {
        throw new Error("You must provide the release tag option");
    }
    if (!config.seed) {
        throw new Error("You must provide the seed option");
    }
    if (!/[9A-Z]/.test(config.seed)) {
        throw new Error("The seed option must be 81 trytes [A-Z9]");
    }
    if (config.seed.length !== 81) {
        throw new Error(`The seed option must be 81 trytes [A-Z9], it is ${config.seed.length}`);
    }
    config.transactionTag = config.transactionTag || "GITHUB9RELEASE";
    if (!/[9A-Z]/.test(config.transactionTag)) {
        throw new Error("The transaction tag option must be 27 trytes [A-Z9] or less");
    }
    if (config.transactionTag.length >= 27) {
        throw new Error(`The transaction tag option must be 27 trytes [A-Z9] or less, it is ${config.transactionTag.length}`);
    }
    config.explorerUrl = config.explorerUrl || "https://utils.iota.org/transaction/:hash";
    config.node = config.node || "https://nodes.iota.cafe:443";
    let addressIndex;
    let depth;
    let mwm;
    if (typeof config.addressIndex === "string") {
        addressIndex = config.addressIndex.length > 0 ? Number.parseInt(config.addressIndex, 10) : 0;
    }
    else if (config.addressIndex === undefined || config.addressIndex === null) {
        addressIndex = 0;
    }
    else {
        addressIndex = config.addressIndex;
    }
    if (typeof config.depth === "string") {
        depth = config.depth.length > 0 ? Number.parseInt(config.depth, 10) : 3;
    }
    else if (config.depth === undefined || config.depth === null) {
        depth = 3;
    }
    else {
        depth = config.depth;
    }
    if (typeof config.mwm === "string") {
        mwm = config.mwm.length > 0 ? Number.parseInt(config.mwm, 10) : 14;
    }
    else if (config.mwm === undefined || config.mwm === null) {
        mwm = 14;
    }
    else {
        mwm = config.mwm;
    }
    return {
        githubToken: config.githubToken,
        owner: config.owner,
        repository: config.repository,
        releaseTag: config.releaseTag,
        node: config.node,
        depth,
        mwm,
        seed: config.seed,
        addressIndex,
        transactionTag: config.transactionTag,
        comment: config.comment,
        explorerUrl: config.explorerUrl
    };
}
exports.sanitizeInput = sanitizeInput;
/**
 * Create a tangle payload for a GitHub release.
 * @param config The config for the release.
 * @param progress Callback to send progress to.
 * @returns The hash of the transaction and an explorer url.
 */
function tangleRelease(config, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        progress("Connecting to GitHub");
        let release;
        try {
            const octokit = github_1.getOctokit(config.githubToken);
            release = yield octokit.repos.getReleaseByTag({
                owner: config.owner,
                repo: config.repository,
                tag: config.releaseTag.replace("refs/tags/", "")
            });
            if (!release) {
                throw new Error("Unable to retrieve release");
            }
        }
        catch (err) {
            if (!err.toString().includes("Not Found")) {
                throw err;
            }
        }
        if (!release) {
            throw new Error(`Can not find the release https://github.com/${config.owner}/${config.repository}/releases/tag/${config.releaseTag}`);
        }
        progress("Downloading tarball");
        const tarBallHash = yield crypto_1.downloadAndHash(release.data.tarball_url, config.githubToken);
        progress("Downloading zipball");
        const zipBallHash = yield crypto_1.downloadAndHash(release.data.zipball_url, config.githubToken);
        progress("Constructing payload");
        const payload = {
            owner: config.owner || "",
            repo: config.repository || "",
            tag_name: release.data.tag_name,
            name: release.data.name,
            comment: config.comment,
            body: release.data.body,
            tarball_url: release.data.tarball_url,
            tarball_sig: tarBallHash,
            zipball_url: release.data.zipball_url,
            zipball_sig: zipBallHash,
            assets: undefined
        };
        progress("Processing assets");
        if (release.data.assets && release.data.assets.length > 0) {
            payload.assets = [];
            for (let i = 0; i < release.data.assets.length; i++) {
                const assetHash = yield crypto_1.downloadAndHash(release.data.assets[i].browser_download_url, config.githubToken);
                payload.assets.push({
                    name: release.data.assets[i].name,
                    size: release.data.assets[i].size,
                    url: release.data.assets[i].browser_download_url,
                    sig: assetHash
                });
            }
        }
        progress("Attaching to tangle");
        const txHash = yield iota_1.attachToTangle(config.node, config.depth, config.mwm, config.seed, config.addressIndex, config.transactionTag, payload, progress);
        return {
            hash: txHash,
            url: config.explorerUrl.replace(":hash", txHash)
        };
    });
}
exports.tangleRelease = tangleRelease;
