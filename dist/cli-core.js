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
exports.cliCore = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const node_emoji_1 = __importDefault(require("node-emoji"));
const core_1 = require("./core");
/**
 * Execute the cli core.
 * @param argv The command line arguments.
 * @param env The environment variables.
 * @param display Method to output display.
 */
function cliCore(argv, env, display) {
    return __awaiter(this, void 0, void 0, function* () {
        const program = new commander_1.Command();
        try {
            const version = "0.7.1";
            program
                .storeOptionsAsProperties(false)
                .passCommandToAction(false)
                .name(chalk_1.default.yellowBright("gh-tangle-release"))
                .version(version, "-v, --version", chalk_1.default.yellowBright("output the current version"))
                .description(chalk_1.default.cyan("An application for creating a transaction on the IOTA Tangle from a GitHub release."))
                .option("--github-token <string>", chalk_1.default.yellowBright("GitHub token for accessing your repository (required)"))
                .option("--owner <string>", chalk_1.default.yellowBright("GitHub repository owner (required)"))
                .option("--repository <string>", chalk_1.default.yellowBright("GitHub repository (required)"))
                .option("--release-tag <string>", chalk_1.default.yellowBright("The release tag from the GitHub repository (required)"))
                .option("--node <string>", chalk_1.default.yellowBright("Url of the node to use for attaching the transaction to the tangle"), "https://nodes.iota.cafe:443")
                .option("--depth <number>", chalk_1.default.yellowBright("Depth to use for attaching the transaction to the tangle"), "3")
                .option("--mwm <number>", chalk_1.default.yellowBright("Minimum weight magnitude to use for attaching the transaction to the tangle"), "14")
                .option("--seed <string>", chalk_1.default.yellowBright("81 Tryte seed used to generate addresses (required)"))
                .option("--address-index <number>", chalk_1.default.yellowBright("Index number used to generate addresses"), "0")
                .option("--transaction-tag <string>", chalk_1.default.yellowBright("Tag to apply to the Tangle transaction"), "GITHUB9RELEASE")
                .option("--comment <string>", chalk_1.default.yellowBright("An optional comment to include in the Tangle transaction payload"))
                .option("--explorer-url <string>", chalk_1.default.yellowBright("Url of the explorer to use for exploration link"), "https://utils.iota.org/transaction/:hash")
                .option("--no-color", chalk_1.default.yellowBright("Disable colored output"))
                .helpOption("--help", chalk_1.default.yellowBright("Display help"));
            program.parse(argv);
            const opts = program.opts();
            console.log(opts);
            display(chalk_1.default.green(`GitHub Tangle Release v${version} ${opts.color === false ? "" : node_emoji_1.default.get("rocket")}\n`));
            const envRepo = env.GITHUB_REPOSITORY ? env.GITHUB_REPOSITORY.split("/") : [];
            if (envRepo.length === 2) {
                opts.owner = opts.owner || envRepo[0];
                opts.repository = opts.repository || envRepo[1];
            }
            const config = core_1.sanitizeInput({
                githubToken: opts.githubToken || env.GITHUB_TOKEN,
                owner: opts.owner,
                repository: opts.repository,
                releaseTag: opts.releaseTag || env.GITHUB_REF,
                node: opts.node,
                depth: opts.depth,
                mwm: opts.mwm,
                seed: opts.seed || env.GTR_SEED,
                addressIndex: opts.addressIndex,
                transactionTag: opts.transactionTag,
                comment: opts.comment,
                explorerUrl: opts.explorerUrl
            });
            display("Options:");
            display(chalk_1.default.cyan("\tGitHub Token"), chalk_1.default.white("*******"));
            display(chalk_1.default.cyan("\tOwner"), chalk_1.default.white(config.owner));
            display(chalk_1.default.cyan("\tRepository"), chalk_1.default.white(config.repository));
            display(chalk_1.default.cyan("\tRelease Tag"), chalk_1.default.white(config.releaseTag));
            display(chalk_1.default.cyan("\tNode"), chalk_1.default.white(config.node));
            display(chalk_1.default.cyan("\tDepth"), chalk_1.default.white(config.depth));
            display(chalk_1.default.cyan("\tMWM"), chalk_1.default.white(config.mwm));
            display(chalk_1.default.cyan("\tSeed"), chalk_1.default.white("*******"));
            display(chalk_1.default.cyan("\tAddress Index"), chalk_1.default.white(config.addressIndex));
            display(chalk_1.default.cyan("\tTransaction Tag"), chalk_1.default.white(config.transactionTag));
            if (config.comment) {
                display(chalk_1.default.cyan("\tComment"), chalk_1.default.white(config.comment));
            }
            display(chalk_1.default.cyan("\tExplorer Url"), chalk_1.default.white(config.explorerUrl));
            display("");
            try {
                const transactionDetails = yield core_1.tangleRelease(config, message => display(chalk_1.default.green(message)));
                display("Transaction Hash:", chalk_1.default.cyan(transactionDetails.hash));
                display("You can view the transaction on the tangle at:", chalk_1.default.cyan(transactionDetails.url));
                display(chalk_1.default.green("Complete"));
            }
            catch (err) {
                display("");
                display(createErrors(err));
                process.exit(1);
            }
        }
        catch (err) {
            program.help(str => `${str}${createEnvHelp()}${createExample()}${createErrors(err)}`);
            process.exit(1);
        }
    });
}
exports.cliCore = cliCore;
/**
 * Show an example on the console.
 * @returns The example text.
 */
function createExample() {
    // eslint-disable-next-line max-len
    return chalk_1.default.magenta("\nExample: gh-tangle-release --github-token a4d936470cb3d66f5434f787c2500bde9764f --owner my-org --repository my-repo --release-tag v1.0.1 --seed AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n\n");
}
/**
 * Show additional info about env vars.
 * @returns The additional information.
 */
function createEnvHelp() {
    return `
${chalk_1.default.cyan("You can also supply some of the options through environment variables:")}
   ${chalk_1.default.cyan("--github-token: GITHUB_TOKEN")}
   ${chalk_1.default.cyan("--owner: GITHUB_REPOSITORY[0]")}
   ${chalk_1.default.cyan("--repository: GITHUB_REPOSITORY[1]")}
   ${chalk_1.default.cyan("     where GITHUB_REPOSITORY is formatted owner/repository")}
   ${chalk_1.default.cyan("--release-tag: GITHUB_REF")}
   ${chalk_1.default.cyan("--seed: GTR_SEED")}\n\n`;
}
/**
 * Show the errors.
 * @param error The error that was thrown.
 * @returns The formatted errors.
 */
function createErrors(error) {
    return chalk_1.default.red(`The following errors occurred:\n   ${error.message.replace(/\n/g, "\n   ")}`);
}
