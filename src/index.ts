import * as core from '@actions/core';
import * as github from '@actions/github';
import {EnvironmentVariables} from './environmentVariables';

async function run(): void {
  const projectId: string | undefined = core.getInput('project-id', {required: false});
  const context = github.context;

  core.debug(`Using github keys [${JSON.stringify(Object.keys(context))}]`);
  core.debug(`Using github.context [${JSON.stringify(context)}]`);

  if(projectId) {
    setVariable(EnvironmentVariables.CI_PROJECT_ID, projectId);
  }

  setVariable(EnvironmentVariables.CI, 'true');
  setVariable(EnvironmentVariables.CI_NAME, 'github');

  // @ts-ignore - missing lib defs
  const buildId = context.run_id;
  setVariable(EnvironmentVariables.CI_BUILD_ID, buildId);

  setVariable(EnvironmentVariables.CI_COMMIT_ID, context?.sha);
  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_COMMIT_MESSAGE, context?.event?.head_commit?.message);
  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_COMMITTER_USERNAME, context?.event?.head_commit?.author?.username);
  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_COMMITTER_EMAIL, context?.event?.head_commit?.author?.email);

  const nowMilliseconds = Date.now();
  const nowAsTimeString = new Date(nowMilliseconds).toISOString();
  setVariable(EnvironmentVariables.CI_TIMESTAMP, nowMilliseconds.toString());// TODO test in CS, confirm expected format
  setVariable(EnvironmentVariables.CI_STRING_TIME, nowAsTimeString);// TODO test in CS, confirm expected format


  const branchName = context?.ref?.match(/[^/]$/)?.[0];
  if(branchName) {
    setVariable(EnvironmentVariables.CI_BRANCH, branchName);
  }
  // @ts-ignore - missing lib defs
  setVariable(EnvironmentVariables.CI_REPO_NAME,  context?.event?.repository?.name );
}

function setVariable(name: EnvironmentVariables, value: string) {
  core.exportVariable(name.toString(), value);
}

run();
