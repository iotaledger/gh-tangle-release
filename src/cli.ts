#!/usr/bin/env node
import { cliCore } from "./cli-core";

cliCore(process.argv, process.env, (message, param) => {
    process.stdout.write(message);
    if (param) {
        process.stdout.write(` ${param}`);
    }
    process.stdout.write("\n");
}).catch(err => process.stderr.write(err.message));
