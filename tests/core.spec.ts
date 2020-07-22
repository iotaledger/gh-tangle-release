import { sanitizeInput } from "../src/core";
import { IPartialConfig } from "../src/models/IPartialConfig";

describe("Tangle Release", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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
            transactionTag: "TAGTAGTAG",
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
            transactionTag: "TAGTAGTAG",
            comment: "Mmmmm"
        });
    });
});
