// src/widgets/Faq.jsx
import React, { useState } from "react";
import {
  Card, CardBody, Typography, Accordion, AccordionHeader, AccordionBody,
} from "@material-tailwind/react";

const faqs = [
  {
    q: "What dataset do you use?",
    a: (
      <>
        We use the public <b>Home Credit Default Risk</b> dataset for research and demo purposes.
        Variables include numerical, categorical, and binary features representing
        demographic, financial, and behavioral characteristics of retail credit applicants.
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-blue-gray-800">
          <span className="before:mr-2 before:inline-block before:size-2 before:rounded-full before:bg-blue-gray-800">
            <b>307,511</b> records
          </span>
          <span className="before:mr-2 before:inline-block before:size-2 before:rounded-full before:bg-blue-gray-800">
            <b>122</b> variables
          </span>
          <span className="before:mr-2 before:inline-block before:size-2 before:rounded-full before:bg-blue-gray-800">
            <b>8.07%</b> default rate
          </span>
        </div>
      </>
    ),
  },
  {
    q: "What technologies power the system?",
    a: (
      <>
        <b>Frontend:</b> React + Vite, Material Tailwind, Heroicons. <br />
        <b>Backend:</b> ASP.NET Core (REST) + MongoDB. <br />
        <b>ML Service:</b> Python FastAPI, LightGBM (joblib models), feature store loading, configurable threshold. <br />
        <b>DevOps:</b> Docker Compose for multi-service local deploy.
      </>
    ),
  },
  {
    q: "How does the scoring decision work?",
    a: (
      <>
        The ML service returns a probability of default. We compare it to a configurable
        decision threshold (default <b>0.65</b>). If risk is below the threshold, the case is
        <b> approved</b>; otherwise, <b>rejected</b>. The UI shows the decision and both values for transparency.
      </>
    ),
  },
  {
    q: "What about data privacy?",
    a: (
      <>
        The system runs on research/demo data. No personal production identifiers are stored.
        For pilots, we recommend synthetic data or strict anonymization with access controls.
      </>
    ),
  },
  {
    q: "Who built this project?",
    a: (
      <>
        Built by a student team from <b>Atyrau University</b>:<br />
        • <b>Galymzhan Amangeldi</b> — Bachelor student (Frontend & Data).<br />
        • <b>Izbassar Orynbassar</b> — Master’s student (Backend & ML).<br />
        <b>Assylbek Gizatov</b> - Scientific Supervisor.
      </>
    ),
  },
  {
    q: "Can I try a live demo?",
    a: (
      <>
        Yes — use the search by IIN on this page and run a check. For external access or API keys,
        contact us via email in the footer.
      </>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  const handleOpen = (i) => setOpen(open === i ? 0 : i);

  return (
    <section className="px-4 pt-20 pb-16">
      <div className="container mx-auto">
        <Typography
          variant="h2"
          color="blue-gray"
          className="mb-10 text-center font-black leading-tight text-4xl md:text-5xl"
        >
          Frequently asked questions
        </Typography>

        {/* Шире и крупнее: */}
        <Card className="mx-auto max-w-6xl rounded-2xl border border-blue-gray-50 shadow-lg shadow-gray-500/10">
          <CardBody className="space-y-4 p-4 md:p-8">
            {faqs.map((item, i) => (
              <Accordion
                key={i}
                open={open === i + 1}
                className="rounded-xl border border-blue-gray-50 bg-white shadow-sm transition-all"
              >
                <AccordionHeader
                  onClick={() => handleOpen(i + 1)}
                  className="px-4 py-3 text-left text-lg md:text-xl font-semibold leading-snug data-[open=true]:text-blue-700"
                >
                  {item.q}
                </AccordionHeader>
                <AccordionBody className="px-4 pb-5 pt-0 text-base md:text-lg text-blue-gray-700">
                  {item.a}
                </AccordionBody>
              </Accordion>
            ))}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
