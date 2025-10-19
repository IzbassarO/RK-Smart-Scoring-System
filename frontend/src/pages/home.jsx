import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData } from "@/data";
import SearchIIN from "@/widgets/SearchIIN";
import SearchAndScore from "@/widgets/SearchAndScore";

export function Home() {
  return (
    <>
      {/* --- Hero секция --- */}
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Empowering Smarter Credit Decisions.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                Analyze, predict, and approve with confidence. Our AI-driven scoring system helps you make better lending decisions in seconds.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* --- Секция с поиском --- */}
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          {/* блок карточек features */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>

          {/* компонент поиска */}
          <SearchAndScore />
        </div>
      </section>

      {/* --- Секция авторов --- */}
      <section className="px-4 pt-20 pb-48">
        <div className="container mx-auto">
          <PageTitle section="" heading="Authors">
            {/* можно добавить короткое описание команды здесь */}
          </PageTitle>

          {/* 1 → 2 → 3 колонки; растягиваем карточки по высоте */}
          <div className="mt-16 grid items-stretch grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {teamData.map(({ img, name, position, socials }) => (
              <div key={name || img} className="h-full">
                <TeamCard
                  img={img}
                  name={name || "Team Member"}
                  position={position}
                  socials={
                    <div className="flex items-center gap-2">
                      {socials.map(({ color, name }) => (
                        <IconButton key={name} color={color} variant="text">
                          <i className={`fa-brands text-xl fa-${name}`} />
                        </IconButton>
                      ))}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
