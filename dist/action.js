"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const core_2 = require("./core");
if (require.main === module) {
    console.log("Tangle Release Starting");
    const releaseTag = core_1.getInput("tag_name", { required: true });
    const comment = core_1.getInput("comment", { required: false });
    const { owner, repo } = github_1.context.repo;
    const envConfig = {
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
    const config = core_2.sanitizeInput(envConfig);
    core_2.tangleRelease(config, message => console.log(message))
        .then(transactionDetails => {
        core_1.setOutput("tx_hash", transactionDetails.hash);
        core_1.setOutput("tx_explore_url", transactionDetails.url);
        console.log("Transaction Hash:", transactionDetails.hash);
        console.log("You can view the transaction on the tangle at:", transactionDetails.url);
        console.log("Complete");
    })
        .catch(err => {
        core_1.setFailed(err.message);
        console.log(err);
    });
}
