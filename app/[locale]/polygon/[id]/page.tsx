import ProblemDetail from "@/components/PolygonPage/Problem";
import { LanguageCode } from "@/components/PolygonPage/types/language";

interface PageProps {
    params: { id: string };
    searchParams: { lang?: string };
}  

export default async function PolygonPage({
  params,
  searchParams
}: PageProps){
    const lang = (searchParams.lang || 'en') as LanguageCode;

  return (
    <>
      <head>
        <title>{`${params.id}`}</title>
      </head>
      <ProblemDetail id={params.id} lang={lang}/>
    </>
  )
}