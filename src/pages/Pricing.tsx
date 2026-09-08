import { useState } from 'react';
import { 
  Check, X, Zap, Building2, Crown, Wrench, ArrowRight, 
  Shield, Star, Sparkles, Users, Calendar, FileText, 
  DollarSign, ClipboardList, TrendingUp, Lock
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  popular?: boolean;
  features: { text: string; included: boolean; highlight?: boolean }[];
  cta: string;
  ctaStyle: string;
}

const plans: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'For independent therapists',
    monthlyPrice: 39,
    annualPrice: 29,
    annualSavings: 120,
    icon: Zap,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      { text: '1 therapist seat', included: true },
      { text: 'Up to 100 active patients', included: true },
      { text: 'Patient management', included: true },
      { text: 'Scheduling & calendar', included: true },
      { text: 'Authorization tracker', included: true, highlight: true },
      { text: 'SOAP & evaluation notes', included: true },
      { text: 'Dashboard with alerts', included: true },
      { text: 'Treatment plans', included: true },
      { text: 'Multi-user access', included: false },
      { text: 'Claims tracking', included: false },
      { text: 'Referral management', included: false },
      { text: 'Compliance audits', included: false },
      { text: 'PDF exports', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    id: 'practice',
    name: 'Practice',
    tagline: 'For small clinics (2–5 staff)',
    monthlyPrice: 149,
    annualPrice: 99,
    annualSavings: 600,
    icon: Building2,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    popular: true,
    features: [
      { text: 'Up to 5 team members', included: true },
      { text: 'Unlimited patients', included: true },
      { text: 'Everything in Solo', included: true },
      { text: 'Role-based access control', included: true, highlight: true },
      { text: 'Claims tracking & status', included: true, highlight: true },
      { text: 'Referral relationship mgmt', included: true, highlight: true },
      { text: 'Compliance audit checklists', included: true, highlight: true },
      { text: 'PDF report exports', included: true },
      { text: 'Staff assignment & tasks', included: true },
      { text: 'Authorization bulk actions', included: true },
      { text: 'Multiple locations', included: false },
      { text: 'API access', included: false },
      { text: 'Custom integrations', included: false },
      { text: 'Dedicated success manager', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing practices',
    monthlyPrice: 299,
    annualPrice: 249,
    annualSavings: 600,
    icon: Crown,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      { text: 'Unlimited team members', included: true },
      { text: 'Everything in Practice', included: true },
      { text: 'Multiple locations', included: true, highlight: true },
      { text: 'Advanced permissions', included: true, highlight: true },
      { text: 'API access', included: true, highlight: true },
      { text: 'Custom report builder', included: true },
      { text: 'Calendar sync (Google/Outlook)', included: true },
      { text: 'Automated reminders (compliant)', included: true },
      { text: 'White-label PDFs', included: true },
      { text: 'Audit log exports', included: true },
      { text: 'Priority support (4hr SLA)', included: true },
      { text: 'Clearinghouse integration', included: false },
      { text: 'EHR/FHIR interoperability', included: false },
      { text: 'Custom onboarding', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  {
    id: 'implementation',
    name: 'Implementation',
    tagline: 'One-time setup for new clinics',
    monthlyPrice: 1500,
    annualPrice: 1500,
    annualSavings: 0,
    icon: Wrench,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    features: [
      { text: 'Data migration & setup', included: true, highlight: true },
      { text: 'Template configuration', included: true, highlight: true },
      { text: 'Workflow customization', included: true, highlight: true },
      { text: 'Staff training (2 sessions)', included: true },
      { text: 'Payer setup assistance', included: true },
      { text: 'Authorization import', included: true },
      { text: 'Patient data migration', included: true },
      { text: 'Compliance checklist setup', included: true },
      { text: '30-day post-launch support', included: true },
      { text: 'Go-live readiness review', included: true },
      { text: 'Ongoing subscription sold separately', included: true },
      { text: '', included: true },
      { text: '', included: true },
      { text: '', included: true },
    ],
    cta: 'Schedule Consultation',
    ctaStyle: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
];

const featureMatrix = [
  { category: 'Core Operations', features: [
    { name: 'Patient management', solo: true, practice: true, pro: true },
    { name: 'Scheduling & calendar', solo: true, practice: true, pro: true },
    { name: 'Authorization tracker', solo: true, practice: true, pro: true },
    { name: 'Treatment plans', solo: true, practice: true, pro: true },
    { name: 'Dashboard & alerts', solo: true, practice: true, pro: true },
  ]},
  { category: 'Clinical Documentation', features: [
    { name: 'SOAP notes', solo: true, practice: true, pro: true },
    { name: 'Initial evaluations', solo: true, practice: true, pro: true },
    { name: 'Re-evaluations', solo: true, practice: true, pro: true },
    { name: 'Discharge summaries', solo: true, practice: true, pro: true },
    { name: 'HEP handouts', solo: false, practice: true, pro: true },
  ]},
  { category: 'Team & Operations', features: [
    { name: 'Multi-user access', solo: false, practice: true, pro: true },
    { name: 'Role-based permissions', solo: false, practice: true, pro: true },
    { name: 'Staff assignment', solo: false, practice: true, pro: true },
    { name: 'Multiple locations', solo: false, practice: false, pro: true },
    { name: 'Advanced permissions', solo: false, practice: false, pro: true },
  ]},
  { category: 'Revenue & Compliance', features: [
    { name: 'Claims tracking', solo: false, practice: true, pro: true },
    { name: 'Referral management', solo: false, practice: true, pro: true },
    { name: 'Compliance audits', solo: false, practice: true, pro: true },
    { name: 'PDF exports', solo: false, practice: true, pro: true },
    { name: 'Custom report builder', solo: false, practice: false, pro: true },
  ]},
  { category: 'Integrations & Support', features: [
    { name: 'Calendar sync', solo: false, practice: false, pro: true },
    { name: 'API access', solo: false, practice: false, pro: true },
    { name: 'Clearinghouse integration', solo: false, practice: false, pro: false },
    { name: 'Priority support', solo: false, practice: false, pro: true },
    { name: 'Dedicated success manager', solo: false, practice: false, pro: false },
  ]},
];

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          14-day free trial • No credit card required
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 mt-3">
          Choose the plan that fits your practice. Upgrade, downgrade, or cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'annual' ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billing === 'annual' ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${billing === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
            Annual
            <span className="ml-1.5 text-xs text-emerald-600 font-semibold">Save up to 20%</span>
          </span>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isImplementation = plan.id === 'implementation';
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col transition-all hover:shadow-lg ${
                plan.popular ? `${plan.borderColor} shadow-md` : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${plan.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${plan.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.tagline}</p>
                </div>
              </div>

              <div className="mb-6">
                {isImplementation ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">${price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">one-time</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                )}
                {billing === 'annual' && !isImplementation && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Billed annually • Save ${plan.annualSavings}/yr
                  </p>
                )}
              </div>

              <button
                onClick={() => { setSelectedPlan(plan.id); setShowCheckout(true); }}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>

              <div className="mt-6 space-y-2.5 flex-1">
                {plan.features.filter(f => f.text).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${feature.highlight ? 'text-emerald-600' : 'text-gray-400'}`} />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 text-gray-300 shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? (feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-600') : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature comparison matrix */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Compare all features</h2>
        <p className="text-sm text-gray-500 text-center mb-8">See exactly what's included in each plan</p>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Solo</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-emerald-700">Practice</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-purple-700">Pro</th>
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((section) => (
                  <>
                    <tr key={section.category} className="bg-gray-50/50">
                      <td colSpan={4} className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-6 py-3 text-sm text-gray-700">{feature.name}</td>
                        <td className="px-4 py-3 text-center">
                          {feature.solo ? <Check className="h-4 w-4 text-blue-600 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.practice ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.pro ? <Check className="h-4 w-4 text-purple-600 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I try before I buy?', a: 'Yes! All subscription plans include a 14-day free trial with full access. No credit card required to start.' },
            { q: 'What happens to my data if I downgrade?', a: 'Your data is always preserved. If you downgrade, features beyond your plan become read-only. You can upgrade anytime to restore full access.' },
            { q: 'Is my patient data HIPAA-compliant?', a: 'Absolutely. All plans include encryption at rest and in transit, audit logging, role-based access controls, and session timeouts. We sign BAAs with all customers.' },
            { q: 'Do you offer discounts for annual billing?', a: 'Yes — annual billing saves up to 20% compared to monthly. You can switch between billing cycles at any time.' },
            { q: 'What counts as a "team member"?', a: 'Anyone with login access to your practice workspace counts as a seat. Read-only auditors and patient portal users do not count.' },
            { q: 'Can I add the Implementation package later?', a: 'Yes. The Implementation package is available anytime for practices that need hands-on setup help, data migration, or staff training.' },
          ].map((faq) => (
            <details key={faq.q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">
                {faq.q}
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
        <Shield className="h-10 w-10 text-white/80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Ready to streamline your practice?</h2>
        <p className="text-blue-100 mt-2 max-w-xl mx-auto">
          Join hundreds of PT/OT practices using Practice OS to prevent missed authorizations, 
          lost follow-ups, and incomplete documentation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button 
            onClick={() => { setSelectedPlan('practice'); setShowCheckout(true); }}
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Free Trial
          </button>
          <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            Talk to Sales
          </button>
        </div>
        <p className="text-xs text-blue-200 mt-4">HIPAA-compliant • BAA included • Cancel anytime</p>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <CheckoutModal 
          plan={plans.find(p => p.id === selectedPlan)!} 
          billing={billing}
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </div>
  );
}

function CheckoutModal({ plan, billing, onClose }: { plan: Plan; billing: 'monthly' | 'annual'; onClose: () => void }) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const isImplementation = plan.id === 'implementation';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {step === 'success' ? 'Welcome aboard!' : `Subscribe to ${plan.name}`}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 'details' && 'Enter your practice details'}
              {step === 'payment' && 'Secure payment information'}
              {step === 'success' && 'Your trial has started'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'details' && (
          <div className="p-6 space-y-4">
            {/* Plan summary */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${plan.iconBg} rounded-lg flex items-center justify-center`}>
                    <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{plan.name} Plan</p>
                    <p className="text-xs text-gray-500">{billing === 'annual' ? 'Billed annually' : 'Billed monthly'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${price}{!isImplementation && '/mo'}</p>
                  {billing === 'annual' && !isImplementation && (
                    <p className="text-xs text-emerald-600">${price * 12}/year</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Practice name</label>
                <input type="text" placeholder="Your practice" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">NPI number</label>
                <input type="text" placeholder="Optional" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Work email</label>
              <input type="email" placeholder="you@practice.com" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Full name</label>
              <input type="text" placeholder="Your name" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="baa" className="mt-1 rounded border-gray-300" />
              <label htmlFor="baa" className="text-xs text-gray-600">
                I agree to the <a className="text-blue-600 underline">Terms of Service</a>, <a className="text-blue-600 underline">Privacy Policy</a>, and acknowledge the <a className="text-blue-600 underline">Business Associate Agreement (BAA)</a> for HIPAA compliance.
              </label>
            </div>

            <button 
              onClick={() => setStep('payment')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Continue to Payment
            </button>
            <p className="text-xs text-gray-400 text-center">14-day free trial • Cancel anytime</p>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Order Summary</p>
                <button onClick={() => setStep('details')} className="text-xs text-blue-600 hover:underline">Edit</button>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{plan.name} Plan ({billing})</span>
                  <span>${price}/mo</span>
                </div>
                {billing === 'annual' && !isImplementation && (
                  <div className="flex justify-between text-emerald-600 text-xs">
                    <span>Annual discount</span>
                    <span>-${plan.monthlyPrice - plan.annualPrice}/mo</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Trial period (14 days)</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 mt-1.5 flex justify-between font-semibold text-gray-900">
                  <span>Due after trial</span>
                  <span>${isImplementation ? price.toLocaleString() : `${price}/mo`}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Card number</label>
              <div className="mt-1 relative">
                <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm pr-12" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Expiry</label>
                <input type="text" placeholder="MM / YY" className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">CVC</label>
                <input type="text" placeholder="123" className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Name on card</label>
              <input type="text" placeholder="Full name" className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700">
                Your payment is secured with 256-bit TLS encryption. We never store your full card number.
              </p>
            </div>

            <button 
              onClick={() => setStep('success')}
              className={`w-full py-3 ${plan.ctaStyle} font-semibold rounded-lg transition-colors`}
            >
              {isImplementation ? `Pay $${price.toLocaleString()}` : 'Start Free Trial'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">You're all set!</h3>
            <p className="text-sm text-gray-500 mt-2">
              {isImplementation 
                ? 'Our team will reach out within 24 hours to schedule your implementation consultation.'
                : `Your 14-day free trial of the ${plan.name} plan has started. You won't be charged until the trial ends.`
              }
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">What's next</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">1</div>
                Set up your practice profile and locations
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">2</div>
                Invite your team members
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">3</div>
                Add your first patients and authorizations
              </div>
            </div>
            <button 
              onClick={onClose}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
