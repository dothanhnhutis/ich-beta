import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookTextIcon,
  CircleIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react";
import { constants, newsNav } from "@/configs/constants";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-accent">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between py-5 lg:mx-auto lg:max-w-[1350px]">
        <div className="grid basis-1/3 py-2 pl-2 gap-2">
          <div>
            <Link className="inline-block" href="/" prefetch={false}>
              <Image
                priority
                src={"/logo.png"}
                width="0"
                height="0"
                sizes="110px"
                className="size-auto"
                alt="logo"
                title="logo-ich"
              />
            </Link>
          </div>
          <h2 className="font-bold text-lg">{constants.company}</h2>
          <div className="flex items-center gap-1 text-sm">
            <BookTextIcon className="w-4 h-4 flex flex-shrink-0" />
            <p>Mã số thuế doanh nghiệp: {constants.tax}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <User2Icon className="w-4 h-4 flex flex-shrink-0" />
            <p>Người đại diện: {constants.companyRepresentative}</p>
          </div>
          <div className="flex items-center gap-1 text-sm max-w-sm">
            <MapPinIcon className="w-4 h-4 flex flex-shrink-0" />
            <p>Nhà máy sản xuất: {constants.addressCompany}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <PhoneIcon className="w-4 h-4 flex flex-shrink-0" />
            <p>Hotline: {constants.phoneNumberCompany}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MailIcon className="w-4 h-4 flex flex-shrink-0" />
            <p>Email: {constants.emailCompany}</p>
          </div>
        </div>
        <div className="flex flex-wrap basis-2/3 flex-1">
          <div className="basis-1/2 sm:basis-1/4 md:basis-1/2 lg:basis-1/4 py-2 pl-2">
            <p className="uppercase font-bold">Thông Tin</p>
            <div className="h-0.5 w-12 bg-primary my-2" />
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Trang Chủ</p>
              </Link>
              <Link
                href="/gia-cong-my-pham"
                className="flex items-center text-sm"
              >
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Giới Thiệu</p>
              </Link>
              <Link href="/lien-he" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Quy Trình Gia Công</p>
              </Link>
              {/* <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Sứ mệnh tầm nhìn</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Năng lực cốt lõi</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Nghiên cứu mỹ phẩm</p>
              </Link> */}
            </div>
          </div>
          <div className="basis-1/2 sm:basis-1/4 md:basis-1/2 lg:basis-1/4 py-2 pl-2">
            <p className="uppercase font-bold">Sản Phẩm Gia Công</p>
            <div className="h-0.5 w-12 bg-primary my-2" />
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Kem</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Nước Hoa</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Sửa Rửa Mặt</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Serum</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Dầu Gội</p>
              </Link>
              <Link href="/" className="flex items-center text-sm">
                <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                <p>Gia Công Mặt Nạ</p>
              </Link>
            </div>
          </div>
          <div className="basis-1/2 sm:basis-1/4 md:basis-1/2 lg:basis-1/4 py-2 pl-2">
            <p className="uppercase font-bold">Tin Tức</p>
            <div className="h-0.5 w-12 bg-primary my-2" />

            <div className="flex flex-col gap-2">
              {newsNav.subNav.map((news, idx) => (
                <Link
                  key={idx}
                  href={news.href}
                  className="flex items-center text-sm"
                >
                  <CircleIcon className="w-2 h-2 flex flex-shrink-0 mx-1" />
                  <p>{news.title}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="basis-1/2 sm:basis-1/4 md:basis-1/2 lg:basis-1/4 py-2 pl-2">
            <p className="uppercase font-bold">Theo Dõi I.C.H</p>
            <div className="h-0.5 w-12 bg-primary my-2" />
            <div className="flex items-center gap-3">
              <Link target="_blank" href={constants.social.tiktok}>
                <FaTiktok className="w-5 h-5 flex flex-shrink-0" />
              </Link>

              <Link target="_blank" href={constants.social.facebook}>
                <FaFacebookF className="w-5 h-5 flex flex-shrink-0" />
              </Link>
              <Link target="_blank" href={constants.social.youtube}>
                <FaYoutube className="w-5 h-5 flex flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary dark:bg-primary-foreground text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between lg:mx-auto lg:max-w-[1350px] p-2">
          <p className="text-sm order-last md:order-none mt-1 sm:mt-0">
            © 2023 All rights reserved
          </p>
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/chinh-sach-thanh-toan">
                <p className="text-sm">Chính sách thanh toán</p>
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-bao-hanh">
                <p className="text-sm">Chính sách bảo hành</p>
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-bao-mat">
                <p className="text-sm">Chính sách bảo mật</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
