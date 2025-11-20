import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { logo } from "@/const";
import { VideoFormProvider } from "@/context/video-form";

const jarkartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DictateTube - Dictation Practice",
  description: "Practice dictation with YouTube videos",
  icons: {
    icon: logo,
  },
};

export default function DictationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jarkartaSans.variable} antialiased bg-bg-primary`}>
        <VideoFormProvider>{children}</VideoFormProvider>
      </body>
    </html>
  );
}