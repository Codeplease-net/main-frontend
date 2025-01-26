import PlayGroundComponent from '@/components/PlaygroundPage/PlayGroundPage'

export default async function PlayGroundPage({
  params,
}: {
  params: { id: string };  
}){
  return (
    <PlayGroundComponent id={params.id} />
  )
}