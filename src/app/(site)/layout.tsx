import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/(site)/globals.css";
import SiteLayoutClient from './SiteLayoutClient';
import { getCategoryTree } from '@/lib/categoryHelpers';
import { getUser } from '@/lib/auth/helpers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata with favicon from database
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' }
  })

  // Build icons array with multiple sizes
  const icons: Metadata['icons'] = {}
  const iconArray: { url: string; sizes?: string; type?: string }[] = []

  // Add specific size favicons if available
  if (settings?.favicon16Url) {
    iconArray.push({ url: settings.favicon16Url, sizes: '16x16', type: 'image/png' })
  }
  if (settings?.favicon32Url) {
    iconArray.push({ url: settings.favicon32Url, sizes: '32x32', type: 'image/png' })
  }
  if (settings?.favicon192Url) {
    iconArray.push({ url: settings.favicon192Url, sizes: '192x192', type: 'image/png' })
  }
  if (settings?.favicon512Url) {
    iconArray.push({ url: settings.favicon512Url, sizes: '512x512', type: 'image/png' })
  }

  // Add main favicon as fallback
  if (settings?.faviconUrl) {
    iconArray.push({ url: settings.faviconUrl })
  }

  if (iconArray.length > 0) {
    icons.icon = iconArray
  }

  // Add Apple touch icon
  if (settings?.favicon180Url) {
    icons.apple = { url: settings.favicon180Url, sizes: '180x180' }
  } else if (settings?.faviconUrl) {
    icons.apple = { url: settings.faviconUrl }
  }

  return {
    title: 'YaparHoca | Eğitim Blogu',
    description: "Matematik ve eğitim konularında blog yazıları",
    icons: iconArray.length > 0 || settings?.favicon180Url ? icons : undefined
  }
}

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

  // Fetch branding settings
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
    select: {
      siteName: true,
      brandingType: true,
      brandingLogoUrl: true,
      brandingIconUrl: true,
    },
  });

  const branding = {
    siteName: settings?.siteName || 'YaparHoca',
    brandingType: (settings?.brandingType || 'text') as 'text' | 'logo' | 'icon_text',
    brandingLogoUrl: settings?.brandingLogoUrl || null,
    brandingIconUrl: settings?.brandingIconUrl || null,
  };

  return (
    <html lang="tr">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteLayoutClient categories={categoryTree} user={user} branding={branding}>
          {children}
        </SiteLayoutClient>
      </body>
    </html>
  );
}
