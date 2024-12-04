import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('Legality.PrivacyPolicy');
  return (
    <div className='mb-8'>
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-4xl text-center font-bold">{t('title')}</div>
      </div>
      <div className="px-20 mt-5 space-y-5">
        <div className="text-xl font-semibold flex">
          <div className="mr-2">A.</div>
          <div>{t('Privacy Policy of CodePlease')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.1')}</div>
          <div className="ml-7">{t('StaticText.2')}</div>
          <div className="ml-7">{t('StaticText.3')}</div>
          <div className="ml-7">{t('StaticText.4')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">B.</div>
          <div>{t('Information Collection and Use')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.5')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">C.</div>
          <div>{t('Log Data')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.6')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">D.</div>
          <div>{t('Cookies')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.7')}</div>
          <div className="ml-7">{t('StaticText.8')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">E.</div>
          <div>{t('Service Providers')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.9')}</div>
          <li className="ml-12">{t('StaticText.10')}</li>
          <li className="ml-12">{t('StaticText.11')}</li>
          <li className="ml-12">{t('StaticText.12')}</li>
          <li className="ml-12">{t('StaticText.13')}</li>
          <div className="ml-7">{t('StaticText.14')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">F.</div>
          <div>{t('Security')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.15')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">G.</div>
          <div>{t('Links to Other Sites')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.16')}</div>
          <div className="ml-7">{t('StaticText.17')}</div>
          <div className="ml-7">{t('StaticText.18')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">H.</div>
          <div>{t('Changes to This Privacy Policy')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.19')}</div>
        </ul>
        <div className="text-xl font-semibold flex">
          <div className="mr-2">I.</div>
          <div>{t('Contact Us')}:</div>
        </div>
        <ul className="list-disc space-y-2 mt-2">
          <div className="ml-7">{t('StaticText.20')}</div>
        </ul>
      </div>
    </div>
  );
}
