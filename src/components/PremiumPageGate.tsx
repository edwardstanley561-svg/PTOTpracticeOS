import { Link } from 'react-router-dom';
import { Lock, Check, ArrowRight, Zap, Building2, Crown, Shield, Sparkles } from 'lucide-react';

interface PremiumPageGateProps {
  featureName: string;
  featureDescription: string;
  requiredPlan: 'practice' | 'pro';
  children?: React.ReactNode;
  showPreview?: boolean;
}

const plans = {
  practice: {
    name: 'Practice',
    price: 99,
    icon: Building2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    features: [
      'Up to 5 team members',
      'Unlimited patients',
      'Role-based access control',
      'Claims tracking & status',
      'Referral relationship mgmt',
      'Compliance audit checklists',
      'PDF report exports',
      'Staff assignment & tasks',
    ],
  },
  pro: {
    name: 'Pro',
    price: 249,
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    features: [
      'Everything in Practice',
      'Unlimited team members',
      'Multiple locations',
      'Advanced permissions',
      'API access',
      'Calendar sync',
      'Custom report builder',
      'Priority support (4hr SLA)',
    ],
  },
};

export default function PremiumPageGate({ featureName, featureDescription, requiredPlan, children, showPreview = true }: PremiumPageGateProps) {
  const plan = plans[requiredPlan];
  const Icon = plan.icon;

  return (
    <div className="relative">
      {/* Preview content (blurred) */}
      {showPreview && children && (
        <div className="pointer-events-none select-none blur-[3px] opacity-40">
          {children}
        </div>
      )}

      {/* Paywall overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center ${showPreview ? '' : 'min-h-[600px]'}`}>
        <div className="max-w-2xl w-full mx-auto px-4 py-12 text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border-2 border-amber-200">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{featureName}</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">{featureDescription}</p>

          {/* Plan card */}
          <div className={`mt-8 p-6 bg-white rounded-2xl border-2 ${plan.border} shadow-lg max-w-md mx-auto text-left`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${plan.bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${plan.color}`} />
              </div>
              <div>
                <p className="font-bold text-gray-900">{plan.name} Plan</p>
                <p className="text-xs text-gray-500">Best for small clinics</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl font-bold text-gray-900">${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-emerald-600">Annual billing</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className={`h-4 w-4 ${plan.color} shrink-0`} />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/pricing"
              className={`w-full py-3 ${requiredPlan === 'practice' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              <Sparkles className="h-4 w-4" />
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Additional plans */}
          {requiredPlan === 'practice' && (
            <div className="mt-6 flex items-center justify-center gap-6">
              <Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                Compare all plans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              HIPAA compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              No credit card required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
