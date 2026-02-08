/**
 * GitHub Government MCP Scanner
 * 
 * This script scans GitHub repositories from Indian government organizations
 * to identify MCP (Model Context Protocol) server implementations and usage.
 * 
 * Run with: node scripts/scan_government_mcp.js
 * 
 * Note: Requires GitHub Personal Access Token set as GITHUB_TOKEN environment variable.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.warn('Warning: GITHUB_TOKEN environment variable not set. API rate limits will be more restrictive.');
}

// Known Indian Government GitHub Organizations
const INDIAN_GOVERNMENT_ORGS = [
  'egovernments',           // eGov Foundation
  'project-sunbird',        // Sunbird (Education)
  'NIC-INDIA',              // National Informatics Centre
  'nic-delhi',              // NIC Delhi
  'DIKSHA-Engineering',     // DIKSHA Education Platform
  'OpenG2P',                // Open Government to People
  'UPHRH',                  // Uttar Pradesh Health Resource Hub
  'iSPIRT',                 // Indian Software Product Industry Round Table
  'openindia',              // Open India Stack
  'beckn',                  // Beckn Protocol (Open Commerce)
  'mosip',                  // Modular Open Source Identity Platform
  'swasth-alliance',        // Swasth Alliance (Health)
  'CoWIN',                  // COVID Vaccination Platform
  'digit-egov',             // DIGIT (Digital Infrastructure for Governance)
  'NPCI',                   // National Payments Corporation of India
  'Unified-Health-Interface', // Unified Health Interface
  'GovStackWorkingGroup',   // GovStack
  'rajasthan',              // Rajasthan Government
  'kerala',                 // Kerala Government
  'karnataka',              // Karnataka Government
];

// MCP-related search patterns
const MCP_PATTERNS = {
  packageJson: ['@modelcontextprotocol/', 'mcp-server', 'model-context-protocol'],
  requirementsTxt: ['mcp-server', 'model-context-protocol', 'modelcontextprotocol'],
  filenames: ['mcp.json', 'mcp.config.json', '.mcp.json'],
  repoKeywords: ['mcp', 'model-context-protocol', 'mcp-server'],
  descriptions: ['model context protocol', 'mcp server', 'mcp integration']
};

/**
 * Make a GitHub API request
 * @param {string} path - API path
 * @returns {Promise<Object>} - Response data
 */
