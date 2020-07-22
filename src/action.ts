import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { sanitizeInput, tangleRelease } from "./core";
import { IConfig } from "./models/IConfig";
import { IPartialConfig } from "./models/IPartialConfig";

if (require.main === module) {
    console.log("Tangle Release Starting");

    const releaseTag = getInput("tag_name", { required: true });
    const comment = getInput("comment", { required: false });

    const { owner, repo } = context.repo;

    const envConfig: IPartialConfig = {
        githubToken: process.env.GITHUB_TOKEN,
        owner,
        repository: repo,
        releaseTag,
        node: process.env.IOTA_NODE,
        depth: process.env.IOTA_DEPTH,
        mwm: process.env.IOTA_MWM,
        seed: process.env.IOTA_SEED,
        addressIndex: process.env.IOTA_ADDRESS_INDEX,
        transactionTag: process.env.IOTA_TAG,
        comment,
        explorerUrl: process.env.IOTA_TANGLE_EXPLORER
    };

    console.log(`process.env.IOTA_ADDRESS_INDEX is ${typeof process.env.IOTA_ADDRESS_INDEX}`);

    const config: IConfig = sanitizeInput(envConfig);

    tangleRelease(config, message => console.log(message))
        .then(transactionDetails => {
            setOutput("tx_hash", transactionDetails.hash);
            setOutput("tx_explore_url", transactionDetails.url);

            console.log("Transaction Hash:", transactionDetails.hash);
            console.log("You can view the transaction on the tangle at:", transactionDetails.url);
            console.log("Complete");
        })
        .catch(err => {
            setFailed(err.message);
            console.log(err);
        });
}
