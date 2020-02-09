# codeship-env-adapter

This Action defines _many_ of [environment variables as Codeship Pro](https://documentation.codeship.com/pro/builds-and-configuration/environment-variables/#default-environment-variables), in your Workflow, so that you can run your existing Codeship scripts that reference variables like `CI_COMMIT_MESSAGE` and have them work automatically in GitHub Workflows.

## Covered Environment Variables

- `CI` - will be `true`
- `CI_BRANCH`
- `CI_BUILD_ID` - uses GitHub build id
- `CI_COMMITTER_EMAIL`
- `CI_COMMITTER_USERNAME`
- `CI_COMMIT_ID`
- `CI_COMMIT_MESSAGE`
- `CI_NAME` - will be `github`

If you would like to help define additional variables, please submit a PR.


## What this DOESN'T do

Make any `codeship-steps.yml` or `codeship-services.yml` files run in GitHub Workflows.


## Trademark Disclaimer
- "Codeship" and "Codeship Pro" are legal marks of CloudBees, Inc.
- "GitHub" and "GitHub Workflows" are the legal marks of GitHub, Inc.
