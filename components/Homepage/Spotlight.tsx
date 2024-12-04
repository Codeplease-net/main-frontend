import React from "react";
import { Spotlight } from "../ui/spotlight";
import { useTranslations } from "next-intl";

export default function SpotlightPreview() {
  const t = useTranslations('Home.Spotlight')
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text">
          CodePlease <br/> {t('Slogan')}
        </h1>
        <p className="mt-4 font-normal text-base text-center mx-auto">
          {t('Description')}
        </p>
      </div>
    </div>
  );
}
