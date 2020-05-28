const core = require('@actions/core');
const github = require('@actions/github');

try {
  const commandToRun = core.getInput('command');
  console.log(`Running ${commandToRun}!`);
  core.setOutput('status', 'success');
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}