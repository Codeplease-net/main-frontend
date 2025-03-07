import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Facebook, Youtube, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");
    return (
        <footer className="bg-background py-12 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">CodePlease</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">{t("Description")}</p>
                        <div className="flex items-center space-x-6">
                            <Link
                                href="https://www.facebook.com/codepleaseofficial/"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                            >
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <title>Facebook</title>
                                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                                </svg>
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://discord.gg/Nygcq77rKn"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                            >
                                <DiscordLogoIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://www.youtube.com/@codepleasenet"
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                            >
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link
                                href="mailto:contact@codeplease.net"
                                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                            >
                                <Mail className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("Platform")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("About")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/problems"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("Problems")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("Topics")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("Resources & Legal")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/developer-team"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("Our Developer Team")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/legality/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("Terms and Conditions")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/legality/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200"
                >
                  {t("Privacy Policy")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div> */}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} CodePlease. {t("All Rights Reserved")}.
                        </p>
                        <p className="text-sm text-muted-foreground">{t("Outline")}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
