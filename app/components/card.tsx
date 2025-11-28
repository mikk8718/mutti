"use client";

import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: 'Julekugler',
    href: '#',
    images: [
      '/images/dekoration_1.jpeg',
      '/images/dekoration_2.jpeg',
    ],
    imageAlt: 'Julekugler',
    price: '15 DDK (2 for 20)',
    color: 'Sorte eller hvide kugler',
    attribute: ""
  },
  {
    id: 2,
    name: '2 stk. Grydelapper',
    href: '#',
    images: [
      '/images/klud_blå.jpeg'
    ],
    imageAlt: 'Strikket klud',
    price: '100 DDK',
    color: '',
  },
  {
    id: 3,
    name: 'Strikket sløjfe',
    href: '#',
    images: [
      '/images/sløjfe_blå.jpeg',
      '/images/sløjfe_rød.jpeg',
      '/images/sløjfe_brun.jpeg',
      '/images/sløjfe_rød_broche.jpeg'
    ],
    imageAlt: 'Strikket sløjfe',
    price: '35 DDK',
    color: 'Laves også som broche',
  },
  {
    id: 4,
    name: 'Strikket stor sløjfe',
    href: '#',
    images: [
      '/images/større_sløjfe_rød.jpeg',
    ],
    imageAlt: 'Stor sløjfe',
    price: '50 DDK (2 for 75)',
    color: '',
  },
  {
    id: 5,
    name: 'Julehjerter',
    href: '#',
    images: [
      '/images/julehjerter.jpeg',
    ],
    imageAlt: 'Stor sløjfe',
    price: '50 DDK (2 for 75)',
    color: '',
  }
]

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  note?: string; // size, color, text, etc
};


type ProductProps = {
  addToCart: (item: CartItem) => void;
};



export default function Product({ addToCart }: ProductProps) {
  const [activeImages, setActiveImages] = useState<Record<number, number>>(
    products.reduce((acc, product) => {
      acc[product.id] = 0
      return acc
    }, {} as Record<number, number>)
  )

  const [quantities, setQuantities] = useState<Record<number, number>>(
    products.reduce((acc, product) => {
      acc[product.id] = 1
      return acc
    }, {} as Record<number, number>)
  )

  return (
    <div className="pb-32 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Mit navn er Bodil, og her er et lille galleri af håndlavede ting som jeg laver på bestilling.
        </h2>
        <h2 className="text-xl tracking-tight text-gray-900 s:my-2">
          Derudover laver jeg alt lige fra tæpper til trøjer både i hækling og strik.
        </h2>
        <h2 className="italic my-2 text-xl font-bold tracking-tight text-gray-900">
          Alle bestillinger foregår over SMS, og du kan igennem denne side skrive en besked til mig eller ræk ud på 60128531.
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            const currentIndex = activeImages[product.id]
            const currentImage = product.images[currentIndex]

            const handleMainImageClick = () => {
              if (product.images.length <= 1) return

              setActiveImages((prev) => ({
                ...prev,
                [product.id]:
                  (currentIndex + 1) % product.images.length,
              }))
            }

            return (
              <div key={product.id} className="group relative">
                <img
                  alt={product.imageAlt}
                  src={currentImage}
                  onClick={handleMainImageClick}
                  className="aspect-square w-full cursor-pointer rounded-md bg-gray-200 object-cover lg:h-80"
                />

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="mt-2 flex gap-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setActiveImages((prev) => ({
                            ...prev,
                            [product.id]: index,
                          }))
                        }
                        className={`h-12 w-12 overflow-hidden rounded border ${currentIndex === index
                          ? 'border-gray-900 border-1'
                          : 'border-transparent'
                          }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>

                <div className="mt-1 flex justify-between">
                  <select
                    value={quantities[product.id]}
                    onChange={(e) =>
                      setQuantities(prev => ({
                        ...prev,
                        [product.id]: Number(e.target.value)
                      }))
                    }
                    className="mt-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>


                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        quantity: quantities[product.id] // ✅ REAL selected quantity
                      })
                    }
                    className="mt-2 border border-gray-300 px-2 py-1 rounded"
                  >
                    Læg i kurv
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}