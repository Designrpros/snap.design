import { HashRouter, Routes, Route, Link as RouterLink, useLocation } from "react-router-dom";
import { getDesignById } from "@snap/shared";
import { getReports } from "./lib/reports-store";
import "@snap/shared/styles";
import Gallery from "./pages/Gallery";
import ReportDetail from "./pages/ReportDetail";

function Navbar() {
  const location = useLocation();

  let breadcrumb: React.ReactNode = (
    <span className="flex items-center gap-2">
      <span className="font-medium">Snaps</span>
    </span>
  );

  if (location.pathname !== "/") {
    const segments = location.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];
    const design = id ? (getReports().find((r) => r.id === id) ?? getDesignById(id)) : null;

    breadcrumb = (
      <span className="flex items-center gap-2">
        <RouterLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-medium text-obsidian">Snaps</span>
        </RouterLink>
        <span className="text-slate mx-1">/</span>
        <span className="text-obsidian font-medium">
          {design?.title ?? "Not found"}
        </span>
      </span>
    );
  }

  return (
    <header className="border-b border-chalk bg-eggshell sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center">
        <nav className="font-af text-[14px] text-obsidian flex items-center">
          {breadcrumb}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-eggshell font-af text-obsidian antialiased">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/report/:id" element={<ReportDetail />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
