import * as core from '@actions/core';
import * as github from '@actions/github';
import {EnvironmentVariables} from './environmentVariables';

const uuid = require('uuid/v4');

async function run(): Promise<void> {
  const projectId: string | undefined = core.getInput('project-id', {required: false});
  const context = github.context;
  const event = context.payload;

  core.warning(`Using github.context [${JSON.stringify(github)}]`);

  if(projectId) {
    setVariable(EnvironmentVariables.CI_PROJECT_ID, projectId);
  }

  setVariable(EnvironmentVariables.CI, 'true');
  setVariable(EnvironmentVariables.CI_NAME, 'github');

  // TODO get from toolkit - isn't available in that object presently, found in '${{ github.run_id }}'
  // @ts-ignore
  const buildId = context?.run_id ?? uuid(); // use UUID until GitHub library starts working
  setVariable(EnvironmentVariables.CI_BUILD_ID, buildId);
  setVariable(EnvironmentVariables.CI_BUILD_APPROVED, 'false');

  setVariable(EnvironmentVariables.CI_COMMIT_ID, context?.sha);

  const headCommit = event?.head_commit;
  const author = headCommit?.author;
  setVariable(EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit?.message);
  setVariable(EnvironmentVariables.CI_COMMITTER_USERNAME, author?.username);
  setVariable(EnvironmentVariables.CI_COMMITTER_EMAIL, author?.email);
  setVariable(EnvironmentVariables.CI_COMMITTER_NAME, author?.name);

  // TODO add expected description (rather complex to dig up), made by `git describe`
  // Expected description format - "2019-07-18.1563481767-1-g7f60" < 'g<first 4 sha char>'
  //       commit date branched from ^     same sec ^     ^ commit number on branch (0 is the commit you branched from)
  setVariable(EnvironmentVariables.CI_COMMIT_DESCRIPTION, '');

  const nowMilliseconds = Date.now();
  const nowSeconds = Math.floor(nowMilliseconds/1000);
  const nowAsTimeIsoString = new Date(nowMilliseconds).toISOString();
  const nowAsTimeExpectedIsoString = nowAsTimeIsoString.replace(/\.\d{3}Z/,'Z'); // No millis expect
  setVariable(EnvironmentVariables.CI_TIMESTAMP, nowSeconds.toString());
  setVariable(EnvironmentVariables.CI_STRING_TIME, nowAsTimeExpectedIsoString);


  const branchName = context?.ref?.match(/[^/]+$/)?.[0];
  if(branchName) {
    setVariable(EnvironmentVariables.CI_BRANCH, branchName);
  }

  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_REPO_NAME,  event?.repository?.name );

  // TODO The pull request payload is missing in this implementation (tested with PR builds)
  // Note: the PR functionality in Codeship is not function from my empirical testing, so this behavior is the same as Codeship
  const pullRequest = event?.pull_request;
  setVariable(EnvironmentVariables.CI_PULL_REQUEST,  pullRequest?.number?.toString() ?? '');
  setVariable(EnvironmentVariables.CI_PR_NUMBER,  pullRequest?.html_url ?? 'false');
}

function setVariable(name: EnvironmentVariables, value: string) {
  core.exportVariable(name.toString(), value);
}

run();
