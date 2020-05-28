const _ = require('underscore')
const helpers = require('./helpers')
const core = require('@actions/core');

console.log('started nodejs...')

const {Octokit} = require('@octokit/rest')
const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`
})

let baseDirectories = '';
if (process.env.BASE_DIRS) baseDirectories = `(?:${process.env.BASE_DIRS})\/`;

//set eventOwner and eventRepo based on action's env variables
const eventOwnerAndRepo = process.env.GITHUB_REPOSITORY;
const eventOwner = helpers.getOwner(eventOwnerAndRepo);
const eventRepo = helpers.getRepo(eventOwnerAndRepo);

async function prMonorepoRepoLabeler() {
  //read contents of action's event.json
  const eventData = await helpers.readFilePromise(
    '..' + process.env.GITHUB_EVENT_PATH
  )
  const eventJSON = JSON.parse(eventData);

  //set eventAction and eventIssueNumber
  let eventAction = eventJSON.action;
  let eventIssueNumber = eventJSON.pull_request.number;

  //get list of files in PR
  const prFiles = await helpers.listFiles(
    octokit,
    eventOwner,
    eventRepo,
    eventIssueNumber
  );

  //get monorepo repo for each file
  prFilesRepos = prFiles.map(({ filename }) =>
    helpers.getMonorepo(baseDirectories, filename)
  )

  //reduce to unique repos
  const prFilesReposUnique = _.uniq(prFilesRepos);

  console.log(prFilesReposUnique);
  let list = prFilesReposUnique.map(repo => {
    return `${process.env.BASE_DIRS}/${repo}`;
  });

  console.log(list, list.join(' '));

  core.setOutput('repos', list.reverse().join(' '));

  for (const repo of prFilesReposUnique) {
    if (repo) {
      console.log(`labeling repo: ${repo}`)

      const repoLabel = `📁 Repo: ${repo}`

      helpers.addLabel(
        octokit,
        eventOwner,
        eventRepo,
        eventIssueNumber,
        repoLabel
      )
    }
  }

}

//run the function
prMonorepoRepoLabeler()

module.exports.prMonorepoRepoLabeler = prMonorepoRepoLabeler