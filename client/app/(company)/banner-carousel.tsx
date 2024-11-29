"use client";
import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const CarouselBanner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="-ml-4">
        <CarouselItem className="pl-4">
          <AspectRatio ratio={1280 / 440}>
            <Image
              priority
              alt={`soap`}
              src={"/banners/olloy-banner.jpg"}
              className="object-cover"
              width={2560}
              height={880}
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="pl-4">
          <AspectRatio ratio={1280 / 440}>
            <Image
              priority
              alt={`perfume`}
              src={"/banners/perfume-banner.jpg"}
              className="object-cover"
              width={2560}
              height={880}
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="pl-4">
          <AspectRatio ratio={1280 / 440}>
            <Image
              priority
              alt={`olloy`}
              src={"/banners/soap-banner.jpg"}
              className="object-cover"
              width={2560}
              height={880}
            />
          </AspectRatio>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );
};
