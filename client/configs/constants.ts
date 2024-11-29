export const constants = {
  url: "https://nhamaymyphamich.vn",
  company: "Công ty TNHH MTV TM Sản Xuất I.C.H",
  phoneNumberCompany: "0906 640 464",
  addressCompany:
    "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
  emailCompany: "i.c.h.vietnam2020@gmail.com",
  tax: "2200773307",
  companyRepresentative: "Lê Minh Đức",
  social: {
    tiktok: "https://www.tiktok.com/@giacongmyphamich",
    youtube: "https://www.youtube.com/@nhamaygiacongmyphamich",
    facebook: "https://www.facebook.com/mindvietnam",
    zalo: "https://zalo.me/0906640464",
  },
  seo: {
    defaultTitle: "ICH - Gia Công, Sản Xuất Mỹ Phẩm",
    defaultDescription:
      "I.C.H là đơn vị sản xuất gia công mỹ phẩm hàng đầu Việt Nam, với quy trình sản xuất đạt chuẩn cGMP, công thức độc quyền, nguyên liệu thiên nhiên.",
  },
};

export type BaseNav = {
  title: string;
  href: string;
};

export type DropDownNav = BaseNav & {
  subNav: (BaseNav | DropDownNav)[];
};

export const newsNav: DropDownNav = {
  title: "Tin Tức",
  href: "/tin-tuc",
  subNav: [
    {
      title: "Tin Tức Nổi Bật",
      href: "/",
    },
    {
      title: "Cập Nhật Xu Hướng Mỹ phẩm",
      href: "/",
    },
    {
      title: "Gia Công Mỹ Phẩm",
      href: "/",
    },
    {
      title: "Mẫu Chai",
      href: "/",
    },
    {
      title: "Tuyển Dụng",
      href: "/",
    },
  ],
};

export const productsNav: DropDownNav = {
  title: "Sản Phẩm Gia Công",
  href: "/san-pham-gia-cong",
  subNav: [
    {
      title: "Chăm Sóc Da Mặt",
      href: "/",
      subNav: [
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Serum",
          href: "/",
        },
        {
          title: "Kem Chống Nắng",
          href: "/",
        },
      ],
    },
    {
      title: "Chăm Sóc Da Mặt",
      href: "/",
      subNav: [
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Serum",
          href: "/",
        },
        {
          title: "Kem Chống Nắng",
          href: "/",
        },
      ],
    },
    {
      title: "Chăm Sóc Da Mặt",
      href: "/",
      subNav: [
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Kem Face",
          href: "/",
        },
        {
          title: "Serum",
          href: "/",
        },
        {
          title: "Kem Chống Nắng",
          href: "/",
        },
      ],
    },
  ],
};

export const navs: (BaseNav | DropDownNav)[] = [
  {
    title: "Trang Chủ",
    href: "/",
  },
  {
    title: "Giới Thiệu",
    href: "/gioi-thieu",
  },
  {
    title: "Quy Trình Gia Công",
    href: "/quy-trinh-gia-cong",
  },
  {
    title: "Sản Phẩm Gia Công",
    href: "/san-pham-gia-cong",
    subNav: [
      {
        title: "Chăm Sóc Da Mặt",
        href: "/",
        subNav: [
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Serum",
            href: "/",
          },
          {
            title: "Kem Chống Nắng",
            href: "/",
          },
        ],
      },
      {
        title: "Chăm Sóc Da Mặt",
        href: "/",
        subNav: [
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Serum",
            href: "/",
          },
          {
            title: "Kem Chống Nắng",
            href: "/",
          },
        ],
      },
      {
        title: "Chăm Sóc Da Mặt",
        href: "/",
        subNav: [
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Kem Face",
            href: "/",
          },
          {
            title: "Serum",
            href: "/",
          },
          {
            title: "Kem Chống Nắng",
            href: "/",
          },
        ],
      },
    ],
  },
  productsNav,
  newsNav,
  {
    title: "Liên Hệ",
    href: "/lien-he",
  },
];
