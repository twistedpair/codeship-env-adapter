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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const environmentVariables_1 = require("./environmentVariables");
const uuid = require('uuid/v4');
function run() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = core.getInput('project-id', { required: false });
        const context = github.context;
        const event = context.payload;
        core.warning(`Using github.context [${JSON.stringify(github)}]`);
        if (projectId) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
        }
        setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
        // TODO get from toolkit - isn't available in that object presently, found in '${{ github.run_id }}'
        // @ts-ignore
        const buildId = (_b = (_a = context) === null || _a === void 0 ? void 0 : _a.run_id, (_b !== null && _b !== void 0 ? _b : uuid())); // use UUID until GitHub library starts working
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_APPROVED, 'false');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, (_c = context) === null || _c === void 0 ? void 0 : _c.sha);
        const headCommit = (_d = event) === null || _d === void 0 ? void 0 : _d.head_commit;
        const author = (_e = headCommit) === null || _e === void 0 ? void 0 : _e.author;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, (_f = headCommit) === null || _f === void 0 ? void 0 : _f.message);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, (_g = author) === null || _g === void 0 ? void 0 : _g.username);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, (_h = author) === null || _h === void 0 ? void 0 : _h.email);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, (_j = author) === null || _j === void 0 ? void 0 : _j.name);
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
        const branchName = (_m = (_l = (_k = context) === null || _k === void 0 ? void 0 : _k.ref) === null || _l === void 0 ? void 0 : _l.match(/[^/]+$/)) === null || _m === void 0 ? void 0 : _m[0];
        if (branchName) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
        }
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, (_p = (_o = event) === null || _o === void 0 ? void 0 : _o.repository) === null || _p === void 0 ? void 0 : _p.name);
        // TODO The pull request payload is missing in this implementation (tested with PR builds)
        // Note: the PR functionality in Codeship is not function from my empirical testing, so this behavior is the same as Codeship
        const pullRequest = (_q = event) === null || _q === void 0 ? void 0 : _q.pull_request;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, (_t = (_s = (_r = pullRequest) === null || _r === void 0 ? void 0 : _r.number) === null || _s === void 0 ? void 0 : _s.toString(), (_t !== null && _t !== void 0 ? _t : '')));
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, (_v = (_u = pullRequest) === null || _u === void 0 ? void 0 : _u.html_url, (_v !== null && _v !== void 0 ? _v : 'false')));
    });
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
