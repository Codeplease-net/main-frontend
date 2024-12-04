import { Timeline } from "@/components/ui/timeline"
import { Code, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"


function data(t: any) { return [
    {
      title: t('Object1.Title'),
      content: (
        <>
          {/* Features Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">{t('Object1.FeatureText')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2" />
                      {t('Object1.TextObject1')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t('Object1.TextDescription1')}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2" /> 
                      {t('Object1.TextObject2')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t('Object1.TextDescription2')}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2" /> 
                      {t('Object1.TextObject3')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t('Object1.TextDescription3')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      title: t('Object2.Title'),
      content: (
        <>
        {/* Contests and Problems Grid */}
        <section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('Object2.FeatureText')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={`problem-${i}`} className="bg-card">
                  <CardHeader>
                    <CardTitle>{t(`Object2.ProblemTitle${i}`)} </CardTitle>
                    <CardDescription>{t(`Object2.TextObject${i}`)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{t(`Object2.TextDescription${i}`)}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/problems/playground/${i}`}>
                      <Button variant="outline">{t(`Object2.SolveText`)}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        </>
      ),
    },
    {
      title: t('Object3.Title'),
      content: (
        <>
        {/* Contests and Problems Grid */}
        <section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('Object3.FeatureText')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={`contest-${i}`} className="bg-card">
                  <CardHeader>
                    <CardTitle>Weekly Contest 1</CardTitle>
                    <CardDescription>{t(`Object3.DateDescription${i}`)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{t(`Object3.TextDescription${i}`)}</p>
                    <p>{t(`Object3.AuthorDescription${i}`)}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/contests/${i}`}>
                      <Button variant="outline">{t(`Object3.DetailText`)}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        </>
      ),
    },
    {
      title: t('Object4.Title'),
      content: (
        <>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{t('Object4.FeatureText')}</h1>
              <p className="text-xl mb-6 text-muted-foreground">{t('Object4.DescriptionText')}</p>
              <Link href="/problems">
                <Button size="lg" className="mr-4">{t('Object4.CodingText')}</Button>
              </Link>
            </div>
            <img src="cat.svg" alt="cat" className="sepia hover:sepia-0 duration-300"/>
          </div>
        </section>
        </>
      ),
    }
  ]
}

export default function TimeScroll() {
  const t = useTranslations('Home.Timeline')
  return (
    <Timeline data={data(t)} />
)}