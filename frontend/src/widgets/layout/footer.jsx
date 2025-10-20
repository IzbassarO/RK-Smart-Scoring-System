import React from "react";
import PropTypes from "prop-types";
import { Typography, IconButton } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer() {
  const year = new Date().getFullYear();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-full rounded-t-3xl bg-[#243447] px-4 py-10 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <Typography variant="h5" className="font-extrabold">
              Contact Information
            </Typography>
            <div className="mt-3 space-y-1 text-blue-100">
              <a href="tel:+77089040559" className="block hover:underline">
                8 (708) 904-05-59, 00-00-00
              </a>
              <a href="mailto:izok2004@gmail.com" className="block hover:underline">
                izok2004@gmail.com
              </a>
            </div>
          </div>

          <div className="md:ml-auto">
            <IconButton
              variant="filled"
              color="blue-gray"
              className="bg-white/10 hover:bg-white/20"
              onClick={scrollTop}
              aria-label="Back to top"
            >
              <i className="fa-solid fa-arrow-up" />
            </IconButton>
          </div>
        </div>

        <hr className="mt-8 border-white/20" />
        <div className="container mx-auto mt-4">
          <Typography className="text-blue-100">
            © {year} Fin.AI
          </Typography>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
