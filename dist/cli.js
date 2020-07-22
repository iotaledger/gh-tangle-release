#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const node_emoji_1 = __importDefault(require("node-emoji"));
const core_1 = require("./core");
const version = "0.6.3";
console.log(chalk_1.default.green(`GitHub Tangle Release v${version} ${node_emoji_1.default.get("rocket")}\n`));
const program = new commander_1.Command();
program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false);
program
    .name(chalk_1.default.yellowBright("gh-tangle-release"))
    .version(version, "-v, --version", chalk_1.default.yellowBright("output the current version"))
    .description(chalk_1.default.cyan("An application for creating a transaction on the IOTA Tangle from a GitHub release."))
    .option("--github-token <string>", chalk_1.default.yellowBright("GitHub token for accessing your repository"))
    .option("--owner <string>", chalk_1.default.yellowBright("GitHub repository owner"))
    .option("--repository <string>", chalk_1.default.yellowBright("GitHub repository"))
    .option("--release-tag <string>", chalk_1.default.yellowBright("The release tag from the GitHub repository"))
    .option("--node <string>", chalk_1.default.yellowBright("Url of the node to use for attaching the transaction to the tangle"), "https://nodes.iota.cafe:443")
    .option("--depth <number>", chalk_1.default.yellowBright("Depth to use for attaching the transaction to the tangle"), "3")
    .option("--mwm <number>", chalk_1.default.yellowBright("Minimum weight magnitude to use for attaching the transaction to the tangle"), "14")
    .option("--seed <string>", chalk_1.default.yellowBright("81 Tryte seed used to generate addresses"))
    .option("--address-index <number>", chalk_1.default.yellowBright("Index number used to generate addresses", "0"))
    .option("--transaction-tag <string>", chalk_1.default.yellowBright("Tag to apply to the Tangle transaction"))
    .option("--comment <string>", chalk_1.default.yellowBright("An optional comment to include in the Tangle transaction payload"))
    .option("--explorer-url <string>", chalk_1.default.yellowBright("Url of the explorer to use for exploration link"), "https://utils.iota.org/transaction/:hash")
    .helpOption("--help", chalk_1.default.yellowBright("Display help"));
if (process.argv.length === 2) {
    program.help();
}
else {
    try {
        program.parse(process.argv);
        const opts = program.opts();
        const config = core_1.sanitizeInput({
            githubToken: opts.githubToken,
            owner: opts.owner,
            repository: opts.repository,
            releaseTag: opts.releaseTag,
            node: opts.node,
            depth: opts.depth,
            mwm: opts.mwm,
            seed: opts.seed,
            addressIndex: opts.addressIndex,
            transactionTag: opts.transactionTag,
            comment: opts.comment,
            explorerUrl: opts.explorerUrl
        });
        console.log("Options:");
        console.log(chalk_1.default.cyan("\tGitHub Token"), chalk_1.default.white("*******"));
        console.log(chalk_1.default.cyan("\tOwner"), chalk_1.default.white(config.owner));
        console.log(chalk_1.default.cyan("\tRepository"), chalk_1.default.white(config.repository));
        console.log(chalk_1.default.cyan("\tRelease Tag"), chalk_1.default.white(config.releaseTag));
        console.log(chalk_1.default.cyan("\tNode"), chalk_1.default.white(config.node));
        console.log(chalk_1.default.cyan("\tDepth"), chalk_1.default.white(config.depth));
        console.log(chalk_1.default.cyan("\tMWM"), chalk_1.default.white(config.mwm));
        console.log(chalk_1.default.cyan("\tSeed"), chalk_1.default.white("*******"));
        console.log(chalk_1.default.cyan("\tAddress Index"), chalk_1.default.white(config.addressIndex));
        console.log(chalk_1.default.cyan("\tTransaction Tag"), chalk_1.default.white(config.transactionTag));
        if (config.comment) {
            console.log(chalk_1.default.cyan("\tComment"), chalk_1.default.white(config.comment));
        }
        console.log(chalk_1.default.cyan("\tExplorer Url"), chalk_1.default.white(config.explorerUrl));
        console.log();
        core_1.tangleRelease(config, message => console.log(chalk_1.default.green(message)))
            .then(transactionDetails => {
            console.log("Transaction Hash:", chalk_1.default.cyan(transactionDetails.hash));
            console.log("You can view the transaction on the tangle at:", chalk_1.default.cyan(transactionDetails.url));
            console.log(chalk_1.default.green("Complete"));
        })
            .catch(err => {
            console.log();
            console.error(chalk_1.default.red(err));
            process.exit(1);
        });
    }
    catch (err) {
        program.help(str => {
            // console.log(str);
            console.error(chalk_1.default.red(`Error: ${err.message}`));
            return "";
        });
    }
}
