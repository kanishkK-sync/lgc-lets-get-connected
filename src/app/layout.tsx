import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-context";

export const metadata: Metadata = {
  title: "LGC – Let’s Get Connected | ECE Projects & Innovation",
  description:
    "LGC (Let’s Get Connected) is an ECE-focused platform to showcase projects, hackathons, research, and connect with innovators and engineers.",
  keywords: [
    "LGC",
    "Let's Get Connected",
    "ECE projects",
    "Engineering student projects",
    "Electronics projects",
    "ECE hackathons",
  ],
  authors: [{ name: "LGC Team" }],
  creator: "LGC",
  openGraph: {
    title: "LGC – Let’s Get Connected",
    description:
      "ECE-focused platform to showcase projects, hackathons, research, and connect with innovators.",
    siteName: "LGC",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
      <meta name="google-site-verification" 
            content="cWLG1ArNa1S2jhnT60krICMMxMUWlZlGR5DMmtgw3Io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
