import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser, isAdmin } from '@/lib/auth/helpers'

// GET - Fetch site settings (public)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' }
    })

    // Create default settings if not exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default'
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      faviconUrl,
      favicon16Url,
      favicon32Url,
      favicon180Url,
      favicon192Url,
      favicon512Url,
      logoUrl,
      siteName,
      brandingType,
      brandingLogoUrl,
      brandingIconUrl
    } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        faviconUrl: faviconUrl || null,
        favicon16Url: favicon16Url || null,
        favicon32Url: favicon32Url || null,
        favicon180Url: favicon180Url || null,
        favicon192Url: favicon192Url || null,
        favicon512Url: favicon512Url || null,
        logoUrl: logoUrl || null,
        siteName: siteName || 'YaparHoca',
        brandingType: brandingType || 'text',
        brandingLogoUrl: brandingLogoUrl || null,
        brandingIconUrl: brandingIconUrl || null
      },
      create: {
        id: 'default',
        faviconUrl: faviconUrl || null,
        favicon16Url: favicon16Url || null,
        favicon32Url: favicon32Url || null,
        favicon180Url: favicon180Url || null,
        favicon192Url: favicon192Url || null,
        favicon512Url: favicon512Url || null,
        logoUrl: logoUrl || null,
        siteName: siteName || 'YaparHoca',
        brandingType: brandingType || 'text',
        brandingLogoUrl: brandingLogoUrl || null,
        brandingIconUrl: brandingIconUrl || null
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
