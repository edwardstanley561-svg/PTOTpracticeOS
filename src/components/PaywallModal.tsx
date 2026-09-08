import { useState } from 'react';
import { Lock, Check, X, ArrowRight, Sparkles, Shield, Zap, Building2, Crown } from 'lucide-react';

export type PlanTier = 'solo' | 'practice' | 'pro';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: PlanTier;
  featureName: string;
  featureDescription?: string;
  currentPlan?: PlanTier;
}

const planInfo: Record<PlanTier, { name: string; price: number; icon: React.ElementType; color: string; bg: string }> = {
  solo: { name: 'Solo', price: 39, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
  practice: { name: 'Practice', price: 149, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  pro: { name: 'Pro', price: 299, icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50' },
};

const planFeatures: Record<PlanTier, string[]> = {
  solo: [
    '1 therapist seat',
    'Up to 100 active patients',
    'Patient management & scheduling',
    'Authorization tracker',
    'Clinical documentation',
    'Dashboard with alerts',
  ],
  practice: [
    'Up to 5 team members',
    'Unlimited patients',
    'Everything in Solo',
    'Role-based access control',
    'Claims tracking & status',
    'Referral relationship mgmt',
    'Compliance audit checklists',
    'PDF report exports',
    'Staff assignment & tasks',
  ],
  pro: [
    'Unlimited team members',
    'Everything in Practice',
    'Multiple locations',
    'Advanced permissions',
    'API access',
    'Calendar sync',
    'Custom report builder',
    'Priority support (4hr SLA)',
  ],
};

export default function PaywallModal({ isOpen, onClose, requiredPlan, featureName, featureDescription, currentPlan }: PaywallModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  
  if (!isOpen) return null;

  const info = planInfo[requiredPlan];
  const Icon = info.icon;
  const price = billing === 'annual' 
    ? Math.round(info.price * 0.75) 
    : info.price;

  const upgradePath: PlanTier[] = requiredPlan === 'practice' 
    ? ['practice', 'pro'] 
    : requiredPlan === 'pro' 
      ? ['pro'] 
      : ['solo', 'practice', 'pro'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="h-7 w-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{featureName}</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            {featureDescription || `This feature requires the ${info.name} plan or higher.`}
          </p>
          {currentPlan && (
            <p className="text-xs text-gray-400 mt-2">
              Your current plan: <span className="font-medium text-gray-600">{planInfo[currentPlan].name}</span>
            </p>
          )}
        </div>

        {/* Plan options */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upgrade to unlock</p>
          <div className="space-y-3">
            {upgradePath.map((tier) => {
              const tierInfo = planInfo[tier];
              const TierIcon = tierInfo.icon;
              const isCurrent = tier === currentPlan;
              const isRecommended = tier === requiredPlan;
              const tierPrice = billing === 'annual' ? Math.round(tierInfo.price * 0.75) : tierInfo.price;

              return (
                <div
                  key={tier}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    isRecommended 
                      ? 'border-blue-300 bg-blue-50/50' 
                      : isCurrent 
                        ? 'border-gray-200 bg-gray-50 opacity-60' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">
                      Recommended
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-gray-400 text-white text-[10px] font-bold rounded-full uppercase">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${tierInfo.bg} rounded-lg flex items-center justify-center`}>
                      <TierIcon className={`h-4.5 w-4.5 ${tierInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{tierInfo.name}</p>
                      <p className="text-xs text-gray-500">{tierPrice === 0 ? 'Free' : `$${tierPrice}/mo`}</p>
                    </div>
                    {!isCurrent && (
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing toggle */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className={`text-xs font-medium ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-11 h-6 rounded-full transition-colors ${billing === 'annual' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billing === 'annual' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-xs font-medium ${billing === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
              Annual <span className="text-emerald-600">-25%</span>
            </span>
          </div>
        </div>

        {/* Features list */}
        <div className="px-6 pb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What you get with {info.name}</p>
          <div className="space-y-2">
            {planFeatures[requiredPlan].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Start 14-Day Free Trial
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> HIPAA compliant</span>
            <span className="flex items-center gap-1"><X className="h-3 w-3" /> Cancel anytime</span>
          </div>
        </div>

        {/* View all plans link */}
        <div className="px-6 pb-6 text-center border-t border-gray-100 pt-4">
          <a href="#/pricing" onClick={onClose} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1">
            View all plans & pricing <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Paywall Gate component - wraps content that should be gated
export function PaywallGate({ 
  children, 
  requiredPlan, 
  featureName, 
  featureDescription,
  currentPlan = 'solo',
}: { 
  children: React.ReactNode; 
  requiredPlan: PlanTier; 
  featureName: string;
  featureDescription?: string;
  currentPlan?: PlanTier;
}) {
  const [showPaywall, setShowPaywall] = useState(false);
  
  const planOrder: PlanTier[] = ['solo', 'practice', 'pro'];
  const hasAccess = planOrder.indexOf(currentPlan) >= planOrder.indexOf(requiredPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <>
      <div 
        onClick={() => setShowPaywall(true)}
        className="cursor-pointer relative group"
      >
        {children}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-center">
            <Lock className="h-6 w-6 text-amber-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-900">Upgrade to {planInfo[requiredPlan].name}</p>
            <p className="text-xs text-gray-500">Click to unlock</p>
          </div>
        </div>
      </div>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        requiredPlan={requiredPlan}
        featureName={featureName}
        featureDescription={featureDescription}
        currentPlan={currentPlan}
      />
    </>
  );
}
