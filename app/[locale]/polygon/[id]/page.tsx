import PolygonProgram from "@/components/PolygonPage/Problem/Polygon";
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
    <PolygonProgram id={params.id} lang={lang}/>
  )
}