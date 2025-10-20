import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";

export default function ProjectOverview() {
  return (
    <section className="relative w-full bg-gray-50 py-20">
      {/* верхняя разделительная линия */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <Typography
          variant="h2"
          color="blue-gray"
          className="mb-6 text-center font-black text-4xl md:text-5xl"
        >
          Project Overview
        </Typography>
        <Typography
          variant="lead"
          color="blue-gray"
          className="mb-16 text-center text-lg text-blue-gray-600"
        >
          Intelligent Credit Scoring System — based on machine learning for creditworthiness
          assessment and personalization of financial decisions.
        </Typography>

        {/* --- 2 Columns --- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* LEFT COLUMN */}
          <Card className="rounded-2xl border border-blue-gray-50 shadow-md shadow-gray-400/10">
            <CardBody className="p-8 space-y-8">
              <div>
                <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                  Context & Problem
                </Typography>
                <Typography className="text-blue-gray-700 leading-relaxed">
                  Kazakhstan’s banking sector faces ongoing challenges in assessing credit risk.
                  Traditional scoring approaches rely on manual evaluation and simple statistical
                  models, leading to suboptimal lending decisions and significant financial losses.
                </Typography>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <Typography variant="h5" color="green" className="font-extrabold">
                      8–12%
                    </Typography>
                    <Typography className="text-sm text-blue-gray-600">
                      Non-performing loans (NPL) ratio
                    </Typography>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <Typography variant="h5" color="green" className="font-extrabold">
                      ₸50–100B
                    </Typography>
                    <Typography className="text-sm text-blue-gray-600">
                      Annual economic loss from defaults
                    </Typography>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                  Dataset
                </Typography>
                <Typography className="text-blue-gray-700 leading-relaxed">
                  We used the <b>Home Credit Default Risk</b> dataset, which includes numerical,
                  categorical, and binary variables describing demographic, financial, and behavioral
                  factors of retail credit applicants.
                </Typography>
                <ul className="mt-3 space-y-1 text-blue-gray-800 text-base">
                  <li>• 307,511 records</li>
                  <li>• 122 variables</li>
                  <li>• 8.07% default rate</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* RIGHT COLUMN */}
          <Card className="rounded-2xl border border-blue-gray-50 shadow-md shadow-gray-400/10">
            <CardBody className="p-8 space-y-8">
              <div>
                <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                  Solution
                </Typography>
                <Typography className="text-blue-gray-700 leading-relaxed">
                  An <b>AI-driven credit risk assessment system</b> integrating client data through
                  IIN for precise, explainable, and automated lending decisions.
                  Using advanced ensemble models — <b>LightGBM</b> and <b>CatBoost</b> — the system
                  calculates the probability of default in real-time, supporting objective
                  data-based credit approval.
                </Typography>
              </div>

              <div>
                <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                  Benefits & Impact
                </Typography>
                <ul className="space-y-2 text-blue-gray-700">
                  <li>• Real-time decision-making for banks and microfinance organizations</li>
                  <li>• Transparent and explainable model behavior</li>
                  <li>• 20–30% reduction in manual evaluation time</li>
                  <li>• Modular architecture (Frontend + Backend + ML microservice)</li>
                  <li>• Scalable and Dockerized deployment</li>
                </ul>
              </div>

              <div>
                <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                  Team
                </Typography>
                <Typography className="text-blue-gray-700 leading-relaxed">
                  Project developed by <b>students from Atyrau University</b> under academic guidance:
                  <br />
                  • <b>Izbassar Orynbassar</b> — Master’s student (Backend & ML).<br />
                  • <b>Galymzhan Amangeldi</b> — Bachelor student (Frontend & Data).<br />
                  • <b>Assylbek Gizatov</b> — Scientific Supervisor.
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* нижняя разделительная линия */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </section>
  );
}
