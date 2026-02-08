# Government MCP Scanner

This tool scans GitHub repositories from Indian government organizations to identify MCP (Model Context Protocol) server implementations and usage.

## What it does

The scanner:
1. Searches through known Indian government GitHub organizations
2. Analyzes repositories for MCP-related code and dependencies
3. Checks for MCP references in package.json, requirements.txt, and code
4. Generates a comprehensive report of findings

## Usage

### Prerequisites

```bash
npm install
```

### Running the Scanner

```bash
npm run scan-government
```

### With GitHub Token (Recommended)

For higher API rate limits, set a GitHub personal access token:

```bash
export GITHUB_TOKEN=your_github_token_here
npm run scan-government
```

## Output

The scanner generates:
- Console output with scan progress
- A detailed report at `government/scan-results.md`

## Government Organizations Scanned

The scanner searches the following organizations:
- egovernments (eGov Foundation)
- project-sunbird (Sunbird Education)
- NIC-INDIA (National Informatics Centre)
- MOSIP (Modular Open Source Identity Platform)
- beckn (Beckn Protocol)
- And many more...

See `scripts/scan_government_mcp.js` for the complete list.

## How It Works

The scanner looks for:
1. **Repository names** containing MCP-related keywords
2. **Descriptions** mentioning Model Context Protocol
3. **package.json** with MCP dependencies
4. **requirements.txt** with MCP packages
5. **Code references** to MCP libraries

## Report Format

The generated report includes:
- Summary of findings
- Detailed repository information
- MCP evidence for each discovery
- Analysis and recommendations
- List of scanned organizations

## Recent Findings

As of 2026-02-08, the scanner found:
- **3** MCP servers providing access to government data
- **1** government organization exploring MCP internally (MOSIP)

See `government/scan-results.md` for complete details.
