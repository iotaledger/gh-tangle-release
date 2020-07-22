#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import emoji from "node-emoji";
import { sanitizeInput, tangleRelease } from "./core";

const version = "0.7.0";
console.log(chalk.green(`GitHub Tangle Release v${version} ${emoji.get("rocket")}\n`));

const program = new Command();

program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false);

program
    .name(chalk.yellowBright("gh-tangle-release"))
    .version(version, "-v, --version", chalk.yellowBright("output the current version"))
    .description(chalk.cyan("An application for creating a transaction on the IOTA Tangle from a GitHub release."))
    .option("--github-token <string>", chalk.yellowBright("GitHub token for accessing your repository"))
    .option("--owner <string>", chalk.yellowBright("GitHub repository owner"))
    .option("--repository <string>", chalk.yellowBright("GitHub repository"))
    .option("--release-tag <string>", chalk.yellowBright("The release tag from the GitHub repository"))
    .option("--node <string>", chalk.yellowBright("Url of the node to use for attaching the transaction to the tangle"),
        "https://nodes.iota.cafe:443")
    .option("--depth <number>", chalk.yellowBright("Depth to use for attaching the transaction to the tangle"),
        "3")
    .option("--mwm <number>",
        chalk.yellowBright("Minimum weight magnitude to use for attaching the transaction to the tangle"),
        "14")
    .option("--seed <string>", chalk.yellowBright("81 Tryte seed used to generate addresses"))
    .option("--address-index <number>", chalk.yellowBright("Index number used to generate addresses", "0"))
    .option("--transaction-tag <string>", chalk.yellowBright("Tag to apply to the Tangle transaction"))
    .option("--comment <string>",
        chalk.yellowBright("An optional comment to include in the Tangle transaction payload"))
    .option("--explorer-url <string>", chalk.yellowBright("Url of the explorer to use for exploration link"),
        "https://utils.iota.org/transaction/:hash")
    .helpOption("--help",
        chalk.yellowBright("Display help"));

if (process.argv.length === 2) {
    program.help(str => `${str}${createExample()}`);
} else {
    try {
        program.parse(process.argv);

        const opts = program.opts();

        const config = sanitizeInput({
            githubToken: opts.githubToken,
            owner: opts.owner,
            repository: opts.repository,
            releaseTag: opts.releaseTag,
            node: opts.node,
            depth: opts.depth,
            mwm: opts.mwm,
            seed: opts.seed,
            // eslint-disable-next-line unicorn/no-null
            addressIndex: null as unknown as number, // opts.addressIndex,
            transactionTag: opts.transactionTag,
            comment: opts.comment,
            explorerUrl: opts.explorerUrl
        });
        console.log("Options:");
        console.log(chalk.cyan("\tGitHub Token"), chalk.white("*******"));
        console.log(chalk.cyan("\tOwner"), chalk.white(config.owner));
        console.log(chalk.cyan("\tRepository"), chalk.white(config.repository));
        console.log(chalk.cyan("\tRelease Tag"), chalk.white(config.releaseTag));
        console.log(chalk.cyan("\tNode"), chalk.white(config.node));
        console.log(chalk.cyan("\tDepth"), chalk.white(config.depth));
        console.log(chalk.cyan("\tMWM"), chalk.white(config.mwm));
        console.log(chalk.cyan("\tSeed"), chalk.white("*******"));
        console.log(chalk.cyan("\tAddress Index"), chalk.white(config.addressIndex));
        console.log(chalk.cyan("\tTransaction Tag"), chalk.white(config.transactionTag));
        if (config.comment) {
            console.log(chalk.cyan("\tComment"), chalk.white(config.comment));
        }
        console.log(chalk.cyan("\tExplorer Url"), chalk.white(config.explorerUrl));
        console.log();

        tangleRelease(config, message => console.log(chalk.green(message)))
            .then(transactionDetails => {
                console.log("Transaction Hash:",
                    chalk.cyan(transactionDetails.hash));
                console.log("You can view the transaction on the tangle at:",
                    chalk.cyan(transactionDetails.url));
                console.log(chalk.green("Complete"));
            })
            .catch(err => {
                console.log();
                console.error(chalk.red(err));
                process.exit(1);
            });
    } catch (err) {
        program.help(str => `${str}${chalk.red(`Error: ${err.message}`)}`);
    }
}

/**
 * Show an example on the console.
 * @returns The example text.
 */
function createExample(): string {
    // eslint-disable-next-line max-len
    return chalk.magenta("\nExample: gh-tangle-release --github-token a4d936470cb3d66f5434f787c2500bde9764f --owner my-org --repository my-repo --release-tag v1.0.1 --seed AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n");
}
