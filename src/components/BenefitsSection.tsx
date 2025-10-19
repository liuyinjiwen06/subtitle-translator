'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Zap, Globe, Languages, DollarSign, Shield } from 'lucide-react';

const iconMap = {
  aiPowered: Sparkles,
  instantTranslation: Zap,
  multiLanguage: Globe,
  bilingualOutput: Languages,
  freeToUse: DollarSign,
  privacyFirst: Shield,
};

export function BenefitsSection() {
  const t = useTranslations('benefits');

  const benefits = [
    'aiPowered',
    'instantTranslation',
    'multiLanguage',
    'bilingualOutput',
    'freeToUse',
    'privacyFirst',
  ] as const;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit];
            return (
              <div
                key={benefit}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {t(`${benefit}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(`${benefit}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
