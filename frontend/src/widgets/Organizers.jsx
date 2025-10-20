import React from "react";
import { Typography } from "@material-tailwind/react";

export default function Organizers() {
  const items = [
    {
      // ЗАМЕНИ путь на свой логотип
      img: "/img/organizers/abrk.png",
      alt: "Association of Banks of the Republic of Kazakhstan",
      // Подписи в три строки как на референсе
      lines: [
        "Қазақстан Республикасының Банктерінің Қауымдастығы",
        "Ассоциация Банков Республики Казахстан",
        "Association of Banks of the Republic of Kazakhstan",
      ],
    },
    {
      img: "/img/organizers/scb.png",
      alt: "State Credit Bureau",
      lines: [
        "Мемлекеттік Кредиттік Бюро",
        "Государственное Кредитное Бюро",
        "State Credit Bureau",
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-6 text-center font-bold tracking-tight"
        >
          Organizers
        </Typography>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map(({ img, alt, lines }, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-4 md:justify-start"
            >
              {/* ЛОГО: низкая высота, аккуратное масштабирование */}
              <img
                src={img}
                alt={alt}
                className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-150"
                loading="lazy"
              />
              {/* Подписи: компактные, без лишней высоты */}
              <div className="text-center md:text-left leading-tight">
                <p className="text-sm font-medium text-blue-gray-800">
                  {lines[0]}
                </p>
                <p className="text-sm font-medium text-blue-gray-800">
                  {lines[1]}
                </p>
                <p className="text-sm font-semibold text-blue-gray-900">
                  {lines[2]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
