"use client"

import Link from 'next/link'
import React, { useState } from 'react'

const matematikKonulari = {
  "9. Sınıf": {
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

  "10. Sınıf": {
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

  "11. Sınıf": {
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

  "12. Sınıf": {
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

const ExpandIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="#33363F" strokeWidth="2" />
    </svg>);
}


// Yardımcı: objeyi key-path'lerle dolaşmak için benzersiz bir id oluşturur
const makeId = (pathArray: string[]) => pathArray.join('>')

// Recursive tree renderer
const TreeNode = ({ nodeKey, nodeValue, path = [], level = 0, openMap, toggle }: {
  nodeKey: string
  nodeValue: any
  path?: string[]
  level?: number
  openMap: Record<string, boolean>
  toggle: (id: string) => void
}) => {
  const id = makeId([...path, nodeKey])
  const isOpen = !!openMap[id]
  const isLeafArray = Array.isArray(nodeValue)
  const isObject = typeof nodeValue === 'object' && !isLeafArray

  return (
    <div>
      <button
        className={`flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 ${level === 0 ? 'font-semibold' : ''}`}
        aria-expanded={isOpen}
      >
        <span className="truncate">{nodeKey.replace(/_/g, ' ')}</span>
        <span className="ml-2 text-sm" onClick={() => toggle(id)}>{isLeafArray ? `(${nodeValue.length})` : isObject ? (isOpen ? <ExpandIcon className="rotate-90" /> : <ExpandIcon className="" />) : ''}</span>
      </button>

      {isLeafArray && isOpen && (
        <ul className="pl-4 mt-1">
          {nodeValue.map((item, idx) => (
            <li key={idx} className="py-1 px-2 text-sm truncate">{item}</li>
          ))}
        </ul>
      )}

      {isObject && isOpen && (
        <div className="pl-4 mt-1 border-l border-gray-200">
          {Object.entries(nodeValue).map(([childKey, childVal]) => (
            <TreeNode
              key={makeId([...path, nodeKey, childKey])}
              nodeKey={childKey}
              nodeValue={childVal}
              path={[...path, nodeKey]}
              level={level + 1}
              openMap={openMap}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ data = matematikKonulari }: { data?: any }) => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="w-72 max-w-full h-screen overflow-auto border-r border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold"><Link href='/'>Yapar Hoca test</Link></h2>
        <div className="flex gap-2">
          <button onClick={() => { }} className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>
      <nav aria-label="Sınıflar ve konular">
        {Object.entries(data).map(([classKey, classVal]) => (
          <div key={classKey} className="mb-2">
            <TreeNode
              nodeKey={`${classKey}. Sınıf`}
              nodeValue={classVal}
              path={[]}
              level={0}
              openMap={openMap}
              toggle={toggle}
            />
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
