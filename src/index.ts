import * as core from '@actions/core';
import * as github from '@actions/github';
import {EnvironmentVariables} from './environmentVariables';
import { v4 as uuidV4 } from 'uuid';
import {PushEvent, PullRequest} from '@octokit/webhooks-types';
import {Context} from '@actions/github/lib/context';

async function run(): Promise<void> {
  const projectId: string | undefined = core.getInput('project-id', {
    required: false,
  });

  if (projectId) {
    setVariable(EnvironmentVariables.CI_PROJECT_ID, projectId);
  }

  const context = github.context;

  setVariable(EnvironmentVariables.CI, 'true');
  setVariable(EnvironmentVariables.CI_NAME, 'github');

  const buildId = context?.runId?.toString() ?? uuidV4(); // use UUID until GitHub library starts working
  setVariable(EnvironmentVariables.CI_BUILD_ID, buildId);
  setVariable(EnvironmentVariables.CI_BUILD_APPROVED, 'false');

  core.notice(`EVENT_CONTEXT: ${JSON.stringify(context)}`);
  const event = context.payload;
  const eventName = context.eventName;
  if (eventName === 'push') {
    const pushPayload = event as PushEvent;
    populatePushEventCommitDetails(pushPayload, context);
  } else if (eventName === 'pull_request') {
    const pullRequestPayload = event as PullRequest;
    populatePullRequestEventCommitDetails(pullRequestPayload, context);
  }

  // TODO add expected description (rather complex to dig up), made by `git describe`
  // Expected description format - "2019-07-18.1563481767-1-g7f60" < 'g<first 4 sha char>'
  //       commit date branched from ^     same sec ^     ^ commit number on branch (0 is the commit you branched from)
  setVariable(EnvironmentVariables.CI_COMMIT_DESCRIPTION, '');

  const nowMilliseconds = Date.now();
  const nowSeconds = Math.floor(nowMilliseconds / 1000);
  const nowAsTimeIsoString = new Date(nowMilliseconds).toISOString();
  const nowAsTimeExpectedIsoString = nowAsTimeIsoString.replace(
    /\.\d{3}Z/,
    'Z',
  ); // No millis expect
  setVariable(EnvironmentVariables.CI_TIMESTAMP, nowSeconds.toString());
  setVariable(EnvironmentVariables.CI_STRING_TIME, nowAsTimeExpectedIsoString);

  const branchName = context?.ref?.match(/[^/]+$/)?.[0];
  if (branchName) {
    setVariable(EnvironmentVariables.CI_BRANCH, branchName);
  }

  setVariable(EnvironmentVariables.CI_REPO_NAME, event?.repository?.name);
}

function populatePushEventCommitDetails(
  pushEvent: PushEvent,
  context: Context,
) {
  const headCommit = pushEvent.head_commit;
  const author = headCommit?.author;
  setVariable(EnvironmentVariables.CI_COMMIT_ID, context?.sha);
  setVariable(EnvironmentVariables.CI_COMMIT_MESSAGE, headCommit?.message);
  setVariable(EnvironmentVariables.CI_COMMITTER_USERNAME, author?.username);
  setVariable(EnvironmentVariables.CI_COMMITTER_EMAIL, author?.email ?? '');
  setVariable(EnvironmentVariables.CI_COMMITTER_NAME, author?.name);
}

async function populatePullRequestEventCommitDetails(
  pullRequestEvent: PullRequest,
  context: Context,
) {
  const head = pullRequestEvent.head;
  const user = head?.user;
  setVariable(EnvironmentVariables.CI_COMMIT_ID, head?.sha);
  setVariable(EnvironmentVariables.CI_COMMITTER_USERNAME, user?.login);
  setVariable(EnvironmentVariables.CI_COMMITTER_EMAIL, user?.email ?? '');
  setVariable(EnvironmentVariables.CI_COMMITTER_NAME, user?.name);
  setVariable(EnvironmentVariables.CI_PULL_REQUEST, pullRequestEvent.url);
  setVariable(
    EnvironmentVariables.CI_PR_NUMBER,
    pullRequestEvent.number?.toString(),
  );

  const GITHUB_TOKEN = core.getInput('github-token');
  if (GITHUB_TOKEN) {
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const response = await octokit.rest.repos.getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: head?.sha,
    });

    setVariable(
      EnvironmentVariables.CI_COMMIT_MESSAGE,
      response.data?.commit?.message,
    );
  } else {
    core.warning(
      'Unable to get commit message for PR. Missing github-token input.',
    );
  }
}

function setVariable(name: EnvironmentVariables, value = '') {
  core.exportVariable(name.toString(), value);
}

run();
