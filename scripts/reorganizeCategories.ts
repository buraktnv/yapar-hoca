import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reorganizeCategories() {
  console.log('🔄 Reorganizing categories...\n')

  try {
    // Find the main "Matematik" category
    const matematikCategory = await prisma.category.findUnique({
      where: { slug: 'matematik' },
      include: { children: true }
    })

    if (!matematikCategory) {
      console.log('⚠️  No "Matematik" category found. Categories may already be reorganized.')
      return
    }

    console.log('📚 Found Matematik category with', matematikCategory.children.length, 'children')

    // Get all grade-level categories (9. Sınıf, 10. Sınıf, etc.)
    const gradeCategories = await prisma.category.findMany({
      where: {
        parentId: matematikCategory.id
      }
    })

    console.log(`\n🎓 Found ${gradeCategories.length} grade-level categories\n`)

    // Move each grade to top level (set parentId to null) and set order
    for (let i = 0; i < gradeCategories.length; i++) {
      const grade = gradeCategories[i]
      await prisma.category.update({
        where: { id: grade.id },
        data: {
          parentId: null,
          order: i + 1 // 9. Sınıf = 1, 10. Sınıf = 2, etc.
        }
      })
      console.log(`  ✅ Moved "${grade.name}" to top level (order: ${i + 1})`)
    }

    // Delete the "Matematik" category since it's now empty
    await prisma.category.delete({
      where: { id: matematikCategory.id }
    })
    console.log('\n🗑️  Deleted "Matematik" parent category')

    console.log('\n✨ Reorganization completed successfully!\n')

    // Print summary
    const topLevelCategories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' }
    })

    console.log('📊 Top-level categories:')
    topLevelCategories.forEach((cat) => {
      console.log(`  - ${cat.name} (order: ${cat.order})`)
    })

  } catch (error) {
    console.error('❌ Error reorganizing categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

reorganizeCategories()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
