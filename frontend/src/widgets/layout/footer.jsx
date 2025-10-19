import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer({ copyright }) {
  return (
    <footer className="relative bg-slate-900 px-4 pt-14 pb-10 text-slate-200">
      <div className="container mx-auto">
        {/* Контакты */}
        <div className="mt-10 rounded-2xl bg-slate-800 p-6">
          <Typography variant="small" className="block">
            <span className="font-semibold">Contact:</span> izok2004@gmail.com · +7 (708) 904-05-59
          </Typography>
          <Typography variant="small" className="mt-1 block">
            <span className="font-semibold">Address:</span> пр. Студенческий, 212, Атырау, Казахстан
          </Typography>
        </div>

        <hr className="my-8 border-slate-700" />

        {/* Низ: копирайт по центру */}
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          <div className="mx-auto w-full px-4 text-center">
            <Typography variant="small" className="font-normal text-slate-400">
              {copyright}
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  copyright: (
    <>
      © {year} Нац Банк — RK Smart Scoring System. Все права защищены.
    </>
  ),
};

Footer.propTypes = {
  copyright: PropTypes.node,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
