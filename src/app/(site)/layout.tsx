import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/(site)/globals.css";
import SiteLayoutClient from './SiteLayoutClient';
import { getCategoryTree } from '@/lib/categoryHelpers';
import { getUser } from '@/lib/auth/helpers';
import prisma from '@/lib/prisma';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YaparHoca | Eğitim Blogu",
  description: "Matematik ve eğitim konularında blog yazıları",
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch category tree for sidebar
  const categoryTree = await getCategoryTree();

  // Get current user and their role
  const authUser = await getUser();
  let user = null;

  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    user = dbUser;
  }

  return (
    <html lang="tr">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteLayoutClient categories={categoryTree} user={user}>
          {children}
        </SiteLayoutClient>
      </body>
    </html>
  );
}
