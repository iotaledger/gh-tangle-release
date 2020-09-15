import chalk from "chalk";
import { Command } from "commander";
import emoji from "node-emoji";
import { sanitizeInput, tangleRelease } from "./core";

/**
 * Execute the cli core.
 * @param argv The command line arguments.
 * @param env The environment variables.
 * @param display Method to output display.
 */
export async function cliCore(
    argv: string[],
    env: { [id: string]: string | undefined },
    display: (message: string, param?: string) => void): Promise<void> {
    const program = new Command();

    try {
        const version = "0.7.2";

        program
            .storeOptionsAsProperties(false)
            .passCommandToAction(false)
            .name(chalk.yellowBright("gh-tangle-release"))
            .version(version, "-v, --version", chalk.yellowBright("output the current version"))
            .description(
                chalk.cyan("An application for creating a transaction on the IOTA Tangle from a GitHub release."))
            .option("--github-token <string>", chalk.yellowBright(
                "GitHub token for accessing your repository (required)"))
            .option("--owner <string>", chalk.yellowBright("GitHub repository owner (required)"))
            .option("--repository <string>", chalk.yellowBright("GitHub repository (required)"))
            .option("--release-tag <string>",
                chalk.yellowBright("The release tag from the GitHub repository (required)"))
            .option("--node <string>",
                chalk.yellowBright("Url of the node to use for attaching the transaction to the tangle"),
                "https://nodes.iota.cafe:443")
            .option("--depth <number>", chalk.yellowBright("Depth to use for attaching the transaction to the tangle"),
                "3")
            .option("--mwm <number>",
                chalk.yellowBright("Minimum weight magnitude to use for attaching the transaction to the tangle"),
                "14")
            .option("--seed <string>", chalk.yellowBright("81 Tryte seed used to generate addresses (required)"))
            .option("--address-index <number>", chalk.yellowBright("Index number used to generate addresses"), "0")
            .option("--transaction-tag <string>", chalk.yellowBright("Tag to apply to the Tangle transaction"),
                "GITHUB9RELEASE")
            .option("--comment <string>",
                chalk.yellowBright("An optional comment to include in the Tangle transaction payload"))
            .option("--explorer-url <string>", chalk.yellowBright("Url of the explorer to use for exploration link"),
                "https://utils.iota.org/transaction/:hash")
            .option("--no-color", chalk.yellowBright("Disable colored output"))
            .helpOption("--help",
                chalk.yellowBright("Display help"));

        program.parse(argv);
        const opts = program.opts();

        display(chalk.green(`GitHub Tangle Release v${version} ${
            opts.color === false ? "" : emoji.get("rocket")}\n`));

        const envRepo: string[] = env.GITHUB_REPOSITORY ? env.GITHUB_REPOSITORY.split("/") : [];

        if (envRepo.length === 2) {
            opts.owner = opts.owner || envRepo[0];
            opts.repository = opts.repository || envRepo[1];
        }

        const config = sanitizeInput({
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
        display(chalk.cyan("\tGitHub Token"), chalk.white("*******"));
        display(chalk.cyan("\tOwner"), chalk.white(config.owner));
        display(chalk.cyan("\tRepository"), chalk.white(config.repository));
        display(chalk.cyan("\tRelease Tag"), chalk.white(config.releaseTag));
        display(chalk.cyan("\tNode"), chalk.white(config.node));
        display(chalk.cyan("\tDepth"), chalk.white(config.depth));
        display(chalk.cyan("\tMWM"), chalk.white(config.mwm));
        display(chalk.cyan("\tSeed"), chalk.white("*******"));
        display(chalk.cyan("\tAddress Index"), chalk.white(config.addressIndex));
        display(chalk.cyan("\tTransaction Tag"), chalk.white(config.transactionTag));
        if (config.comment) {
            display(chalk.cyan("\tComment"), chalk.white(config.comment));
        }
        display(chalk.cyan("\tExplorer Url"), chalk.white(config.explorerUrl));
        display("");

        try {
            const transactionDetails = await tangleRelease(config, message => display(chalk.green(message)));

            display("Transaction Hash:",
                chalk.cyan(transactionDetails.hash));
            display("You can view the transaction on the tangle at:",
                chalk.cyan(transactionDetails.url));
            display(chalk.green("Complete"));
        } catch (err) {
            display("");
            display(createErrors(err));
            process.exit(1);
        }
    } catch (err) {
        program.help(str => `${str}${createEnvHelp()}${createExample()}${createErrors(err)}`);
        process.exit(1);
    }
}

/**
 * Show an example on the console.
 * @returns The example text.
 */
function createExample(): string {
    // eslint-disable-next-line max-len
    return chalk.magenta("\nExample: gh-tangle-release --github-token a4d936470cb3d66f5434f787c2500bde9764f --owner my-org --repository my-repo --release-tag v1.0.1 --seed AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n\n");
}

/**
 * Show additional info about env vars.
 * @returns The additional information.
 */
function createEnvHelp(): string {
    return `
${chalk.cyan("You can also supply some of the options through environment variables:")}
   ${chalk.cyan("--github-token: GITHUB_TOKEN")}
   ${chalk.cyan("--owner: GITHUB_REPOSITORY[0]")}
   ${chalk.cyan("--repository: GITHUB_REPOSITORY[1]")}
   ${chalk.cyan("     where GITHUB_REPOSITORY is formatted owner/repository")}
   ${chalk.cyan("--release-tag: GITHUB_REF")}
   ${chalk.cyan("--seed: GTR_SEED")}\n\n`;
}

/**
 * Show the errors.
 * @param error The error that was thrown.
 * @returns The formatted errors.
 */
function createErrors(error: Error): string {
    return chalk.red(`The following errors occurred:\n   ${error.message.replace(/\n/g, "\n   ")}`);
}
