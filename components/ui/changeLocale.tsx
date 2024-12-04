import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./changeLocaleSwitcher";
import listCountry from '../../content/listlang.json'

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {listCountry[cur]}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
