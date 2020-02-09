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
        if (projectId) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_PROJECT_ID, projectId);
        }
        setVariable(environmentVariables_1.EnvironmentVariables.CI, 'true');
        setVariable(environmentVariables_1.EnvironmentVariables.CI_NAME, 'github');
        // @ts-ignore - missing lib defs
        const buildId = context.run_id;
        setVariable(environmentVariables_1.EnvironmentVariables.CI_BUILD_ID, buildId);
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_ID, (_a = context) === null || _a === void 0 ? void 0 : _a.sha);
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMIT_MESSAGE, (_d = (_c = (_b = context) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.head_commit) === null || _d === void 0 ? void 0 : _d.message);
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_USERNAME, (_h = (_g = (_f = (_e = context) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.head_commit) === null || _g === void 0 ? void 0 : _g.author) === null || _h === void 0 ? void 0 : _h.username);
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_COMMITTER_EMAIL, (_m = (_l = (_k = (_j = context) === null || _j === void 0 ? void 0 : _j.event) === null || _k === void 0 ? void 0 : _k.head_commit) === null || _l === void 0 ? void 0 : _l.author) === null || _m === void 0 ? void 0 : _m.email);
        const nowMilliseconds = Date.now();
        const nowAsTimeString = new Date(nowMilliseconds).toISOString();
        setVariable(environmentVariables_1.EnvironmentVariables.CI_TIMESTAMP, nowMilliseconds.toString()); // TODO test in CS, confirm expected format
        setVariable(environmentVariables_1.EnvironmentVariables.CI_STRING_TIME, nowAsTimeString); // TODO test in CS, confirm expected format
        const branchName = (_q = (_p = (_o = context) === null || _o === void 0 ? void 0 : _o.ref) === null || _p === void 0 ? void 0 : _p.match(/[^/]$/)) === null || _q === void 0 ? void 0 : _q[0];
        if (branchName) {
            setVariable(environmentVariables_1.EnvironmentVariables.CI_BRANCH, branchName);
        }
        // @ts-ignore - missing lib defs
        setVariable(environmentVariables_1.EnvironmentVariables.CI_REPO_NAME, (_t = (_s = (_r = context) === null || _r === void 0 ? void 0 : _r.event) === null || _s === void 0 ? void 0 : _s.repository) === null || _t === void 0 ? void 0 : _t.name);
    });
}
function setVariable(name, value) {
    core.exportVariable(name.toString(), value);
}
run();
