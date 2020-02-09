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
function run() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = core.getInput('project-id', { required: false });
        const context = github.context;
        const event = context.payload;
        if (projectId) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
        }
        setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
        // TODO get from toolkit - isn't available in that object presently
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, '${{ github.run_id }}');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_APPROVED, 'false');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, (_a = context) === null || _a === void 0 ? void 0 : _a.sha);
        const headCommit = (_b = event) === null || _b === void 0 ? void 0 : _b.head_commit;
        const author = (_c = headCommit) === null || _c === void 0 ? void 0 : _c.author;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, (_d = headCommit) === null || _d === void 0 ? void 0 : _d.message);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, (_e = author) === null || _e === void 0 ? void 0 : _e.username);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, (_f = author) === null || _f === void 0 ? void 0 : _f.email);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, (_g = author) === null || _g === void 0 ? void 0 : _g.name);
        // TODO add expected description (rather complex to dig up)
        // Expected description format - "2019-07-18.1563481767-1-g7f60" < 'g<first 4 sha char>'
        //       commit date branched from ^     same sec ^     ^ commit number on branch (0 is the commit you branched from)
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_DESCRIPTION, '');
        const nowMilliseconds = Date.now();
        const nowSeconds = Math.floor(nowMilliseconds / 1000);
        const nowAsTimeIsoString = new Date(nowMilliseconds).toISOString();
        const nowAsTimeExpectedIsoString = nowAsTimeIsoString.replace(/\.\d{3}Z/, 'Z'); // No millis expect
        setVariable(environmentVariables_1.EnvironmentVariables.CI_TIMESTAMP, nowSeconds.toString());
        setVariable(environmentVariables_1.EnvironmentVariables.CI_STRING_TIME, nowAsTimeExpectedIsoString);
        // TODO what if it's a tag?
        const branchName = (_k = (_j = (_h = context) === null || _h === void 0 ? void 0 : _h.ref) === null || _j === void 0 ? void 0 : _j.match(/[^/]+$/)) === null || _k === void 0 ? void 0 : _k[0];
        if (branchName) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
        }
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, (_m = (_l = event) === null || _l === void 0 ? void 0 : _l.repository) === null || _m === void 0 ? void 0 : _m.name); // TODO should this be repo name or full_name?
        const pullRequest = (_o = event) === null || _o === void 0 ? void 0 : _o.pull_request;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, (_r = (_q = (_p = pullRequest) === null || _p === void 0 ? void 0 : _p.number) === null || _q === void 0 ? void 0 : _q.toString(), (_r !== null && _r !== void 0 ? _r : '')));
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, (_t = (_s = pullRequest) === null || _s === void 0 ? void 0 : _s.html_url, (_t !== null && _t !== void 0 ? _t : 'false')));
    });
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
