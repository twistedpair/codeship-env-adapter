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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = core.getInput('project-id', { required: false });
        const context = github.context;
        const event = context.payload;
        core.warning(`Using github keys [${JSON.stringify(Object.keys(github))}]`);
        // core.warning(`Using github.context [${JSON.stringify(context)}]`);
        if (projectId) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
        }
        setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
        // @ts-ignore - missing lib defs
        const buildId = (_a = github) === null || _a === void 0 ? void 0 : _a.run_id;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, (_b = context) === null || _b === void 0 ? void 0 : _b.sha);
        const headCommit = (_c = event) === null || _c === void 0 ? void 0 : _c.head_commit;
        const author = (_d = headCommit) === null || _d === void 0 ? void 0 : _d.author;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, (_e = headCommit) === null || _e === void 0 ? void 0 : _e.message);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, (_f = author) === null || _f === void 0 ? void 0 : _f.username);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, (_g = author) === null || _g === void 0 ? void 0 : _g.email);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_NAME, (_h = author) === null || _h === void 0 ? void 0 : _h.name);
        const nowMilliseconds = Date.now();
        const nowAsTimeString = new Date(nowMilliseconds).toISOString();
        setVariable(environmentVariables_1.EnvironmentVariables.CI_TIMESTAMP, nowMilliseconds.toString()); // TODO test in CS, confirm expected format
        setVariable(environmentVariables_1.EnvironmentVariables.CI_STRING_TIME, nowAsTimeString); // TODO test in CS, confirm expected format
        // TODO what if it's a tag?
        const branchName = (_l = (_k = (_j = context) === null || _j === void 0 ? void 0 : _j.ref) === null || _k === void 0 ? void 0 : _k.match(/[^/]+$/)) === null || _l === void 0 ? void 0 : _l[0];
        if (branchName) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
        }
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, (_o = (_m = event) === null || _m === void 0 ? void 0 : _m.repository) === null || _o === void 0 ? void 0 : _o.name); // TODO should this be repo name or full_name?
        const pullRequest = (_p = event) === null || _p === void 0 ? void 0 : _p.pull_request;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PULL_REQUEST, (_s = (_r = (_q = pullRequest) === null || _q === void 0 ? void 0 : _q.number) === null || _r === void 0 ? void 0 : _r.toString(), (_s !== null && _s !== void 0 ? _s : '')));
        setVariable(environmentVariables_1.EnvironmentVariables.CI_PR_NUMBER, (_u = (_t = pullRequest) === null || _t === void 0 ? void 0 : _t.html_url, (_u !== null && _u !== void 0 ? _u : 'false')));
    });
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
