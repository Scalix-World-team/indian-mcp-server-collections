# Indian Government MCP Server Scan Results

*Scan Date: 2026-02-08*

This report documents MCP (Model Context Protocol) servers and implementations related to Indian government data and services discovered through GitHub repository scanning.

## Executive Summary

The scan identified **4 distinct projects** involving MCP servers that integrate with Indian government data sources and services. While most Indian government organizations have not yet adopted MCP technology directly in their repositories, several independent developers and organizations have created MCP servers to access government data.

## Key Findings

### 1. Government Data MCP Servers

These servers provide AI-accessible interfaces to official Indian government data sources:

#### **datagovin-mcp-server**
- **Repository**: [the-data-gateway-initiative/datagovin-mcp-server](https://github.com/the-data-gateway-initiative/datagovin-mcp-server)
- **Description**: Core server for exposing India's open government data (data.gov.in) APIs via the Model Context Protocol, powering agentic AI data exploration
- **Language**: Python
- **Stars**: 2
- **Status**: Active (Last updated: 2025-12-04)
- **Data Source**: data.gov.in (National Open Data Portal)
- **Topics**: datagov-in, india, llm-inference, mcp, mcp-server, model-context-protocol

**Key Features**:
- Provides structured access to India's official open government data portal
- Enables AI agents to explore and query government datasets
- Supports agentic AI workflows for data analysis

#### **india-economic-intelligence**
- **Repository**: [adhishthite/india-economic-intelligence](https://github.com/adhishthite/india-economic-intelligence)
- **Description**: AI-powered economic analyst for India using live government data via MoSPI MCP server
- **Language**: TypeScript
- **Stars**: 0
- **Status**: Very recent (Created: 2026-02-07)
- **Data Source**: MoSPI (Ministry of Statistics and Programme Implementation)

**Key Features**:
- Provides AI-powered analysis of Indian economic data
- Integrates with official MoSPI data sources
- Real-time government statistics access

#### **mcp-india-tenders**
- **Repository**: [switchr24/mcp-india-tenders](https://github.com/switchr24/mcp-india-tenders)
- **Description**: MCP server for searching and analyzing Indian government tenders from CPPP, eProc Rajasthan, and Defence portals
- **Language**: Not specified
- **Stars**: 1
- **Forks**: 1
- **Status**: Active (Last updated: 2026-02-08)
- **Data Sources**: 
  - CPPP (Central Public Procurement Portal)
  - eProc Rajasthan
  - Defence procurement portals

**Key Features**:
- OCDS-compliant tender data
- Advanced search capabilities
- Budget information access
- AI-friendly analysis tools for government procurement

### 2. Government Organization Internal MCP Usage

#### **MOSIP (Modular Open Source Identity Platform)**
- **Organization**: [mosip](https://github.com/mosip)
- **Repository**: [mosip/documentation](https://github.com/mosip/documentation)
- **MCP Reference**: Documentation on using MCP for technical writing workflows
- **Status**: Documentation/Planning stage

**Usage Context**:
- MOSIP is exploring MCP for documentation automation
- Use case: Intelligent documentation generation for technical writers
- Implementation: Custom MCP servers for documentation workflows
- Features planned:
  - Automated release notes generation
  - Documentation structure validation
  - Cross-reference management
  - Feature extraction from code

**Significance**: 
MOSIP is a critical digital public infrastructure project backed by the Indian government for identity verification. Their exploration of MCP shows government infrastructure projects are considering MCP for internal workflows.

## Summary by Category

### Government Data Access Servers: 3
1. **datagovin-mcp-server** - National Open Data Portal (data.gov.in)
2. **india-economic-intelligence** - Economic data via MoSPI
3. **mcp-india-tenders** - Government procurement tenders

### Government Organization Internal Use: 1
1. **MOSIP** - Documentation automation (planning/documentation stage)

## Government Data Sources Covered

1. **data.gov.in** - National Open Data Portal
2. **MoSPI** - Ministry of Statistics and Programme Implementation
3. **CPPP** - Central Public Procurement Portal
4. **eProc Rajasthan** - Rajasthan State Procurement
5. **Defence Portals** - Defence procurement

## Scanned Organizations

The following known Indian government and government-related organizations were scanned:

- egovernments (eGov Foundation)
- project-sunbird (Sunbird Education)
- NIC-INDIA (National Informatics Centre)
- nic-delhi (NIC Delhi)
- DIKSHA-Engineering (DIKSHA Education Platform)
- OpenG2P (Open Government to People)
- UPHRH (Uttar Pradesh Health Resource Hub)
- iSPIRT (Indian Software Product Industry Round Table)
- openindia (Open India Stack)
- beckn (Beckn Protocol)
- **mosip** (Modular Open Source Identity Platform) ✓ MCP usage found
- swasth-alliance (Swasth Alliance - Health)
- CoWIN (COVID Vaccination Platform)
- digit-egov (DIGIT - Digital Infrastructure for Governance)
- NPCI (National Payments Corporation of India)
- Unified-Health-Interface
- GovStackWorkingGroup
- rajasthan (Rajasthan Government)
- kerala (Kerala Government)
- karnataka (Karnataka Government)

## Analysis

### Current State
- **Direct government adoption**: Minimal - Only MOSIP has documented MCP exploration
- **Third-party integrations**: Active - Several developers creating MCP servers for government data
- **Data accessibility**: Growing - Multiple government data portals being made AI-accessible

### Opportunities for Growth

The following Indian government services represent significant opportunities for MCP server development:

1. **Identity Services**
   - Aadhaar integration
   - DigiLocker access
   - eKYC services

2. **Financial Services**
   - UPI payment systems (already covered in main collection)
   - Tax filing (Income Tax, GST)
   - Subsidy tracking

3. **Civic Services**
   - Passport application tracking
   - Driving license services
   - Property registration

4. **Healthcare**
   - Ayushman Bharat
   - CoWIN vaccination data
   - ABHA (Ayushman Bharat Health Account)

5. **Agricultural Services**
   - PM-KISAN
   - MGNREGA
   - Agricultural market prices

6. **Education**
   - DIKSHA platform
   - UDISE+ (education statistics)

## Methodology

This scan was conducted using:
1. GitHub search API for repository discovery
2. GitHub code search for MCP references within government organization repositories
3. Manual review of discovered repositories
4. Analysis of repository metadata, topics, and descriptions

**Search Terms Used**:
- "india government mcp server"
- "indian government model context protocol"
- "data.gov.in mcp"
- "mospi mcp server"
- Organization-specific code searches for "modelcontextprotocol"

## Recommendations

1. **For Government Organizations**: 
   - Consider official MCP servers for popular government APIs
   - Ensure API documentation is MCP-compatible
   - Support community-built MCP servers with proper API access

2. **For MCP Developers**:
   - Focus on high-value government services (identity, payments, healthcare)
   - Ensure compliance with government API terms of service
   - Implement proper authentication and security measures

3. **For This Repository**:
   - Add the discovered government data MCP servers to the main collection
   - Create a dedicated section for government data servers
   - Monitor for new government MCP implementations

## Resources

- [India Stack Documentation](https://www.indiastack.org/)
- [National Open Data Portal](https://data.gov.in/)
- [MoSPI Data Portal](https://www.mospi.gov.in/)
- [Central Public Procurement Portal](https://eprocure.gov.in/)
- [MOSIP Official Site](https://www.mosip.io/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)

## Conclusion

While direct government organization adoption of MCP is currently limited to documentation and planning stages (MOSIP), there is significant community activity in creating MCP servers for government data access. The Indian government's extensive digital public infrastructure and open data initiatives provide excellent opportunities for MCP server development, enabling AI agents to access and analyze government data for citizen services.
