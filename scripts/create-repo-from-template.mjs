import { Octokit } from "@octokit/rest";
import "dotenv/config";

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

await octokit.request(
  "POST /repos/{template_owner}/{template_repo}/generate",
  {
    template_owner: "tuhinjamal",
    template_repo: "web-builder-include-plugin",
    owner: "tuhinjamal",
    name: "user-site-1",
    private: true,
  }
);

console.log("✅ Repo created successfully!");
