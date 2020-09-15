#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_core_1 = require("./cli-core");
cli_core_1.cliCore(process.argv, process.env, (message, param) => {
    process.stdout.write(message);
    if (param) {
        process.stdout.write(` ${param}`);
    }
    process.stdout.write("\n");
}).catch(err => process.stderr.write(err.message));
