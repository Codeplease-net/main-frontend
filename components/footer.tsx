import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Facebook, Youtube } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-background pt-8 pb-6 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">{t("Platform")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("About")}
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/contests"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Contests")}
                </Link>
              </li> */}
              <li>
                <Link
                  href="/problems"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Problems")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t("Resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Announcement")}
                </Link>
              </li>
              <li>
                <Link
                  href="/developer-team"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Our Developer Team")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t("Legality")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legality/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Terms and Conditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legality/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Privacy Policy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t("Connection")}</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/codepleaseofficial/"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://discord.gg/Nygcq77rKn"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <DiscordLogoIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.youtube.com/@codepleasenet"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center flex justify-center">
          <p>Copyright &copy; 2024 CodePlease</p> <p className="mx-2">|</p>{" "}
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
