import { Octokit } from "@octokit/rest";
import "dotenv/config";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

// TARGET SITE REPO
const TARGET_OWNER = "tuhinjamal";
const TARGET_REPO = "user-site-1";

// PLUGIN REPO (PRIVATE)
const PLUGIN_OWNER = "tuhinjamal";
const PLUGIN_REPO = "shop-plugin";

// Where plugin will live
const DEST_FOLDER = `plugins/${PLUGIN_REPO}`;

// -------------------------------
// Read files from plugin repo
// -------------------------------
async function getFiles(path = "") {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: PLUGIN_OWNER,
      repo: PLUGIN_REPO,
      path,
    }
  );

  return data;
}

// -------------------------------
// Copy recursively
// -------------------------------
async function copyRecursive(files) {
  for (const file of files) {
    if (file.type === "dir") {
      const nested = await getFiles(file.path);
      await copyRecursive(nested);
    }

    if (file.type === "file") {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: PLUGIN_OWNER,
          repo: PLUGIN_REPO,
          path: file.path,
        }
      );

      const targetPath = `${DEST_FOLDER}/${file.path}`;

      await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: TARGET_OWNER,
          repo: TARGET_REPO,
          path: targetPath,
          message: `Add plugin: ${PLUGIN_REPO}`,
          content: data.content, // base64 그대로
        }
      );

      console.log("✅ Copied:", targetPath);
    }
  }
}

// -------------------------------
// RUN
// -------------------------------
const rootFiles = await getFiles();
await copyRecursive(rootFiles);

console.log("🎉 shop-plugin added successfully!");
