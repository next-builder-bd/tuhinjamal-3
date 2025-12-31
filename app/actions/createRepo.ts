"use server";

import { Octokit } from "@octokit/rest";

export async function createRepoFromTemplate(repoName: string) {
  if (!repoName) throw new Error("Repo name is required");

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  const response = await octokit.request(
    "POST /repos/{template_owner}/{template_repo}/generate",
    {
      template_owner: "tuhinjamal",
      template_repo: "web-builder-include-plugin",
      owner: "tuhinjamal",
      name: repoName,
      private: true,
    }
  );

  return response.data.html_url; // returns the repo URL
}
