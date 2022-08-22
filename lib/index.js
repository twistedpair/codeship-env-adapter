"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const environmentVariables_1 = require("./environmentVariables");
const uuid_1 = require("uuid");
function run() {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = core.getInput('project-id', { required: false });
        const context = github.context;
        const event = context.payload;
        if (projectId) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
        }
        setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
        // TODO get from toolkit - isn't available in that object presently, found in '${{ github.run_id }}'
        // @ts-ignore
        const buildId = (_a = context === null || context === void 0 ? void 0 : context.run_id) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(); // use UUID until GitHub library starts working
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_APPROVED, 'false');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, context === null || context === void 0 ? void 0 : context.sha);
        const headCommit = event === null || event === void 0 ? void 0 : event.head_commit;
        const author = headCommit === null || headCommit === void 0 ? void 0 : headCommit.author;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit === null || headCommit === void 0 ? void 0 : headCommit.message);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, author === null || author === void 0 ? void 0 : author.username);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, author === null || author === void 0 ? void 0 : author.email);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, author === null || author === void 0 ? void 0 : author.name);
        // TODO add expected description (rather complex to dig up), made by `git describe`
        // Expected description format - "2019-07-18.1563481767-1-g7f60" < 'g<first 4 sha char>'
        //       commit date branched from ^     same sec ^     ^ commit number on branch (0 is the commit you branched from)
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_DESCRIPTION, '');
        const nowMilliseconds = Date.now();
        const nowSeconds = Math.floor(nowMilliseconds / 1000);
        const nowAsTimeIsoString = new Date(nowMilliseconds).toISOString();
        const nowAsTimeExpectedIsoString = nowAsTimeIsoString.replace(/\.\d{3}Z/, 'Z'); // No millis expect
        setVariable(environmentVariables_1.EnvironmentVariables.CI_TIMESTAMP, nowSeconds.toString());
        setVariable(environmentVariables_1.EnvironmentVariables.CI_STRING_TIME, nowAsTimeExpectedIsoString);
        const branchName = (_c = (_b = context === null || context === void 0 ? void 0 : context.ref) === null || _b === void 0 ? void 0 : _b.match(/[^/]+$/)) === null || _c === void 0 ? void 0 : _c[0];
        if (branchName) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
        }
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, (_d = event === null || event === void 0 ? void 0 : event.repository) === null || _d === void 0 ? void 0 : _d.name);
        // TODO The pull request payload is missing in this implementation (tested with PR builds)
        // Note: the PR functionality in Codeship is not function from my empirical testing, so this behavior is the same as Codeship
        const pullRequest = event === null || event === void 0 ? void 0 : event.pull_request;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, (_f = (_e = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.number) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : '');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, (_g = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.html_url) !== null && _g !== void 0 ? _g : 'false');
    });
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
