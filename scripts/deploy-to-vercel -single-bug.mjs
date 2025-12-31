// scripts/deploy-to-vercel.mjs
import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';
dotenv.config();

const { VERCEL_TOKEN, GITHUB_ORG, DATABASE_URL } = process.env;

if (!VERCEL_TOKEN || !GITHUB_ORG || !DATABASE_URL) {
  console.error('VERCEL_TOKEN, GITHUB_ORG, or DATABASE_URL missing in .env');
  process.exit(1);
}

// Helper: generate random string
function generateRandomString(length = 16) {
  return randomBytes(length).toString('hex').slice(0, length);
}

async function deploy(repo) {
  try {
    // Step 1: Create deployment
    const deployResp = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repo,
        gitSource: {
          type: 'github',
          org: GITHUB_ORG,
          repo,
          ref: 'main',
        },
        projectSettings: {
          framework: 'nextjs',
        },
      }),
    });

    const deployData = await deployResp.json();
    if (deployData.error) throw new Error(deployData.error.message);

    const projectId = deployData.project?.id || deployData.projectId;
    if (!projectId) throw new Error('Cannot determine Vercel project ID');

    console.log('✅ Deployment started!');
    console.log('Vercel URL:', `https://${deployData.url}`);

    // Step 2: Add environment variable DATABASE_URL
    const envResp = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'DATABASE_URL',
        value: DATABASE_URL,
        target: ['preview', 'production'],
        type: 'plain',
      }),
    });

    const envData = await envResp.json();
    if (envData.error) throw new Error(envData.error.message);

    console.log('✅ Environment variable DATABASE_URL set successfully');
  } catch (err) {
    console.error('Deployment failed:', err.message);
  }
}

// Get repo name from CLI argument
const repoName = process.argv[2];
if (!repoName) {
  console.error('Usage: node scripts/deploy-to-vercel.mjs <repo-name>');
  process.exit(1);
}

deploy(repoName);
