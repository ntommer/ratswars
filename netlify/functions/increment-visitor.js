const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // GitHub configuration - these should match your repo
  const GITHUB_CONFIG = {
    owner: process.env.GITHUB_OWNER || 'ntommer',
    repo: process.env.GITHUB_REPO || 'ratswars',
    branch: process.env.GITHUB_BRANCH || 'main',
    filePath: 'visitor-count.json'
  };

  // GitHub token from environment variable (secure!)
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN environment variable not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // Step 1: Fetch current visitor count file
    const getUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}?ref=${GITHUB_CONFIG.branch}`;

    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RatsWars-Visitor-Counter'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`GitHub API error: ${getResponse.status}`);
    }

    const fileData = await getResponse.json();

    // Decode the content (it's base64 encoded)
    const currentContent = JSON.parse(
      Buffer.from(fileData.content, 'base64').toString('utf-8')
    );

    // Step 2: Increment the count
    const newCount = (currentContent.count || 0) + 1;
    const updatedContent = {
      count: newCount,
      lastUpdated: new Date().toISOString()
    };

    // Step 3: Update the file on GitHub
    const updateUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'RatsWars-Visitor-Counter'
      },
      body: JSON.stringify({
        message: `Update visitor count to ${newCount}`,
        content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64'),
        sha: fileData.sha,
        branch: GITHUB_CONFIG.branch
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update: ${JSON.stringify(errorData)}`);
    }

    // Step 4: Return the new count
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        count: newCount,
        lastUpdated: updatedContent.lastUpdated
      })
    };

  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
