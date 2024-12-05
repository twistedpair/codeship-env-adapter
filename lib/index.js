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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const environmentVariables_1 = require("./environmentVariables");
const uuid_1 = require("uuid");
async function run() {
    const projectId = core.getInput('project-id', {
        required: false,
    });
    if (projectId) {
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
    }
    const context = github.context;
    setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
    setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
    const buildId = context?.runId?.toString() ?? (0, uuid_1.v4)(); // use UUID until GitHub library starts working
    setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_APPROVED, 'false');
    const event = context.payload;
    const eventName = context.eventName;
    if (eventName === 'push') {
        const pushPayload = event;
        populatePushEventCommitDetails(pushPayload, context);
    }
    else if (eventName === 'pull_request') {
        const pullRequestPayload = event;
        populatePullRequestEventCommitDetails(pullRequestPayload, context);
    }
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
    setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, event?.repository?.name);
}
function populatePushEventCommitDetails(pushEvent, context) {
    const headCommit = pushEvent.head_commit;
    const author = headCommit?.author;
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, context?.sha);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit?.message);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, author?.username);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, author?.email ?? '');
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, author?.name);
}
async function populatePullRequestEventCommitDetails(pullRequestEvent, context) {
    const head = pullRequestEvent.pull_request.head;
    const user = head?.user;
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, head?.sha);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, pullRequestEvent.sender?.login);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, pullRequestEvent.pull_request.url);
    setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, pullRequestEvent.number?.toString());
    const GITHUB_TOKEN = core.getInput('github-token');
    if (GITHUB_TOKEN) {
        const octokit = github.getOctokit(GITHUB_TOKEN);
        const response = await octokit.rest.repos.getCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: head?.sha,
        });
        const commit = response.data?.commit;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, commit?.message);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, commit?.author?.email);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, commit?.author?.name);
    }
    else {
        core.warning('Unable to get commit message for PR. Missing github-token input.');
    }
}
function setVariable(name, value = '') {
    core.exportVariable(name.toString(), value);
}
run();
