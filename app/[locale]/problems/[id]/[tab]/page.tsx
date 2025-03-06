import PlayGroundComponent from '@/components/ProblemsPage/PlayGroundPage';

interface PlaygroundPageProps {
  params: { id: string, tab: string };
  searchParams: { [key: string]: string | undefined };
}

export default async function PlayGroundPage({
  params,
  searchParams
}: PlaygroundPageProps){
  return (
    <PlayGroundComponent id={params.id} tab={params.tab} searchParams={searchParams} />
  )
}