import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Swapr",
  description: "Multi currency fx wallet",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
