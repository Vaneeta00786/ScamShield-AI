import type { CoachResponse } from '../types';

interface QA {
  keywords: string[];
  reply: string;
  relatedTopics: string[];
  urgency: CoachResponse['urgency'];
}

const KB: QA[] = [
  {
    keywords: ['telegram', 'task scam', 'task job', 'click job', 'data entry'],
    reply: 'Telegram task scams are among the most common online job frauds in India. They typically work like this: (1) You are added to a Telegram group promising part-time work — clicking products, rating videos, or liking posts. (2) You complete free tasks and receive small payments to build trust. (3) You are then asked to deposit money to "unlock" higher-paying tasks. (4) Your wallet shows a growing balance you can never actually withdraw. The balance is completely fake. Never deposit money for any online task job.',
    relatedTopics: ['How do I verify if a Telegram group is real?', 'What should I do if I already paid?', 'How do I report a Telegram scam?'],
    urgency: 'medium',
  },
  {
    keywords: ['verify company', 'check company', 'is company real', 'company registered', 'mca', 'cin'],
    reply: 'To verify an Indian company: (1) Visit mca.gov.in → MCA21 portal → search by company name. (2) Check if the company has a valid CIN (Corporate Identification Number). (3) Verify the registered address matches what you were told. (4) Google the company name with the word "scam" or "fraud". (5) Check the domain age on who.is — scam sites are usually less than 1 year old. (6) Call the official number listed on the government registry — not the number they gave you.',
    relatedTopics: ['What is a CIN number?', 'How do I search MCA portal?', 'What if the company is not registered?'],
    urgency: 'low',
  },
  {
    keywords: ['registration fee', 'training fee', 'deposit', 'pay to work', 'refundable fee', 'kit fee', 'security deposit'],
    reply: 'NO legitimate employer ever asks you to pay a fee to get a job. This includes: registration fees, training fees, kit fees, security deposits, ID card fees, or any upfront payment. These are always scam signals. The scheme is: they collect fees from many victims and disappear. The promise that the fee is "refundable" is false — you will never see it again. If anyone asks you to pay to work, end all contact immediately and report to cybercrime.gov.in.',
    relatedTopics: ['How do I get my money back?', 'Where do I report this?', 'What is a legitimate job offer?'],
    urgency: 'high',
  },
  {
    keywords: ['is this job real', 'job real', 'job scam', 'fake offer', 'wfh job', 'work from home'],
    reply: 'Signs that a job offer is fake: (1) Promises very high pay for simple tasks (clicking, liking, rating). (2) Recruiter contacted you via WhatsApp or Telegram without a formal application. (3) No video/voice interview — only text chat. (4) Company cannot be found on mca.gov.in. (5) Asks for any upfront payment. (6) Offers feel too good to be true. (7) Recruiter is evasive about company address or official email. A real job will never ask you to pay anything.',
    relatedTopics: ['How do I verify a company?', 'What is a Telegram task scam?', 'How do I report a fake job?'],
    urgency: 'low',
  },
  {
    keywords: ['already paid', 'sent money', 'transferred money', 'lost money', 'got scammed', 'what to do'],
    reply: "ACT IMMEDIATELY if you have already sent money: (1) CALL 1930 RIGHT NOW — India's National Cybercrime Helpline. The faster you call, the better the chance of recovering funds. (2) File a complaint at cybercrime.gov.in. (3) Contact your bank's fraud department immediately to attempt a transaction reversal. (4) Take screenshots of all conversations, payment receipts, and profiles before they delete their accounts. (5) Do NOT pay any more money — scammers often promise to return your money if you pay a \"release fee\". This is a second scam on top of the first.",
    relatedTopics: ['What is the 1930 helpline?', 'How to file a cybercrime complaint?', 'Can I get my money back?'],
    urgency: 'high',
  },
  {
    keywords: ['1930', 'helpline', 'cybercrime helpline', 'police', 'report to police'],
    reply: "1930 is India's National Cybercrime Financial Fraud Helpline, operated by the Ministry of Home Affairs. Call 1930 if: you have lost money to an online scam, your bank account has been compromised, or you need to report an ongoing fraud. It is free to call 24×7. When you call, keep ready: the amount lost, the account/UPI the money was sent to, screenshots, and transaction IDs. You can also file online at cybercrime.gov.in.",
    relatedTopics: ['How to file a cybercrime complaint online?', 'What details should I keep for the complaint?', 'What happens after I report?'],
    urgency: 'medium',
  },
  {
    keywords: ['cybercrime', 'report online', 'cyber complaint', 'file complaint', 'cybercrime.gov.in'],
    reply: 'To file a cybercrime complaint in India: (1) Visit cybercrime.gov.in. (2) Click "Report Cyber Crime" → "Report Other Cyber Crime". (3) Register with your mobile number. (4) Fill in the complaint form with: type of fraud, date and time, amount lost, suspect account/UPI details, and upload all evidence screenshots. (5) Note your complaint number — use it for follow-ups. For financial fraud, also call 1930 in parallel as that triggers faster bank-level action.',
    relatedTopics: ['What is the 1930 helpline?', 'What evidence should I collect?', 'How long does investigation take?'],
    urgency: 'medium',
  },
];

const DEFAULT: CoachResponse = {
  reply: 'I am ScamShield AI Safety Coach. I can help you identify job scams, verify companies, and guide you if you have already lost money. Try asking: "What is a Telegram task scam?", "How do I verify a company?", or "I already paid — what do I do?"',
  relatedTopics: ['What is a Telegram task scam?', 'How do I verify a company?', 'I already paid, what do I do?'],
  urgency: 'low',
};

export function askCoach(question: string): CoachResponse {
  const lower = question.toLowerCase();

  const isUrgent = lower.includes('already paid') || lower.includes('sent money') || lower.includes('lost money') || lower.includes('transferred money') || lower.includes('got scammed');

  for (const qa of KB) {
    if (qa.keywords.some(kw => lower.includes(kw))) {
      return {
        reply: qa.reply,
        relatedTopics: qa.relatedTopics,
        urgency: isUrgent ? 'high' : qa.urgency,
      };
    }
  }

  return { ...DEFAULT, urgency: isUrgent ? 'high' : 'low' };
}
