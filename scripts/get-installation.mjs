import "dotenv/config";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const auth = createAppAuth({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
});

const appAuth = await auth({ type: "app" });

const octokit = new Octokit({
  auth: appAuth.token,
});

const installations = await octokit.request("GET /app/installations");

console.log("Installations found:");
for (const inst of installations.data) {
  console.log(`- ID: ${inst.id}, Account: ${inst.account.login}`);
}
