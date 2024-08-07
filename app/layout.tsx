import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap`}
        />
        <link rel="icon" href="/favicon.ico" />
        <title>Pantry "R" Us</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
