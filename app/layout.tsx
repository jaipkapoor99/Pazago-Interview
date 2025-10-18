import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Provue Research Hub",
  description: "Interview-ready demo showcasing Fastify + Express + PostgreSQL"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Provue Research Hub</h1>
          <p>Your interview-ready demo for Pazago</p>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
