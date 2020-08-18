import chalk from "chalk";
import { cliCore } from "../src/cli-core";

describe("CLI", () => {
    let processExitSpy: jest.SpyInstance;
    let processStdoutWriteSpy: jest.SpyInstance;
    let output: string[] = [];

    const appendToOutput = (message: string | Uint8Array): void => {
        output = output.concat(
            message
                .toString()
                .split("\n")
                .map(s => s.trim())
        );
    };

    beforeAll(() => {
        chalk.level = 0;

        processStdoutWriteSpy = jest.spyOn(process.stdout, "write").mockImplementation(message => {
            appendToOutput(message);
            return true;
        });
        processExitSpy = jest.spyOn(process, "exit").mockImplementation();
    });

    afterEach(() => {
        output = [];
    });

    afterAll(() => {
        processStdoutWriteSpy.mockRestore();
        processExitSpy.mockRestore();
    });

    test("No Params", async () => {
        await cliCore([], {}, appendToOutput);
        expect(processExitSpy).toHaveBeenCalledWith(1);
        expect(output).toContain("You must provide the GitHub token option");
        expect(output).toContain("You must provide the owner option");
        expect(output).toContain("You must provide the repository option");
        expect(output).toContain("You must provide the release tag option");
        expect(output).toContain("You must provide the seed option");
    });

    test("Env Params", async () => {
        await cliCore([], {
            GITHUB_TOKEN: "g",
            GITHUB_REPOSITORY: "o/r",
            GITHUB_REF: "refs/heads/tag",
            GTR_SEED: "S".repeat(81)
        }, appendToOutput);
        expect(processExitSpy).toHaveBeenCalledWith(1);
        expect(output).toContain("Bad credentials");
    });
});
