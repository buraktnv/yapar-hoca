# Category Ordering Guide

## Overview

Categories now support custom ordering through an `order` field. This allows you to control the display order of categories in the sidebar navigation.

## Current Structure

The category hierarchy is now:

```
9. Sınıf (order: 1)
├── Sayılar ve Cebir (9. Sınıf)
├── Nicelikler ve Değişimler (9. Sınıf)
└── ...

10. Sınıf (order: 2)
├── Sayılar ve Cebir (10. Sınıf)
├── Nicelikler ve Değişimler (10. Sınıf)
└── ...

11. Sınıf (order: 3)
12. Sınıf (order: 4)
```

**Note**: The "Matematik" parent category has been removed. Grade levels (9. Sınıf, 10. Sınıf, etc.) are now top-level categories.

## How to Change Category Order

### Method 1: Using Prisma Studio (GUI)

1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the `Category` table

3. Find the category you want to reorder

4. Edit the `order` field with a new number
   - Lower numbers appear first
   - Same numbers are sorted alphabetically by name

5. Save the changes

### Method 2: Using a Script

Create a script in `scripts/` folder:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reorderCategories() {
  // Example: Swap order of 9. Sınıf and 10. Sınıf
  await prisma.category.update({
    where: { slug: '9-sinif' },
    data: { order: 2 }
  })

  await prisma.category.update({
    where: { slug: '10-sinif' },
    data: { order: 1 }
  })

  console.log('✅ Categories reordered!')
  await prisma.$disconnect()
}

reorderCategories()
```

### Method 3: Direct Database Query

Using Prisma CLI:

```bash
npx prisma db execute --stdin
```

Then paste SQL:

```sql
-- Example: Move "11. Sınıf" to position 1
UPDATE "Category" SET "order" = 1 WHERE slug = '11-sinif';
UPDATE "Category" SET "order" = 2 WHERE slug = '9-sinif';
UPDATE "Category" SET "order" = 3 WHERE slug = '10-sinif';
UPDATE "Category" SET "order" = 4 WHERE slug = '12-sinif';
```

## Reordering Subcategories

Subcategories (subjects, topics) also have an `order` field. You can reorder them the same way:

```typescript
// Example: Reorder subjects within "9. Sınıf"
const gradeCategory = await prisma.category.findUnique({
  where: { slug: '9-sinif' },
  include: { children: true }
})

// Update order for each subject
await prisma.category.update({
  where: { slug: '9-sinif-sayilar-ve-cebir' },
  data: { order: 1 }
})

await prisma.category.update({
  where: { slug: '9-sinif-geometrik-sekiller' },
  data: { order: 2 }
})
// ... etc
```

## Important Notes

1. **Order field is required**: All categories must have an `order` value (defaults to 0)

2. **Sorting logic**: Categories are sorted by:
   - `order` field (ascending)
   - Then by `name` (ascending) if orders are equal

3. **Child categories**: Each level of hierarchy maintains its own ordering
   - Top-level categories (9. Sınıf, 10. Sınıf, etc.)
   - Subjects within each grade
   - Topics within each subject

4. **Automatic ordering in seed script**: The seed script automatically sets orders:
   - Grades: 1, 2, 3, 4 (9th, 10th, 11th, 12th)
   - Subjects/Topics: 0 (sorted alphabetically)

## Scripts Available

- `npm run seed:categories` - Seeds all categories with default ordering
- `npm run clean:categories` - Removes all categories
- `npm run reorganize:categories` - Removes "Matematik" parent and makes grades top-level

## Example: Custom Order Script

Create `scripts/customOrder.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setCustomOrder() {
  // Define your custom order
  const customOrder = {
    '12-sinif': 1,  // Show 12th grade first
    '11-sinif': 2,
    '10-sinif': 3,
    '9-sinif': 4
  }

  for (const [slug, order] of Object.entries(customOrder)) {
    await prisma.category.update({
      where: { slug },
      data: { order }
    })
    console.log(`✅ Set ${slug} to order ${order}`)
  }

  console.log('\n✨ Custom ordering applied!')
  await prisma.$disconnect()
}

setCustomOrder()
```

Run it:
```bash
npx tsx scripts/customOrder.ts
```

## Troubleshooting

**Q: Categories not showing in the right order?**

A: Make sure you've regenerated the Prisma client after schema changes:
```bash
npx prisma generate
```

**Q: Want to reset to default order?**

A: Run the reorganize script:
```bash
npm run reorganize:categories
```

This will set grades to order 1, 2, 3, 4.
