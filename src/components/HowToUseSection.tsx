'use client';

import { useTranslations } from 'next-intl';
import { Upload, Languages, Download, FileText } from 'lucide-react';

export function HowToUseSection() {
  const t = useTranslations('howToUse');

  const steps = [
    {
      key: 'step1',
      icon: Upload,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      number: '1',
    },
    {
      key: 'step2',
      icon: Languages,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      number: '2',
    },
    {
      key: 'step3',
      icon: Download,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600 dark:text-green-400',
      number: '3',
    },
  ] as const;

  return (
    <section className="py-16 bg-background">
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

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-8 h-8 ${step.iconColor}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {t(`${step.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`${step.key}.description`)}
                    </p>
                  </div>

                  {/* Connector Line (hidden on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-8 top-20 w-0.5 h-16 bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Output Formats Info Box */}
          <div className="mt-12 bg-muted/50 rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-3">{t('formats.title')}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('formats.mono')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('formats.bilingual')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('formats.both')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
