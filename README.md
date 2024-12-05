# codeship-env-adapter

This action defines the same rich [environment variables as Codeship Pro](https://documentation.codeship.com/pro/builds-and-configuration/environment-variables/#default-environment-variables) in your GitHub Workflow.

The action enables running existing Codeship scripts that reference variables like `CI_COMMIT_MESSAGE`, without having to refactor them to [GitHub Workflows Syntax](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions). Using this action, you can share scripts across your GitHub Workflow and Codeship builds, getting the best of both worlds 🎉.

## Input arguments

### `github-token`
(Optional) A github token is required to populate the `CI_COMMIT_MESSAGE` for workflows triggered by a pull_request event 

### `project-id`
(Optional) If provided `project-id` will be used to populate `CI_PROJECT_ID` in the github environment

## Example Workflow Step

```yaml
name: Where are my env var?
steps:
  - uses: twistedpair/codeship-env-adapter@v1
    with:
      # Provide github-token if you need to populate commit messages for pull_request event triggers
      github-token: ${{ secrets.GITHUB_TOKEN }}
      # provide your project id, if you fancy
      project-id: '123abc-project-id'

  - name: Playback some env vars
    run: echo "Hi, I'm build $CI_COMMIT_ID"
```
## Covered Environment Variables

- `CI` - will be `true`
- `CI_BRANCH` - current ref branch
- `CI_BUILD_APPROVED` - will be `false`
- `CI_BUILD_ID` - uses ~GitHub build id~ per job UUID
- `CI_COMMITTER_EMAIL`
- `CI_COMMITTER_USERNAME`
- `CI_COMMIT_DESCRIPTION` - **unimplemented** (blank)
- `CI_COMMIT_ID`- e.g. `5fd8d0bfbbfa4efcdc663440da1b2e37a86a306a`
- `CI_COMMIT_MESSAGE`
- `CI_NAME` - will be `github`
- `CI_PROJECT_ID` - only set if provided as `project-id` in Action `with` config
- `CI_PR_NUMBER` - repo specific pull request number (pull_request events only)
- `CI_PULL_REQUEST` - github url of the pull request associated with the triggered event (pull_request events only)
- `CI_REPO_NAME` - repo short name (not the full name) e.g. `my-repo`
- `CI_STRING_TIME` - e.g. `2020-02-09T22:33:55Z`
- `CI_TIMESTAMP` - e.g. `1581287635`

If you would like to help define additional behaviors, please submit a PR.


## What this DOESN'T do

This action will **NOT** run `codeship-steps.yml` or `codeship-services.yml` files in GitHub Workflows.

If you want to run step files, run your builds in Codeship.


## Disclaimers
This action is not endorsed or reviewed by Codeship. 
Use at your own risk. The author is not employed by either GitHub or Codeship.

- "Codeship" and "Codeship Pro" are legal marks of CloudBees, Inc.
- "GitHub" and "GitHub Workflows" are the legal marks of GitHub, Inc.
