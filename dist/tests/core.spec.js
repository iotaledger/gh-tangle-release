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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../src/core");
describe("Tangle Release", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("No GITHUB_TOKEN", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {};
        expect(() => core_1.sanitizeInput(config)).toThrow("You must provide the GitHub token option");
    }));
    test("No owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            githubToken: "aaa"
        };
        expect(() => core_1.sanitizeInput(config)).toThrow("You must provide the owner option");
    }));
    test("No repository", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            githubToken: "aaa",
            owner: "abc"
        };
        expect(() => core_1.sanitizeInput(config)).toThrow("You must provide the repository option");
    }));
    test("No releaseTagName", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1"
        };
        expect(() => core_1.sanitizeInput(config)).toThrow("You must provide the release tag option");
    }));
    test("No seed", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1"
        };
        expect(() => core_1.sanitizeInput(config)).toThrow("You must provide the seed option");
    }));
    test("Sanitized partial input", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            githubToken: "aaa",
            owner: "abc",
            repository: "repo1/app1",
            releaseTag: "v1",
            seed: "A".repeat(81)
        };
        expect(core_1.sanitizeInput(config)).toEqual({
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
    }));
    test("Sanitized full input", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
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
        expect(core_1.sanitizeInput(config)).toEqual({
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
    }));
});
