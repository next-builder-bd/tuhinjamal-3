import { Octokit } from "@octokit/rest";
import "dotenv/config";

const GITHUB_PAT = process.env.GITHUB_PAT;          // GitHub token with repo access
const USER_VERCEL_TOKEN = process.env.USER_VERCEL_TOKEN; // Vercel token
const REPO_OWNER = "tuhinjamal";
const REPO_NAME = "user-site-1";
const BRANCH = "master";

const octokit = new Octokit({ auth: GITHUB_PAT });

async function getRepoId(owner, repo) {
    const response = await octokit.repos.get({ owner, repo });
    return response.data.id; // numeric GitHub repo ID
}

async function deployToVercel(repoId) {
    console.log("🚀 Deploying to Vercel...");


    const res = await fetch(
        "https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${USER_VERCEL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: REPO_NAME,
                gitSource: {
                    type: "github",
                    repoId: repoId,
                    ref: BRANCH,
                },
            }),
        }
    );

    const data = await res.json();

    if (data.error) {
        console.error("❌ Vercel deployment error:", data.error);
        return null;
    }

    const url = data.url || (data.aliases && data.aliases[0]);
    console.log("✅ Deployment complete:", url);
    return url;
}

// Main
async function main() {
    try {
        const repoId = await getRepoId(REPO_OWNER, REPO_NAME);
        console.log("GitHub Repo ID:", repoId);

        const deploymentUrl = await deployToVercel(repoId);
        console.log("Deployment URL:", deploymentUrl);
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

main();
