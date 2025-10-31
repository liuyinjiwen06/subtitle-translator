'use client';

import { useTranslations } from 'next-intl';

export function UseCasesSection() {
  const t = useTranslations('englishSubtitle.useCases');

  const useCases = [
    {
      key: 'contentCreators',
      icon: '🎥',
      color: 'from-red-500 to-orange-500'
    },
    {
      key: 'educators',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'businesses',
      icon: '💼',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'filmmakers',
      icon: '🎬',
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'researchers',
      icon: '🔬',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      key: 'entertainment',
      icon: '🎭',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.key}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center text-3xl mb-4`}>
                {useCase.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {t(`${useCase.key}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`${useCase.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
