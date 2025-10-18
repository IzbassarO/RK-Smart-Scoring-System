import { Home, Profile, SignIn, SignUp } from "@/pages";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "Github",
    href: "https://github.com/IzbassarO/RK-Smart-Scoring-System.git",
    target: "_blank",
    element: "",
  },
];

export default routes;
