import React from "react";
import { CarouselBanner } from "./banner-carousel";
import Link from "next/link";
import Image from "next/image";
import { YouTubeEmbed } from "@next/third-parties/google";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { MdBiotech, MdOutlineFactory } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import {
  BoxesIcon,
  CalendarIcon,
  ClipboardPenIcon,
  FlaskConicalIcon,
  GiftIcon,
  PencilRulerIcon,
  TabletSmartphoneIcon,
  TrendingUpIcon,
} from "lucide-react";
import { ServiceTabs } from "./service-tabs";
import { ContactForm } from "./contact-form";
import { EightStepProcessCarousel } from "./step-process-carousel";
import { PostTabs } from "./post-tabs";

const outstandingProductsData = [
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
    imageUrl: "/products/face-2.jpg",
  },
  {
    href: "/",
    alt: "Gia công mỹ phẩm tóc",
    label: "Gia công mỹ phẩm tóc",
    imageUrl: "/products/face-2.jpg",
  },
];

const HomePage = () => {
  return (
    <main>
      <section className="lg:mx-auto lg:max-w-[1350px]">
        <CarouselBanner />
      </section>
      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col max-w-md text-center sm:space-y-4 space-y-2">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl">
            CÁC SẢN PHẨM NỔI BẬT
          </h3>
          <p className="sm:text-base font-light text-sm px-2">
            Sản phẩm nổi bật do ICH sản xuất đã giúp các Boss mỹ phẩm đạt doanh
            thu khủng trên các sàn thương mại điện tử
          </p>
        </div>

        <div className="flex flex-wrap w-full pr-4">
          {outstandingProductsData.map((product, index) => (
            <div
              key={index}
              className="pt-4 pl-4 flex-grow basis-1/2 sm:basis-1/4 text-center"
            >
              <Link href={product.href}>
                <AspectRatio
                  ratio={1 / 1}
                  className="w-full rounded-lg overflow-hidden"
                >
                  <Image
                    priority
                    alt={product.alt}
                    fill
                    src={product.imageUrl}
                    sizes="(max-width: 768px) 100vw"
                    className="object-cover"
                  />
                </AspectRatio>
                <p className="text-sm sm:text-base font-medium mt-3">
                  {product.label}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col sm:max-w-2xl text-center space-y-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl">
            TẠI SAO NÊN CHỌN GIA CÔNG MỸ PHẨM TẠI I.C.H
          </h3>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-14 mt-16 w-full px-4">
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              QUY TRÌNH SẢN XUẤT NGHIÊM NGẶT VÀ ĐẠT CHUẨN
            </p>
            <span className="text-sm md:text-base mt-2">
              Nhà máy sản xuất mỹ phẩm ICH đạt chuẩn ISO 9001:2015 đảm bảo chất
              lượng sản phẩm được sản xuất trong môi trường tốt nhất cả về
              nguyên liệu, khâu sản xuất, bảo quản và xuất hàng.
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <MdOutlineFactory className="h-20 w-20 p-4" />
            </div>
          </div>
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              ĐỘI NGŨ KỸ SƯ R&D RIÊNG BIỆT
            </p>
            <span className="text-sm md:text-base mt-2">
              Chúng tôi liên tục nâng cấp chuyên môn đội ngũ liên tục thông qua
              các hội thảo trong và ngoài nước.
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <FaUsers className="h-20 w-20 p-4" />
            </div>
          </div>
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              CÔNG NGHỆ HIỆN ĐẠI, TIÊN TIẾN
            </p>
            <span className="text-sm md:text-base mt-2">
              Dây chuyền sản xuất hiện đại, cập nhật công nghệ tiên tiến về máy
              móc trong và ngoài nước nhằm đáp ứng tối đa nhu cầu của khách hàng
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <MdBiotech className="h-20 w-20 p-4" />
            </div>
          </div>
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              BẮT KỊP XU HƯỚNG PHÁT TRIỂN CỦA THỊ TRƯỜNG
            </p>
            <span className="text-sm md:text-base mt-2">
              ICH luôn cập nhật liên tục xu hướng mới nhất từ dòng sản phẩm, bao
              bì thiết kế, đến nguồn nguyên liệu đa dạng, dồi dào.
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <TrendingUpIcon className="h-20 w-20 p-4" />
            </div>
          </div>
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              HỖ TRỢ TƯ VẤN & THIẾT KẾ BAO BÌ, CHAO LỌ
            </p>
            <span className="text-sm md:text-base mt-2">
              Hỗ trợ khách hàng về ý tưởng, chiến lược, thiết kế bao bì, mẫu
              chai lọ. Giúp khách hàng giảm thiểu tối đa chi phí và thời gian.
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <PencilRulerIcon className="h-20 w-20 p-4" />
            </div>
          </div>
          <div className="relative flex items-center flex-col rounded-2xl drop-shadow-card text-center dark:border shadow p-4">
            <p className="text-md sm:text-lg font-semibold mt-10">
              CÁC DỊCH VỤ HẬU MÃI ĐI KÈM
            </p>
            <span className="text-sm md:text-base mt-2">
              Hỗ trợ công bố mỹ phẩm, đăng ký mã vạch, đăng ký bảo hộ thương
              hiệu, kiến thức chuyên sâu về mỹ phẩm gia công, hỗ trợ tư vấn liên
              hệ hợp tác KOL/KOC quảng bá sản phẩm và nhiều dịch vụ đi kèm khác
            </span>
            <div className="absolute -top-10 flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <GiftIcon className="h-20 w-20 p-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col max-w-xl text-center space-y-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl">
            CÁC DỊCH VỤ GIA CÔNG MỸ PHẨM
          </h3>
          <p className="sm:text-base font-light text-sm px-2">
            ICH đáp ứng nhu cầu gia công hơn 100+ các loại mỹ phẩm khác nhau,
            nguyên liệu hoàn toàn từ thiên nhiên và nhà máy sản xuất đạt chuẩn
            CGMP của Bộ Y Tế.
          </p>
        </div>

        <ServiceTabs />
      </section>

      <section>
        <div className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center py-10">
          <div className="flex flex-col max-w-xl text-center space-y-4">
            <h3 className="font-bold text-lg sm:text-2xl md:text-3xl pb-5">
              ĐÔI NÉT VỀ I.C.H
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="px-2 sm:text-base font-light text-sm">
              <p>
                Với hành trình hơn 10 năm trong lĩnh vực, đến năm 2020 Công ty
                TNHH MTV Thương Mại Sản Xuất I.C.H chính thức được khởi công và
                xây dựng với diện tích tại Sóc Trăng.
              </p>
              <p className="mt-2">
                Với tầm nhìn chiến lược phát triển ngành mỹ phẩm Việt, I.C.H
                chúng tôi không ngừng cập nhật công nghệ, thiết bị tiên tiến,
                chuyên môn để đáp ứng nhu cầu của khách hàng.
              </p>
              <p className="mt-2">
                I.C.H chính thức đưa vào vận hành nhà máy sản xuất mỹ phẩm quản
                lý theo tiêu chuẩn CGMP ASEAN, hệ thống chất lượng ISO
                9001:2015. Đưa I.C.H trở thành một trong những nhà máy sản xuất
                mỹ phẩm đạt chuẩn và quy mô tại khu vực Đồng Bằng Sông Cửu Long.
              </p>
              <p className="mt-2">
                Với sự thấu hiểu những thách thức và khó khăn trong việc tạo
                dựng thương hiệu mỹ phẩm riêng, I.C.H ấp ủ sứ mệnh trở thành đối
                tác đồng hành đáng tin cậy. Góp phần tạo ra những sản phẩm chất
                lượng, khẳng định thương hiệu của Quý khách hàng nói riêng và
                thúc đẩy sự phát triển của ngành mỹ phẩm Việt Nam nói chung.
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-4"
                variant="default"
              >
                XEM THÊM
              </Button>
            </div>
            <div className="md:order-none order-first px-2">
              <YouTubeEmbed
                playlabel="Nhà Máy Gia Công Mỹ Phẩm I.C.H"
                videoid="Ej7OAuVAAIM"
                params="controls=1&loop=0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col max-w-xl text-center space-y-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl">
            THÀNH TỰU CỦA CHÚNG TÔI
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 mt-8 w-full px-4">
          <div className="flex items-center gap-4 rounded-2xl drop-shadow-card dark:border shadow p-4">
            <div className="flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <BoxesIcon className="size-16 sm:size-20 p-4" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                30.000 +
              </p>
              <span className="text-xs md:text-base mt-2">
                Sản phẩm được sản xuất hàng ngày ra thị trường
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl drop-shadow-card dark:border shadow p-4">
            <div className="flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <FlaskConicalIcon className="size-16 sm:size-20 p-4" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary">99 +</p>
              <span className="text-xs md:text-base mt-2">
                Mỹ phẩm được gia công với công thức độc quyền
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl drop-shadow-card dark:border shadow p-4">
            <div className="flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <ClipboardPenIcon className="size-16 sm:size-20 p-4" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                100 +
              </p>
              <span className="text-xs md:text-base mt-2">
                Hợp đồng dịch vụ gia công, sang chiết, đóng gói mỹ phẩm
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl drop-shadow-card dark:border shadow p-4">
            <div className="flex items-center text-white bg-primary/80 dark:bg-primary rounded-full">
              <TabletSmartphoneIcon className="size-16 sm:size-20 p-4" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary">40 +</p>
              <span className="text-xs md:text-base mt-2">
                Khóa học làm mỹ phẩm đã khai giảng và giúp hàng trăm học viên
                thành công trên các sàn thương mại điện tử.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] bg-layout-1">
        <div className="flex flex-col w-full text-center space-y-4 sm:mb-10 mb-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mt-10">
            QUY TRÌNH GIA CÔNG 9 BƯỚC TRỌN GÓI
          </h3>
        </div>
        <EightStepProcessCarousel />
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col text-center space-y-4 sm:mb-10 mb-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mt-10">
            KHÁCH HÀNG NÓI GÌ VỀ I.C.H
          </h3>
        </div>
        <div className="w-full sm:columns-2 md:columns-3 p-2">
          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Nguyễn Thị T**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              Hợp tác với nhà máy được hơn 2 năm rồi rất hài lòng về chính sách
              cũng như chất lượng từ nhà máy. Hy vọng sẽ hợp tác với cty lâu dài
              để cho thắng nhiều cây hàng hơn nữa!
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">23/03/2021</span>
            </div>
          </div>

          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Jenny Tr**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStarHalf className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              May mắn được giới thiệu và có duyên được hợp tác và làm việc cùng
              nhà máy, nhờ có đội ngũ I.C.H mà mọi khâu đều được giải quyết rất
              nhanh gọn và linh hoạt.
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">24/12/2022</span>
            </div>
          </div>

          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Vương Mỹ A**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStarOutline className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              Điều mình thích nhất là công ty luôn hỗ trợ nhiệt tình và có chính
              sách tốt dành cho đối tác, chất kem với nguyên liệu luôn cập nhất
              mới nhất.
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">02/03/2023</span>
            </div>
          </div>
          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Trần Kim M**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStarOutline className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              Rất hài lòng về chính sách hậu mãi đi kèm của nhà máy, hỗ trợ
              nhiệt tình và xử lý vấn đề rất nhanh chóng luôn
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">06/10/2023</span>
            </div>
          </div>

          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Ngọc A**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStarOutline className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              Nhà máy gửi mẫu test nhanh chóng, mình hài lòng về chất kem ở đây,
              cập nhật liên tục nguyên liệu mới
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">28/11/2023</span>
            </div>
          </div>

          <div className="break-inside-avoid border text-start rounded-lg p-4 w-full space-y-2 mb-4">
            <div className="flex justify-between gap-2">
              <p className="text-base font-bold">Trương Thuy Ti**</p>
              <div className="flex">
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStar className="text-primary" />
                <IoIosStarOutline className="text-primary" />
              </div>
            </div>
            <p className="text-sm">
              Năm thứ 3 hợp tác với nhà máy, qui trình làm việc rất nhanh gọn,
              tư vấn có tâm, linh hoạt theo nhu cầu khách hàng. Cực kỳ hài lòng
            </p>
            <div className="flex justify-end items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">10/01/2024</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="flex flex-col max-w-xl text-center space-y-4 sm:mb-10 mb-4">
          <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mt-10">
            BÀI VIẾT NỔI BẬT
          </h3>
        </div>
        <PostTabs />
      </section>

      <section className="lg:mx-auto lg:max-w-[1350px] flex flex-col items-center my-10">
        <div className="grid md:grid-cols-2 w-full gap-4 p-2 sm:mb-10 mb-4 mt-10">
          <h4 className="font-bold text-base sm:text-lg md:text-xl ">
            ĐĂNG KÝ NHẬN BÁO GIÁ
            <p className="sm:text-base font-light text-sm">
              Bạn đang muốn làm chủ một thương hiệu riêng mình. Vui lòng để lại
              thông tin để được liên hệ tư vấn.
            </p>
          </h4>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
