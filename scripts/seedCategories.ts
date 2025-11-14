import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const matematikKonulari = {
  "9": {
    "Sayılar_ve_Cebir": [
      "Gerçek Sayılar (ondalık, üslü, köklü gösterimler)",
      "Aralıklarla İşlemler",
      "Sayı Kümeleri (doğal, tam, rasyonel, gerçek)",
      "Cebirsel Özdeşlikler (iki kare farkı, tam kare vb.)"
    ],
    "Nicelikler_ve_Değişimler": [
      "Doğrusal Denklemler",
      "Doğrusal Fonksiyonlar",
      "Mutlak Değer Fonksiyonu",
      "Doğrusal Denklem ve Eşitsizlikler"
    ],
    "Algoritma_ve_Bilişim": [
      "Algoritma Temelli Problemler",
      "Mantık Bağlaçları ve Niceleyiciler"
    ],
    "Geometrik_Şekiller": [
      "Üçgenler (açı ve kenar ilişkileri)"
    ],
    "Eşlik_ve_Benzerlik": [
      "Geometrik Dönüşümler (yansıma, öteleme, dönme)",
      "Üçgenlerde Eşlik ve Benzerlik (koşullar)"
    ],
    "Geometrik_Cisimler": [
      "Prizmalar, Piramitler, Silindir, Koni, Küre (yüzey alanı ve hacim)"
    ],
    "İstatistiksel_Araştırma_Süreci": [
      "Tek Değişkenli Veri Dağılımları (veri toplama, düzenleme, grafikler)",
      "Olasılık: Deneysel ve Teorik Olasılık, olasılık ilişkisi"
    ]
  },

  "10": {
    "Sayılar_ve_Cebir": [
      "Asal Çarpanlar ve Bölenler",
      "EBOB ve EKOK",
      "Bölünebilme Kuralları"
    ],
    "Nicelikler_ve_Değişimler": [
      "Fonksiyon Kavramı",
      "Fonksiyonların Nitel Özellikleri (artan/azalan, bire-bir, örten)",
      "Karesel, Karekök ve Rasyonel Fonksiyonlar",
      "Ters Fonksiyon",
      "Fonksiyonlarla İfade Edilen Denklem ve Eşitsizlikler"
    ],
    "Algoritma_ve_Bilişim": [
      "Algoritma Temelli Problemler",
      "Mantık Bağlaçları ve Niceleyicileri"
    ],
    "Geometri": [
      "Dörtgenler ve Çokgenler (özellikler, özel dörtgenler)",
      "Uzay Geometrisi: Katı cisimler (yüzey, hacim)"
    ],
    "İstatistiksel_Araştırma_Süreci": [
      "İki Kategorik Değişkenli Veriler (toplama, tablo, grafik, ilişkilik)",
      "Veriden Olasılığa: Koşullu Olasılık, Bayes Teoremi"
    ]
  },

  "11": {
    "Geometri": {
      "Trigonometri": [
        "Yönlü Açılar (derece, radyan vb.)",
        "Trigonometrik Fonksiyonlar (birim çember, periyot, grafikler)",
        "Sinüs ve Kosinüs Teoremleri",
        "Ters trigonometrik fonksiyonlar"
      ],
      "Analitik_Geometri": [
        "Doğrunun analitik incelenmesi (uzaklık, eğim, paralellik/diklik)",
        "Bir noktanın bir doğruya uzaklığı, parçayı belli oranda bölme"
      ],
      "Çember_ve_Daire": [
        "Çemberin temel elemanları (merkez, yarıçap, kiriş, teğet)",
        "Çemberde Açılar (merkez, çevre, teğet-kiriş açıları)",
        "Dairenin çevresi, alanı, yay uzunluğu"
      ],
      "Uzay_Geometrisi": [
        "Katı Cisimler (silindir, koni, küre vb.)"
      ]
    },
    "Sayılar_ve_Cebir": [
      "Fonksiyonlarda Uygulamalar (ortalama değişim hızı, grafik/tablo temsili)",
      "İkinci Dereceden Fonksiyonlar ve Grafikleri (tepe, parabol, simetri ekseni)",
      "Fonksiyonların Dönüşümleri (öteleme, simetri vb.)"
    ],
    "Denklem_ve_Eşitsizlik_Sistemleri": [
      "İkinci Dereceden İki Bilinmeyenli Denklem Sistemleri",
      "İkinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Sistemleri"
    ],
    "Veri_Sayma_ve_Olasılık": [
      "Koşullu Olasılık, bağımlı/bağımsız olaylar, bileşik olaylar",
      "Deneysel ve Teorik Olasılık ilişkisi"
    ]
  },

  "12": {
    "Sayılar_ve_Cebir": {
      "Üstel_ve_Logaritmik_Fonksiyonlar": [
        "Üstel Fonksiyonlar (özellikler, grafikler)",
        "Logaritma Fonksiyonları (10 ve e tabanında, özellikleri)",
        "Üstel/Logaritmik Denklemler ve Eşitsizlikler (uygulamalar)"
      ],
      "Diziler": [
        "Gerçek Sayı Dizileri: aritmetik, geometrik, Fibonacci, genel terim, kısmi toplam"
      ]
    },
    "Geometri": {
      "Trigonometri": [
        "Toplam-fark ve iki kat açı formülleri",
        "Trigonometrik Denklemler"
      ],
      "Dönüşümler": [
        "Analitik düzlemde temel dönüşümler (öteleme, dönme, simetri ve bileşkeleri)"
      ],
      "Analitik_Geometri": [
        "Çemberin analitik incelenmesi (genel/standart denklem, doğru ile çemberin durumları)"
      ]
    },
    "Analiz": {
      "Türev": [
        "Limit ve Süreklilik",
        "Anlık değişim oranı ve türev (türev alma kuralları)",
        "Türevin uygulamaları (artan/azalan, ekstremum, grafik analizi)"
      ],
      "İntegral": [
        "Belirsiz İntegral ve integral alma teknikleri",
        "Belirli İntegral, Riemann toplamı ve uygulamaları (alan hesabı)"
      ]
    }
  }
}

