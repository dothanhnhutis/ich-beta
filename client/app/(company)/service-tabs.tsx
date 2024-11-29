"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const cosmeticProcessingServicesData = [
  {
    id: "lam-sach",
    label: "Làm sạch",
    items: [
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc 1",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
    ],
  },
  {
    id: "duong-da-co-ban",
    label: "Dưỡng da cơ bản",
    items: [
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc 2",
        imageUrl: "/products/face-2.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-2.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-2.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-2.jpg",
      },
    ],
  },
  {
    id: "duong-da-chuyen-sau",
    label: "Dưỡng da chuyên sâu",
    items: [
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc 3",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
      {
        href: "/",
        alt: "Gia công mỹ phẩm tóc",
        label: "Gia công mỹ phẩm tóc",
        imageUrl: "/products/face-1.jpg",
      },
    ],
  },
];

export const ServiceTabs = () => {
  const [cosmeticProcessingServicesTap, setCosmeticProcessingServicesTap] =
    React.useState<string>(cosmeticProcessingServicesData[0].id);
  return (
    <Tabs value={cosmeticProcessingServicesTap} className="w-full mt-5">
      <div className="flex justify-center px-2">
        <div className="flex gap-2 items-center overflow-x-scroll max-w-full">
          {cosmeticProcessingServicesData.map((cosmeticProcessingService) => (
            <div
              key={cosmeticProcessingService.id}
              onClick={() =>
                setCosmeticProcessingServicesTap(cosmeticProcessingService.id)
              }
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 font-semibold transition-colors flex-shrink-0 cursor-pointer",
                cosmeticProcessingServicesTap == cosmeticProcessingService.id
                  ? "text-primary hover:opacity-80"
                  : "text-primary/50"
              )}
            >
              <p className="text-sm sm:text-base">
                {cosmeticProcessingService.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {cosmeticProcessingServicesData.map((cosmeticProcessingService) => (
        <TabsContent
          key={cosmeticProcessingService.id}
          value={cosmeticProcessingService.id}
          className="px-2 text-center"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            {cosmeticProcessingService.items.map((item, index) => (
              <Link key={index} href={item.href}>
                <AspectRatio
                  ratio={1 / 1}
                  className="w-full rounded-lg overflow-hidden"
                >
                  <Image
                    priority
                    alt={item.alt}
                    fill
                    src={item.imageUrl}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw"
                  />
                </AspectRatio>
                <p className="text-base font-medium mt-3">{item.label}</p>
              </Link>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
