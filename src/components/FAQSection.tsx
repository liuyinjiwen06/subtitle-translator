'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAQSection() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {questions.map((questionKey, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={questionKey}
                  className="bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-lg pr-4">
                      {t(`${questionKey}.question`)}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                        isOpen && 'transform rotate-180'
                      )}
                    />
                  </button>

                  {/* Answer */}
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200',
                      isOpen ? 'max-h-96' : 'max-h-0'
                    )}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {t(`${questionKey}.answer`)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Help CTA */}
          <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-muted-foreground">
              Still have questions?{' '}
              <a
                href="#"
                className="text-primary font-medium hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
