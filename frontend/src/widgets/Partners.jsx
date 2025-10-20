import React from "react";
import { Typography } from "@material-tailwind/react";

export default function Partners() {
  const partners = [
    { img: "/img/partners/bccinvest.png", alt: "BCC Invest" },
    { img: "/img/partners/mastercard.png", alt: "Mastercard" },
    { img: "/img/partners/issai.png", alt: "Institute of Smart Systems and AI" },
    { img: "/img/partners/aifc.png", alt: "AIFC" },
    { img: "/img/partners/groupib.png", alt: "Group-IB" },
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-10 text-center font-bold tracking-tight"
        >
          Partners
        </Typography>

        <div className="grid grid-cols-2 md:grid-cols-5 items-center justify-center gap-8 md:gap-12">
          {partners.map(({ img, alt }, i) => (
            <div
              key={i}
              className="flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={img}
                alt={alt}
                className="h-10 md:h-14 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
