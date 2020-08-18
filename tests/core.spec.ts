import { sanitizeInput } from "../src/core";
import { IPartialConfig } from "../src/models/IPartialConfig";

describe("Tangle Release", () => {
    test("No GITHUB_TOKEN", async () => {
        const config: IPartialConfig = {};
        expect(() => sanitizeInput(config)).toThrow("You must provide the GitHub token option");
    });

    test("No owner", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa"
        };
        expect(() => sanitizeInput(config)).toThrow("You must provide the owner option");
    });

    test("No repository", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc"
        };
        expect(() => sanitizeInput(config)).toThrow("You must provide the repository option");
    });

    test("No releaseTagName", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1"
        };
        expect(() => sanitizeInput(config)).toThrow("You must provide the release tag option");
    });

    test("No seed", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1"
        };
        expect(() => sanitizeInput(config)).toThrow("You must provide the seed option");
    });

    test("Seed non trytes characters", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "aaa"
        };
        expect(() => sanitizeInput(config)).toThrow("The seed option must be 81 trytes [A-Z9]");
    });

    test("Seed wrong length", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "AAA"
        };
        expect(() => sanitizeInput(config)).toThrow("The seed option must be 81 trytes [A-Z9], it is 3");
    });

    test("Transaction tag non trytes characters", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "A".repeat(81),
            transactionTag: "a"
        };
        expect(() =>
            sanitizeInput(config)).toThrow("The transaction tag option must be 27 trytes [A-Z9] or less");
    });

    test("Transaction tag length too long", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "A".repeat(81),
            transactionTag: "A".repeat(28)
        };
        expect(() =>
            sanitizeInput(config)).toThrow("The transaction tag option must be 27 trytes [A-Z9] or less, it is 28");
    });

    test("Sanitized partial input", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "A".repeat(81)
        };
        expect(sanitizeInput(config)).toEqual({
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            addressIndex: 0,
            node: "https://nodes.iota.cafe:443",
            depth: 3,
            mwm: 14,
            explorerUrl: "https://utils.iota.org/transaction/:hash",
            seed: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            transactionTag: "GITHUB9RELEASE",
            comment: undefined
        });
    });

    test("Sanitized full input", async () => {
        const config: IPartialConfig = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "A".repeat(81),
            node: "https://foo",
            depth: "1",
            mwm: "2",
            addressIndex: 10,
            explorerUrl: "https://bar",
            transactionTag: "T".repeat(27),
            comment: "Mmmmm"
        };
        expect(sanitizeInput(config)).toEqual({
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            addressIndex: 10,
            node: "https://foo",
            depth: 1,
            mwm: 2,
            explorerUrl: "https://bar",
            seed: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            transactionTag: "T".repeat(27),
            comment: "Mmmmm"
        });
    });
});
