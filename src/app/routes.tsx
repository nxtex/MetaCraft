import { createBrowserRouter } from "react-router";
import { UploadPage } from "./pages/UploadPage";
import { MetadataPage } from "./pages/MetadataPage";
import { BatchAnalysisPage } from "./pages/BatchAnalysisPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: UploadPage,
  },
  {
    path: "/metadata/:fileId",
    Component: MetadataPage,
  },
  {
    path: "/batch",
    Component: BatchAnalysisPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
]);