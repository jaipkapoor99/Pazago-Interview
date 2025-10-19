import { ReactNode } from "react";
import Link from "next/link";
import { getServerAuthSession } from "@/auth";
import AuthControls from "./components/auth-controls";
import "./globals.css";

export const metadata = {
  title: "Provue Research Hub",
  description: "Interview-ready demo showcasing Fastify + Express + PostgreSQL"
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-top">
            <div>
              <h1>Provue Research Hub</h1>
              <p>Your interview-ready demo for Pazago</p>
            </div>
            <AuthControls
              isAuthenticated={Boolean(session)}
              userName={session?.user?.name}
            />
          </div>
          <nav className="header-nav">
            <Link href="/">Dashboard</Link>
            <Link href="/intel">Classified Intel</Link>
          </nav>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
