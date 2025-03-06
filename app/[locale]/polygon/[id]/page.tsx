import ProblemDetail from "@/components/PolygonPage/Problem";

interface PageProps {
    params: { id: string };
    searchParams: { lang?: string };
}  

export default async function PolygonPage({
  params,
  searchParams
}: PageProps){
    const lang = (searchParams.lang || 'en');

  return (
    <>
      <head>
        <title>{`${params.id}`}</title>
      </head>
      <ProblemDetail id={params.id} lang={lang}/>
    </>
  )
}