import * as core from '@actions/core';
import * as github from '@actions/github';
import {EnvironmentVariables} from './environmentVariables';

async function run(): Promise<void> {
  const projectId: string | undefined = core.getInput('project-id', {required: false});
  const context = github.context;
  const event = context.payload;

  core.warning(`Using github keys [${JSON.stringify(Object.keys(github))}]`);
  // core.warning(`Using github.context [${JSON.stringify(context)}]`);

  if(projectId) {
    setVariable(EnvironmentVariables.CI_PROJECT_ID, projectId);
  }

  setVariable(EnvironmentVariables.CI, 'true');
  setVariable(EnvironmentVariables.CI_NAME, 'github');

  // @ts-ignore - missing lib defs
  const buildId = github?.run_id;
  setVariable(EnvironmentVariables.CI_BUILD_ID, buildId);

  setVariable(EnvironmentVariables.CI_COMMIT_ID, context?.sha);

  const headCommit = event?.head_commit;
  const author = headCommit?.author;
  setVariable(EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit?.message);
  setVariable(EnvironmentVariables.CI_COMMITTER_USERNAME, author?.username);
  setVariable(EnvironmentVariables.CI_COMMITTER_EMAIL, author?.email);
  setVariable(EnvironmentVariables.CI_COMMITTER_NAME, author?.name);

  const nowMilliseconds = Date.now();
  const nowAsTimeString = new Date(nowMilliseconds).toISOString();
  setVariable(EnvironmentVariables.CI_TIMESTAMP, nowMilliseconds.toString());// TODO test in CS, confirm expected format
  setVariable(EnvironmentVariables.CI_STRING_TIME, nowAsTimeString);// TODO test in CS, confirm expected format


  // TODO what if it's a tag?
  const branchName = context?.ref?.match(/[^/]+$/)?.[0];
  if(branchName) {
    setVariable(EnvironmentVariables.CI_BRANCH, branchName);
  }

  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_REPO_NAME,  event?.repository?.name ); // TODO should this be repo name or full_name?

  const pullRequest = event?.pull_request;
  setVariable(EnvironmentVariables.CI_PULL_REQUEST,  pullRequest?.number?.toString() ?? '');
  setVariable(EnvironmentVariables.CI_PR_NUMBER,  pullRequest?.html_url ?? 'false');

}

function setVariable(name: EnvironmentVariables, value: string) {
  core.exportVariable(name.toString(), value);
}

run();
