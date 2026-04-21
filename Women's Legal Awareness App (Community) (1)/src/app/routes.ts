import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { LegalHub } from "./pages/LegalHub";
import { LegalContent } from "./pages/LegalContent";
import { IncidentLog } from "./pages/IncidentLog";
import { CreateIncident } from "./pages/CreateIncident";
import { IncidentDetail } from "./pages/IncidentDetail";
import { Complaints } from "./pages/Complaints";
import { CreateComplaint } from "./pages/CreateComplaint";
import { ComplaintDetail } from "./pages/ComplaintDetail";
import { Emergency } from "./pages/Emergency";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "legal", Component: LegalHub },
      { path: "legal/:id", Component: LegalContent },
      { path: "incidents", Component: IncidentLog },
      { path: "incidents/new", Component: CreateIncident },
      { path: "incidents/:id", Component: IncidentDetail },
      { path: "complaints", Component: Complaints },
      { path: "complaints/new", Component: CreateComplaint },
      { path: "complaints/:id", Component: ComplaintDetail },
      { path: "emergency", Component: Emergency },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
