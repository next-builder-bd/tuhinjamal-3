import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

const {
  VERCEL_CLIENT_ID,
  VERCEL_CLIENT_SECRET,
  GITHUB_ORG // the owner/org of the repo
} = process.env;

// ------------------------
// Utility: Random string
// ------------------------
function generateRandomString(length = 20) {
  return crypto.randomBytes(length).toString('hex');
}

// ------------------------
// Step 1: Start OAuth for Vercel
// ------------------------
app.get('/deploy-vercel/:repoName', (req, res) => {
  const { repoName } = req.params;
  const state = generateRandomString();

  const oauthUrl = `https://vercel.com/oauth/authorize?client_id=${VERCEL_CLIENT_ID}&scope=deploy&state=${state}&redirect_uri=http://localhost:${PORT}/oauth/callback?repo=${repoName}`;
  res.redirect(oauthUrl);
});

// ------------------------
// Step 2: OAuth callback
// ------------------------
app.get('/oauth/callback', async (req, res) => {
  const { code, state, repo } = req.query;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: VERCEL_CLIENT_ID,
        client_secret: VERCEL_CLIENT_SECRET,
        code,
        redirect_uri: `http://localhost:${PORT}/oauth/callback?repo=${repo}`
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Deploy the repo to Vercel
    const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repo,
        gitSource: {
          type: 'github',
          org: GITHUB_ORG,
          repo,
          branch: 'main'
        },
        projectSettings: {
          framework: 'nextjs',
          env: []
        }
      })
    });

    const deployData = await deployResponse.json();

    res.send(`<h2>Deployment started!</h2>
              <p>Vercel URL: <a href="https://${deployData.url}">https://${deployData.url}</a></p>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Deployment failed. Check server logs.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
