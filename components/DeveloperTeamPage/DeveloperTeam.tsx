import unknown_user from "../../public/unknown-user.jpg";
import Image from "next/image";
import { Github, Linkedin, Globe } from "lucide-react";
import { topics_list } from "./data";
import { useTranslations } from "next-intl";
import { Card, CardTitle } from "../ui/card";
import { Link } from "@/i18n/routing";

export default function DeveloperTeam() {
  const t = useTranslations("DeveloperTeam");
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-4xl text-center font-bold">{t("title")}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-10 mt-10">
        {topics_list(t).map((topic) => (
          <Card className="hover:bg-muted transition-colors flex w-full">
            <Image
              className="rounded-l-xl aspect-square box-border"
              width={175}
              height={175}
              src={topic.image ? topic.image : unknown_user}
              alt="Picture of author"
            />
            <div className="px-6 py-4">
              <CardTitle className="text-xl">{topic.name}</CardTitle>
              <div className="text-l text-gray-400 mt-1.5">
                {topic.university}
              </div>
              <div className="flex mt-1.5">
                <CardTitle className="text-xl mr-1 mt-0.5">
                  {t("Role")}
                </CardTitle>
                {topic.roles?.map((role) => (
                  <div
                    className={`mx-1 text-l rounded py-1 px-2 ${
                      role == "Backend"
                        ? "bg-green-600"
                        : role == "Judge-server"
                        ? "bg-red-600"
                        : "bg-blue-700"
                    }`}
                  >
                    {role}
                  </div>
                ))}
              </div>
              <div className="flex mt-3 space-x-3">
                {topic.githubLink ? (
                  <Link target="_blank" href={topic.githubLink}>
                    <Github />
                  </Link>
                ) : null}
                {topic.linkedinLink ? (
                  <Link target="_blank" href={topic.linkedinLink}>
                    <Linkedin />
                  </Link>
                ) : null}
                {topic.websiteLink ? (
                  <Link target="_blank" href={topic.websiteLink}>
                    <Globe />
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
