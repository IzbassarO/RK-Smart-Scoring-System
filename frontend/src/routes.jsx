import { Home, Profile, SignIn, SignUp } from "@/pages";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "Github",
    href: "https://github.com/IzbassarO/RK-Smart-Scoring-System.git",
    target: "_blank",
    element: "",
  },
];

export default routes;
