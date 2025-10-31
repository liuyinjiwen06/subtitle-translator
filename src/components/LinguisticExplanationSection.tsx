'use client';

import { useTranslations } from 'next-intl';

export function LinguisticExplanationSection() {
  const t = useTranslations('englishSubtitle.linguisticExplanation');

  const challenges = [
    { key: 'wordOrder', icon: '🔄' },
    { key: 'idioms', icon: '💭' },
    { key: 'formality', icon: '👔' },
    { key: 'tense', icon: '⏰' },
    { key: 'timing', icon: '⚡' },
    { key: 'contextual', icon: '🧩' }
  ];

  const advantages = [
    { key: 'contextAware', icon: '🧠' },
    { key: 'culturalAdaptation', icon: '🌍' },
    { key: 'naturalFlow', icon: '✨' },
    { key: 'technicalAccuracy', icon: '🎯' },
    { key: 'timing', icon: '⏱️' },
    { key: 'quality', icon: '⭐' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {t('intro')}
          </p>
        </div>

        {/* Challenges Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t('challenges.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.key}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">
                    {challenge.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-900">
                      {t(`challenges.${challenge.key}.title`)}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {t(`challenges.${challenge.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 border border-green-100">
          <h3 className="text-3xl font-bold mb-4 text-center text-gray-900">
            {t('advantages.title')}
          </h3>
          <p className="text-center text-xl text-gray-600 mb-10">
            {t('advantages.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage) => (
              <div
                key={advantage.key}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">
                  {advantage.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900">
                  {t(`advantages.${advantage.key}.title`)}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t(`advantages.${advantage.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
