import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanCategories() {
  console.log('🧹 Cleaning all categories...\n')

  try {
    // Delete all categories (this will cascade due to relationships)
    const deleted = await prisma.category.deleteMany({})

    console.log(`✅ Deleted ${deleted.count} categories\n`)
    console.log('Database is now clean and ready for seeding!\n')
  } catch (error) {
    console.error('❌ Error cleaning categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanCategories()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
