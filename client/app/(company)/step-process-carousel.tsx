"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

type SliderType = {
  title: string;
  description: string;
  image: string;
};
const sliders: SliderType[] = [
  {
    title: "Tiếp nhận & Tư vấn chuyên sâu",
    description:
      "Đội ngũ chuyên viên ICH sẽ tư vấn chọn lựa sản phẩm với công thức tuyệt vời, kèm theo mẫu mã chai lọ, thiết kế in ấn bao bì và các thủ tục pháp lý cần thiết để đáp ứng tốt nhất nhu cầu kinh doanh của bạn.",
    image: "/products/product-2.png",
  },
  {
    title: "Nghiên cứu và phát triển sản phẩm theo yêu cầu",
    description: "ICH sản xuất mẫu thử theo yêu cầu sản phẩm bạn đã chọn.",
    image: "/products/product-2.png",
  },
  {
    title: "Chuyển giao mẫu thử",
    description: "ICH gửi tận nơi để bạn kiểm chứng chất lượng của sản phẩm",
    image: "/products/product-2.png",
  },
  {
    title: "Khách hàng kiểm tra, dùng thử sản phẩm mẫu",
    description:
      "ICH sẽ nhận phản hồi đánh giá từ khách hàng để điều chỉnh sản phẩm cho phù hợp với yêu cầu của khách hàng.",
    image: "/products/product-2.png",
  },
  {
    title: "Ký hợp đồng",
    description:
      "Tiến hành đặt hàng với đầy đủ thông tin thỏa thuận và ký hợp đồng.",
    image: "/products/product-2.png",
  },
  {
    title: "Thiết kế bao bì và in ấn",
    description:
      "ICH cùng với khách hàng lên ý tưởng thiết kế và đưa vào lịch sản xuất.",
    image: "/products/product-2.png",
  },
  {
    title: "Sản xuất và kiểm tra chất lượng",
    description:
      "Đội ngũ kỹ sư ICH tiến hành sản xuất theo các thông tin thỏa thuận khi đặt hàng, đảm bảo hoàn toàn về chất lượng sản phẩm.",
    image: "/products/product-2.png",
  },
  {
    title: "Chuyển giao hồ sơ và giao hàng",
    description:
      "Sản phẩm được đóng gói đúng chuẩn, đảm bảo vận chuyển an toàn đến tay bạn.",
    image: "/products/product-2.png",
  },
  {
    title: "Bảo hành sản phẩm",
    description:
      "Đội ngũ chuyên viên ICH sẽ hỗ trợ, chăm sóc và giải quyết mọi vấn đề liên quan đến sản phẩm cho bạn tốt nhất.",
    image: "/products/product-2.png",
  },
];
export const EightStepProcessCarousel = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [emblaMainApi, setEmblaMainApi] = React.useState<CarouselApi>();
  const [emblaThumbsApi, setEmblaThumbsApi] = React.useState<CarouselApi>();

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  React.useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);
  return (
    <>
      <Carousel
        setApi={setEmblaThumbsApi}
        opts={{
          align: "center",
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="relative after:content-[''] after:clear-both after:absolute after:h-[1px] after:w-full after:bottom-3 after:z-[-1] after:bg-slate-500"
      >
        <CarouselContent className="-ml-0">
          {sliders.map((slider, index) => (
            <CarouselItem
              key={index}
              className="pl-0 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div
                onClick={() => onThumbClick(index)}
                className={cn(
                  "relative pb-[30px]",
                  "before:content-[''] before:absolute before:w-3 before:h-3 before:bg-primary before:rounded-full before:z-[5] before:bottom-3 before:left-1/2 before:translate-x-1/2 before:translate-y-1/2",
                  "after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:border after:border-primary after:rounded-full after:z-[4] after:bottom-3 after:left-1/2 after:translate-x-0.5 after:translate-y-1/2 after:opacity-0",
                  selectedIndex == index ? "after:opacity-100" : ""
                )}
              >
                <div className="flex gap-2 sm:gap-4 items-center max-w-[150px] sm:max-w-[200px] w-full mx-auto">
                  <span className="text-primary font-bold text-[40px] sm:text-[50px] leading-none">
                    {`0${index + 1}`}
                  </span>
                  <span className="text-sm sm:text-base font-bold line-clamp-2">
                    {slider.title}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="border-lg border rounded-lg mt-2 mx-2 sm:mt-10 p-4 sm:mx-10">
        <Carousel className="w-full " setApi={setEmblaMainApi}>
          <CarouselContent className="ml-0">
            {sliders.map((slider, index) => (
              <CarouselItem key={index} className="md:pl-0 px-1">
                <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 w-full">
                  <div className="max-h-[400px] overflow-hidden">
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        priority
                        alt="ssds"
                        fill
                        src={slider.image}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw"
                      />
                    </AspectRatio>
                  </div>

                  <div className="w-full flex flex-col justify-center">
                    <h3 className="font-bold text-base sm:text-lg ">
                      {slider.title}
                    </h3>
                    <div className="h-0.5 w-12 bg-primary my-2"></div>
                    <p className="text-sm md:text-base">{slider.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            tabIndex={-1}
            className="-left-[52px] sm:flex hidden"
          />
          <CarouselNext
            tabIndex={-1}
            className="-right-[52px] sm:flex hidden"
          />
        </Carousel>
      </div>
    </>
  );
};
