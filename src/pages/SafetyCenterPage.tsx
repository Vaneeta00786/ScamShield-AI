import { Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Props {
  standalone?: boolean;
}

const tips = [
  {
    num: 1,
    title: 'Never pay money to get a job',
    desc: 'Legitimate employers never ask you to pay a registration fee, training fee, uniform deposit, or any other charge before you start work. Any upfront payment request is a scam.',
  },
  {
    num: 2,
    title: 'Never share OTPs or banking credentials',
    desc: 'No genuine recruiter or employer needs your OTP, bank account PIN, or CVV number. Sharing these can result in immediate financial loss.',
  },
  {
    num: 3,
    title: 'Verify recruiters independently',
    desc: 'Search the company name online, look for reviews, and call the company\'s official phone number (found on their official website — not provided by the recruiter). Search for "[Company Name] + scam" on Google.',
  },
  {
    num: 4,
    title: 'Avoid suspicious links',
    desc: 'Do not click links sent by unknown recruiters on WhatsApp or Telegram. These links can steal your data or install malware on your phone.',
  },
  {
    num: 5,
    title: 'Preserve screenshots and evidence',
    desc: 'Take screenshots of all conversations, job offer messages, payment requests, and receipts before they disappear. This evidence is essential when filing a complaint.',
  },
  {
    num: 6,
    title: 'Report immediately',
    desc: 'If you suspect a scam or have lost money, report to the cybercrime helpline 1930 immediately. The sooner you report, the better the chance of recovering funds.',
  },
];

function SafetyCenterContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary mb-3 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-success" />
          Safety Center
        </h1>
        <p className="text-muted max-w-2xl">
          Practical steps to protect yourself from job scams. Read before applying to any job you
          found on social media or received via WhatsApp or Telegram.
        </p>
      </div>

      {/* Safety tips */}
      <div className="space-y-4 mb-12">
        {tips.map(({ num, title, desc }) => (
          <div key={num} className="gradient-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-graphite font-extrabold text-sm shrink-0">
                {num}
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency help */}
      <Card className="bg-red-500/5 border-red-500/20">
        <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-400" />
          Emergency: Cybercrime Helpline
        </h2>
        <p className="text-muted text-sm mb-6">
          If you have been scammed or are currently in a suspicious situation, contact the National
          Cyber Crime Reporting Helpline immediately. Available 24 hours a day, 7 days a week.
        </p>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl font-extrabold text-red-400">1930</div>
          <div className="text-sm text-muted">
            <div className="font-medium text-primary">National Cybercrime Helpline</div>
            <div>Available 24/7</div>
            <div>Free to call from any network</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="tel:1930">
            <Button variant="danger" size="lg" icon={<Phone className="w-5 h-5" />}>
              Call 1930 Now
            </Button>
          </a>
          <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              size="lg"
              icon={<ExternalLink className="w-5 h-5" />}
            >
              File Online Complaint
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}

export default function SafetyCenterPage({ standalone = true }: Props) {
  if (!standalone) {
    return <SafetyCenterContent />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <SafetyCenterContent />
      </main>
      <Footer />
    </div>
  );
}
