import { BrowserRouter, Route, Routes } from "react-router";
import { I18nProvider } from "./hooks/useSiteI18n";
import { CopyProvider, useCopy } from "./hooks/useCopy";
import { AppNav } from "./components/layout/AppNav";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { FlagsPage } from "./pages/FlagsPage";
import { FlagDetailPage } from "./pages/FlagDetailPage";
import { DocsPage } from "./pages/DocsPage";
import { IssuesPage } from "./pages/IssuesPage";
import { ChangelogPage } from "./pages/ChangelogPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function Toast() {
  const { toast } = useCopy();
  if (!toast) return null;
  return (
    <div className="global-toast squircle" role="status" aria-live="polite">
      <i className="fa-solid fa-circle-check" aria-hidden="true" />
      <span>{toast}</span>
    </div>
  );
}

export function App() {
  return (
    <I18nProvider>
      <CopyProvider>
        <BrowserRouter>
          <div className="app-shell">
            <AppNav />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/flags" element={<FlagsPage />} />
                <Route path="/flag/:cc" element={<FlagDetailPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/changelog" element={<ChangelogPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <SiteFooter />
            <Toast />
          </div>
        </BrowserRouter>
      </CopyProvider>
    </I18nProvider>
  );
}
