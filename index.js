const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs")

function run() {
  try{
    const pullRequest = github.context.payload.pull_request;
    const templateFile = core.getInput('template-file');

    if(pullRequest) {
      const body = pullRequest.body;

      if (!body) {
        core.setFailed(
          "The pull request description is empty. Please add a description."
        );
        return
      };

      if (body.length <= 7) {
        core.setFailed(
          "The pull request description is too short. Please add a description."
        );
      }

      if (!templateFile) {
        return
      }

      const template = (() => {
        try {
          contents = fs.readFileSync(templateFile, 'utf8')
          return contents

        } catch (error) {
          console.log("Unable to locate template file")
        }
      })()

      if (body == template) {
        core.setFailed(
          "The description matches the template for this repository. Please create a unique description."
        );
      }

    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();