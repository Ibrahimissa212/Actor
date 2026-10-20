import { hydrateRoot } from "react-dom/client";
import { ContentProvider, type SiteContent } from "../lib/content";
import { LanguageProvider } from "../lib/i18n";
import { Portfolio } from "../components/Portfolio";
const content = JSON.parse(
  document.getElementById("portfolio-content")!.textContent!,
) as SiteContent;
hydrateRoot(
  document.getElementById("portfolio-root")!,
  <ContentProvider content={content}>
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  </ContentProvider>,
);
