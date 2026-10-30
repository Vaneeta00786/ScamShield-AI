import type { CompanyVerificationResult } from '../types';

interface VerifyInput {
  companyName: string;
  cin?: string;
  website?: string;
}

const KNOWN_LEGIT_COMPANIES: Record<string, { domain: string; address: string; incorporated: string }> = {
  tcs: { domain: 'tcs.com', address: 'Mumbai, Maharashtra', incorporated: '1968-04-01' },
  wipro: { domain: 'wipro.com', address: 'Bangalore, Karnataka', incorporated: '1945-12-29' },
  infosys: { domain: 'infosys.com', address: 'Bangalore, Karnataka', incorporated: '1981-07-02' },
  accenture: { domain: 'accenture.com', address: 'Dublin, Ireland', incorporated: '1989-01-01' },
  hcl: { domain: 'hcltech.com', address: 'Noida, Uttar Pradesh', incorporated: '1976-08-11' },
  ibm: { domain: 'ibm.com', address: 'New York, USA', incorporated: '1911-06-16' },
  cognizant: { domain: 'cognizant.com', address: 'Teaneck, New Jersey', incorporated: '1994-01-26' },
  capgemini: { domain: 'capgemini.com', address: 'Paris, France', incorporated: '1967-01-01' },
};

const KNOWN_LEGIT_DOMAINS = [
  'linkedin.com', 'naukri.com', 'google.com', 'infosys.com',
  'tcs.com', 'wipro.com', 'accenture.com', 'hcltech.com',
  'amazon.com', 'microsoft.com', 'indeed.com', 'shine.com',
  'glassdoor.com', 'ibm.com', 'cognizant.com', 'capgemini.com',
];

const CIN_REGEX = /^[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;

function extractDomain(url: string): string {
  try {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`;
    return new URL(withProtocol).hostname.replace(/^www\./, '');
  } catch {
    return url.toLowerCase().trim();
  }
}

export function verifyCompany(input: VerifyInput): CompanyVerificationResult {
  const lowerName = input.companyName.toLowerCase().trim();

  const matchKey = Object.keys(KNOWN_LEGIT_COMPANIES).find((k) => lowerName.includes(k));
  const knownEntry = matchKey ? KNOWN_LEGIT_COMPANIES[matchKey] : null;

  let domainStatus: CompanyVerificationResult['domainStatus'] = 'not_checked';
  if (input.website) {
    const domain = extractDomain(input.website);
    if (KNOWN_LEGIT_DOMAINS.includes(domain)) {
      domainStatus = 'verified';
    } else if (knownEntry && domain.includes(knownEntry.domain)) {
      domainStatus = 'verified';
    } else if (
      domain.endsWith('.tk') ||
      domain.endsWith('.xyz') ||
      domain.endsWith('.ru') ||
      domain.includes('free')
    ) {
      domainStatus = 'suspicious';
    } else {
      domainStatus = 'suspicious';
    }
  } else if (knownEntry) {
    domainStatus = 'verified';
  }

  let cinValid = false;
  if (input.cin) {
    cinValid = CIN_REGEX.test(input.cin.trim());
  }

  const registryStatus: CompanyVerificationResult['registryStatus'] = knownEntry
    ? 'found'
    : input.cin && !cinValid
    ? 'not_found'
    : 'unverified';

  let note: string;
  if (knownEntry) {
    note = `Company found in known-legit registry. Registered address: ${knownEntry.address}. Always verify offer letters on the official website (${knownEntry.domain}).`;
  } else if (input.cin && cinValid) {
    note = 'CIN format is valid. Verify on MCA21 portal (mca.gov.in) for full registration details.';
  } else if (input.cin && !cinValid) {
    note = 'CIN format is invalid. A valid CIN starts with U or L, followed by 5 digits, 2 letters, 4 digits, 3 letters, and 6 digits.';
  } else {
    note = 'Company could not be verified against known records. Check MCA21, LinkedIn, or the company website independently.';
  }

  return {
    companyName: input.companyName,
    registryStatus,
    domainStatus,
    ...(input.cin && cinValid ? { cin: input.cin } : {}),
    ...(knownEntry ? { registeredAddress: knownEntry.address, incorporationDate: knownEntry.incorporated } : {}),
    note,
  };
}
