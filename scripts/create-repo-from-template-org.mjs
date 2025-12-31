// generateRepoFromOrgTemplate.mjs
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import "dotenv/config";

/* =====================================
  Required environment variables:
  GITHUB_APP_ID        → Your GitHub App numeric ID
  GITHUB_PRIVATE_KEY   → Your GitHub App private key (with \n for line breaks)
  GITHUB_ORG          → Your organization name ("next-builder-bd")
===================================== */

// Initialize GitHub App Octokit
function getAppOctokit() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY
    }
  });
}

// Step 1: Get Installation ID for the organization
async function getOrgInstallationId() {
  const appOctokit = getAppOctokit();
  const { data } = await appOctokit.request(
    "GET /app/installations"
  );
  
  const installation = data.find(i => i.account.login === process.env.GITHUB_ORG);
  if (!installation) throw new Error(`❌ App not installed on org ${process.env.GITHUB_ORG}`);
  
  return installation.id;
}

// Step 2: Create Octokit with installation-scoped token
async function getInstallationOctokit(installationId) {
  const appOctokit = getAppOctokit();
  const { data } = await appOctokit.request(
    "POST /app/installations/{installation_id}/access_tokens",
    { installation_id: installationId }
  );
  return new Octokit({ auth: data.token });
}

// Step 3: Generate a repository from a template
async function generateRepoFromTemplate({ templateOwner, templateRepo, newRepoName, isPrivate = true }) {
  try {
    // 1️⃣ Get installation ID
    const installationId = await getOrgInstallationId();

    // 2️⃣ Get installation-scoped Octokit
    const octokit = await getInstallationOctokit(installationId);

    // 3️⃣ Generate repository
    const response = await octokit.request(
      "POST /repos/{template_owner}/{template_repo}/generate",
      {
        template_owner: templateOwner,   // Owner of the template repo
        template_repo: templateRepo,     // Template repo name
        owner: process.env.GITHUB_ORG,   // Organization where new repo will be created
        name: newRepoName,               // New repo name
        private: isPrivate
      }
    );

    console.log("✅ Repo created successfully!");
    console.log("Repository URL:", response.data.html_url);
  } catch (err) {
    console.error("❌ Error creating repo:", err);
  }
}

// =======================
// Run the script
// =======================
(async () => {
  await generateRepoFromTemplate({
    templateOwner: "next-builder-bd",           // Template repo owner (org)
    templateRepo: "web-builder-template",      // Template repo name
    newRepoName: "user-site-1",                // Change this for each client repo
    isPrivate: true
  });
})();