async function githubRequest(apiPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: apiPath,
      method: 'GET',
      headers: {
        'User-Agent': 'India-Government-MCP-Scanner',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 404) {
          resolve(null);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (err) {
          reject(new Error(`Error parsing GitHub API response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Error making GitHub API request: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Get repositories for an organization
 * @param {string} org - Organization name
 * @returns {Promise<Array>} - List of repositories
 */
async function getOrgRepos(org) {
  try {
    const data = await githubRequest(`/orgs/${org}/repos?per_page=100`);
    return data || [];
  } catch (err) {
    console.error(`Error fetching repos for ${org}: ${err.message}`);
    return [];
  }
}

/**
 * Check if repository has package.json with MCP dependencies
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object|null>} - MCP info if found
 */
async function checkPackageJson(owner, repo) {
  try {
    const data = await githubRequest(`/repos/${owner}/${repo}/contents/package.json`);
    if (!data || !data.content) return null;

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const packageJson = JSON.parse(content);
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    const mcpDeps = Object.keys(dependencies).filter(dep => 
      MCP_PATTERNS.packageJson.some(pattern => dep.includes(pattern))
    );

    if (mcpDeps.length > 0) {
      return {
        type: 'package.json',
        dependencies: mcpDeps,
        isServer: packageJson.name?.includes('mcp-server') || 
                  packageJson.description?.toLowerCase().includes('mcp server')
      };
    }
  } catch (err) {
    // File doesn't exist or error reading it
  }
  return null;
}

/**
 * Check if repository has requirements.txt with MCP dependencies
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object|null>} - MCP info if found
 */
async function checkRequirementsTxt(owner, repo) {
  try {
    const data = await githubRequest(`/repos/${owner}/${repo}/contents/requirements.txt`);
    if (!data || !data.content) return null;

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const lines = content.split('\n');
    
    const mcpDeps = lines.filter(line => 
      MCP_PATTERNS.requirementsTxt.some(pattern => line.toLowerCase().includes(pattern))
    );

    if (mcpDeps.length > 0) {
      return {
        type: 'requirements.txt',
        dependencies: mcpDeps
      };
    }
  } catch (err) {
    // File doesn't exist or error reading it
  }
  return null;
}

/**
 * Search repository code for MCP references
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<boolean>} - True if MCP code found
 */
async function searchRepoCode(owner, repo) {
  try {
    // Search for MCP-related code in the repository
    const query = encodeURIComponent(`repo:${owner}/${repo} "model context protocol" OR "mcp-server" OR "@modelcontextprotocol"`);
    const data = await githubRequest(`/search/code?q=${query}`);
    
    if (data && data.total_count > 0) {
      return true;
    }
  } catch (err) {
    // Search failed or no results
  }
  return false;
}

/**
 * Analyze a repository for MCP usage
 * @param {Object} repo - Repository object from GitHub API
 * @returns {Promise<Object|null>} - MCP analysis results
 */
async function analyzeRepository(repo) {
  console.log(`  Analyzing: ${repo.full_name}`);
  
  const owner = repo.owner.login;
  const repoName = repo.name;
  
  // Check repository name and description for MCP keywords
  const nameMatch = MCP_PATTERNS.repoKeywords.some(keyword => 
    repoName.toLowerCase().includes(keyword)
  );
  
  const descMatch = repo.description && MCP_PATTERNS.descriptions.some(desc => 
    repo.description.toLowerCase().includes(desc)
  );

  // Check for MCP dependencies in package files
  const packageJsonMcp = await checkPackageJson(owner, repoName);
  const requirementsMcp = await checkRequirementsTxt(owner, repoName);
  
  // If we found MCP usage, return the details
  if (nameMatch || descMatch || packageJsonMcp || requirementsMcp) {
    return {
      repository: repo.full_name,
      url: repo.html_url,
      description: repo.description || 'No description',
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      lastUpdated: repo.updated_at,
      mcpIndicators: {
        nameMatch,
        descriptionMatch: descMatch,
        packageJson: packageJsonMcp,
        requirements: requirementsMcp
      }
    };
  }
  
  return null;
}

/**
 * Generate markdown report
 * @param {Array} results - Analysis results
 * @returns {string} - Markdown report
 */
function generateMarkdownReport(results) {
  let markdown = `# Indian Government MCP Server Scan Results\n\n`;
  markdown += `*Scan Date: ${new Date().toISOString().split('T')[0]}*\n\n`;
  markdown += `This report contains repositories from Indian government organizations that show evidence of MCP (Model Context Protocol) usage.\n\n`;
  
  if (results.length === 0) {
    markdown += `## No Results Found\n\n`;
    markdown += `The scan did not find any repositories from Indian government organizations with clear MCP implementation or usage.\n\n`;
    markdown += `### Scanned Organizations:\n\n`;
    for (const org of INDIAN_GOVERNMENT_ORGS) {
      markdown += `- ${org}\n`;
    }
    markdown += `\n### What was searched:\n\n`;
    markdown += `- Repository names containing: ${MCP_PATTERNS.repoKeywords.join(', ')}\n`;
    markdown += `- Repository descriptions mentioning: ${MCP_PATTERNS.descriptions.join(', ')}\n`;
    markdown += `- package.json dependencies: ${MCP_PATTERNS.packageJson.join(', ')}\n`;
    markdown += `- requirements.txt packages: ${MCP_PATTERNS.requirementsTxt.join(', ')}\n`;
    return markdown;
  }

  markdown += `## Summary\n\n`;
  markdown += `Total repositories found: **${results.length}**\n\n`;
  
  markdown += `## Repositories\n\n`;
  markdown += `| Repository | Description | Language | Stars | MCP Indicators |\n`;
  markdown += `|------------|-------------|----------|-------|----------------|\n`;
  
  for (const result of results) {
    const indicators = [];
    if (result.mcpIndicators.nameMatch) indicators.push('Name');
    if (result.mcpIndicators.descriptionMatch) indicators.push('Description');
    if (result.mcpIndicators.packageJson) indicators.push('package.json');
    if (result.mcpIndicators.requirements) indicators.push('requirements.txt');
    
    markdown += `| [${result.repository}](${result.url}) | ${result.description} | ${result.language} | ${result.stars} | ${indicators.join(', ')} |\n`;
  }
  
  markdown += `\n## Detailed Findings\n\n`;
  
  for (const result of results) {
    markdown += `### ${result.repository}\n\n`;
    markdown += `- **URL**: ${result.url}\n`;
    markdown += `- **Description**: ${result.description}\n`;
    markdown += `- **Language**: ${result.language}\n`;
    markdown += `- **Stars**: ${result.stars}\n`;
    markdown += `- **Last Updated**: ${result.lastUpdated}\n`;
    markdown += `\n**MCP Evidence:**\n`;
    
    if (result.mcpIndicators.nameMatch) {
      markdown += `- Repository name contains MCP-related keywords\n`;
    }
    if (result.mcpIndicators.descriptionMatch) {
      markdown += `- Description mentions Model Context Protocol\n`;
    }
    if (result.mcpIndicators.packageJson) {
      markdown += `- Found MCP dependencies in package.json:\n`;
      for (const dep of result.mcpIndicators.packageJson.dependencies) {
        markdown += `  - ${dep}\n`;
      }
    }
    if (result.mcpIndicators.requirements) {
      markdown += `- Found MCP dependencies in requirements.txt:\n`;
      for (const dep of result.mcpIndicators.requirements.dependencies) {
        markdown += `  - ${dep}\n`;
      }
    }
    markdown += `\n`;
  }
  
  markdown += `## Scanned Organizations\n\n`;
  for (const org of INDIAN_GOVERNMENT_ORGS) {
    markdown += `- ${org}\n`;
  }
  
  return markdown;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting Indian Government MCP Server Scanner...\n');
  console.log(`Scanning ${INDIAN_GOVERNMENT_ORGS.length} government organizations...\n`);
  
  const allResults = [];
  
  for (const org of INDIAN_GOVERNMENT_ORGS) {
    console.log(`\nScanning organization: ${org}`);
    
    const repos = await getOrgRepos(org);
    console.log(`  Found ${repos.length} repositories`);
    
    for (const repo of repos) {
      const result = await analyzeRepository(repo);
      if (result) {
        console.log(`    ✓ Found MCP usage in ${repo.full_name}`);
        allResults.push(result);
      }
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log(`\n\n=== Scan Complete ===`);
  console.log(`Total MCP repositories found: ${allResults.length}\n`);
  
  // Generate report
  const report = generateMarkdownReport(allResults);
  
  // Save to file
  const outputPath = path.join(__dirname, '..', 'government', 'scan-results.md');
  fs.writeFileSync(outputPath, report);
  console.log(`Report saved to: ${outputPath}`);
  
  // Also output to console
  console.log('\n' + report);
}

// Run the scanner
main().catch(err => {
  console.error(`Error running scanner: ${err.message}`);
  process.exit(1);
});
