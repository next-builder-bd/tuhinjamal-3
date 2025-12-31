import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    installationId: 101553532,
  },
});

async function listRepos() {
  const res = await octokit.request("GET /installation/repositories");
  console.log("Repos accessible by App:", res.data.repositories.map(r => r.full_name));
}

listRepos();
