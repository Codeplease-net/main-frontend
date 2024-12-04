import { useTranslations } from 'next-intl';

export default function TermsAndConditions() {
  const t = useTranslations('Legality.TermsAndConditions');
  return (
    <div className='mb-8'>
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-4xl text-center font-bold">{t('title')}</div>
      </div>
      <div className="px-20 mt-5 space-y-5">
        <div className="text-xl font-semibold flex">
          <div className="mr-2">A.</div>
          <div>{t('Acceptance of Terms')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.1')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">B.</div>
          <div>{t('Description of Services')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.2')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">C.</div>
          <div>{t('User Accounts')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.3')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">D.</div>
          <div>{t('User Conduct')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.4')}</div>
          <li className="ml-12">{t('StaticText.5')}</li>
          <li className="ml-12">{t('StaticText.6')}</li>
          <li className="ml-12">{t('StaticText.7')}</li>
          <li className="ml-12">{t('StaticText.8')}</li>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">E.</div>
          <div>{t('Intellectual Property')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.9')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">F.</div>
          <div>{t('Limitation of Liability')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.10')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">G.</div>
          <div>{t('Indemnification')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.11')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">H.</div>
          <div>{t('Governing Law')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.12')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">I.</div>
          <div>{t('Changes to Terms and Conditions')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.13')}</div>
        </ul>
      </div>
    </div>
  );
}