// Helper function to create slug from name
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function seedCategories() {
  console.log('🌱 Starting category seeding...\n')

  try {
    // Process each grade level (no parent "Matematik" category)
    const gradeNumbers = Object.keys(matematikKonulari) as Array<keyof typeof matematikKonulari>

    for (let i = 0; i < gradeNumbers.length; i++) {
      const grade = gradeNumbers[i]
      const subjects = matematikKonulari[grade]
      console.log(`\n📚 Processing Grade ${grade}...`)

      // Create grade level category (e.g., "9. Sınıf") as top-level
      const gradeName = `${grade}. Sınıf`
      const gradeSlug = createSlug(gradeName)

      let gradeCategory = await prisma.category.findUnique({
        where: { slug: gradeSlug }
      })

      if (!gradeCategory) {
        gradeCategory = await prisma.category.create({
          data: {
            name: gradeName,
            slug: gradeSlug,
            description: `${grade}. sınıf matematik konuları`,
            order: i + 1, // Set order: 9. Sınıf = 1, 10. Sınıf = 2, etc.
            parentId: null // Top-level category
          }
        })
        console.log(`  ✅ Created grade category: ${gradeName} (order: ${i + 1})`)
      } else {
        console.log(`  ℹ️  Grade category already exists: ${gradeName}`)
        // Update to ensure it's top-level and has correct order
        if (gradeCategory.parentId !== null || gradeCategory.order !== i + 1) {
          await prisma.category.update({
            where: { id: gradeCategory.id },
            data: {
              parentId: null,
              order: i + 1
            }
          })
          console.log(`  🔄 Updated to top-level with order: ${i + 1}`)
        }
      }

      // Process each subject
      for (const [subjectKey, topicsOrSubjects] of Object.entries(subjects)) {
        const subjectName = `${subjectKey.replace(/_/g, ' ')} (${grade}. Sınıf)`
        const subjectSlug = createSlug(`${grade}-sinif-${subjectKey}`)

        let subjectCategory = await prisma.category.findUnique({
          where: { slug: subjectSlug }
        })

        if (!subjectCategory) {
          subjectCategory = await prisma.category.create({
            data: {
              name: subjectName,
              slug: subjectSlug,
              description: `${gradeName} - ${subjectName}`,
              parentId: gradeCategory.id
            }
          })
          console.log(`    ✅ Created subject: ${subjectName}`)
        } else {
          console.log(`    ℹ️  Subject already exists: ${subjectName}`)
          // Update parent if needed
          if (subjectCategory.parentId !== gradeCategory.id) {
            await prisma.category.update({
              where: { id: subjectCategory.id },
              data: { parentId: gradeCategory.id }
            })
            console.log(`    🔄 Updated parent for: ${subjectName}`)
          }
        }

        // Check if topicsOrSubjects is an array (topics) or object (more subcategories)
        if (Array.isArray(topicsOrSubjects)) {
          // These are final topics
          for (const topic of topicsOrSubjects) {
            const topicSlug = createSlug(`${grade}-sinif-${subjectKey}-${topic}`)

            const existingTopic = await prisma.category.findUnique({
              where: { slug: topicSlug }
            })

            if (!existingTopic) {
              await prisma.category.create({
                data: {
                  name: topic,
                  slug: topicSlug,
                  parentId: subjectCategory.id
                }
              })
              console.log(`      ✅ Created topic: ${topic}`)
            } else {
              console.log(`      ℹ️  Topic already exists: ${topic}`)
              // Update parent if needed
              if (existingTopic.parentId !== subjectCategory.id) {
                await prisma.category.update({
                  where: { id: existingTopic.id },
                  data: { parentId: subjectCategory.id }
                })
                console.log(`      🔄 Updated parent for: ${topic}`)
              }
            }
          }
        } else {
          // This is an object with more subcategories (like Grade 11 & 12 structure)
          for (const [subSubjectKey, topics] of Object.entries(topicsOrSubjects as Record<string, string[]>)) {
            const subSubjectName = `${subSubjectKey.replace(/_/g, ' ')} (${grade}. Sınıf)`
            const subSubjectSlug = createSlug(`${grade}-sinif-${subjectKey}-${subSubjectKey}`)

            let subSubjectCategory = await prisma.category.findUnique({
              where: { slug: subSubjectSlug }
            })

            if (!subSubjectCategory) {
              subSubjectCategory = await prisma.category.create({
                data: {
                  name: subSubjectName,
                  slug: subSubjectSlug,
                  description: `${gradeName} - ${subjectName} - ${subSubjectName}`,
                  parentId: subjectCategory.id
                }
              })
              console.log(`      ✅ Created sub-subject: ${subSubjectName}`)
            } else {
              console.log(`      ℹ️  Sub-subject already exists: ${subSubjectName}`)
              // Update parent if needed
              if (subSubjectCategory.parentId !== subjectCategory.id) {
                await prisma.category.update({
                  where: { id: subSubjectCategory.id },
                  data: { parentId: subjectCategory.id }
                })
                console.log(`      🔄 Updated parent for: ${subSubjectName}`)
              }
            }

            // Now add the topics under this sub-subject
            if (Array.isArray(topics)) {
              for (const topic of topics) {
                const topicSlug = createSlug(`${grade}-sinif-${subjectKey}-${subSubjectKey}-${topic}`)

                const existingTopic = await prisma.category.findUnique({
                  where: { slug: topicSlug }
                })

                if (!existingTopic) {
                  await prisma.category.create({
                    data: {
                      name: topic,
                      slug: topicSlug,
                      parentId: subSubjectCategory.id
                    }
                  })
                  console.log(`        ✅ Created topic: ${topic}`)
                } else {
                  console.log(`        ℹ️  Topic already exists: ${topic}`)
                  // Update parent if needed
                  if (existingTopic.parentId !== subSubjectCategory.id) {
                    await prisma.category.update({
                      where: { id: existingTopic.id },
                      data: { parentId: subSubjectCategory.id }
                    })
                    console.log(`        🔄 Updated parent for: ${topic}`)
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('\n✨ Category seeding completed successfully!\n')

    // Print summary
    const totalCategories = await prisma.category.count()
    console.log(`📊 Total categories in database: ${totalCategories}`)

  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedCategories()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
