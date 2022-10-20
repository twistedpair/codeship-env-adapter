"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const environmentVariables_1 = require("./environmentVariables");
const uuid_1 = require("uuid");
async function run() {
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
    const buildId = context?.run_id ?? (0, uuid_1.v4)(); // use UUID until GitHub library starts working
    setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_APPROVED, 'false');
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, context?.sha);
    const headCommit = event?.head_commit;
    const author = headCommit?.author;
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit?.message);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, author?.username);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, author?.email);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, author?.name);
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
    const branchName = context?.ref?.match(/[^/]+$/)?.[0];
    if (branchName) {
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
    }
    // @ts-ignore - missing lib defs
    setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, event?.repository?.name);
    // TODO The pull request payload is missing in this implementation (tested with PR builds)
    // Note: the PR functionality in Codeship is not function from my empirical testing, so this behavior is the same as Codeship
    const pullRequest = event?.pull_request;
    setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, pullRequest?.number?.toString() ?? '');
    setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, pullRequest?.html_url ?? 'false');
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
