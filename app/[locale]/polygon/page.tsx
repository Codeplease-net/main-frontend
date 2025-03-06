import Footer from "@/components/footer";
import Header from "@/components/header";
import ProblemList from "@/components/PolygonPage/ProblemList";

interface SearchParams {
  [key: string]: string | undefined
}

export default function Polygon({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <header>
        <title>Polygon</title>
      </header>
      <Header/>
      <ProblemList searchParams={searchParams}/>
      <Footer />
    </>
  );
}