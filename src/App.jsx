import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
const Destinations = lazy(() => import("./pages/Destinations.jsx"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail.jsx"));
const HowToTravel = lazy(() => import("./pages/HowToTravel.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const view = (Component) => (
  <Suspense
    fallback={
      <div className="container route-loading" role="status">
        Preparando tu próximo rumbo…
      </div>
    }
  >
    <Component />
  </Suspense>
);
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinos" element={view(Destinations)} />
        <Route
          path="destinos/:destinationId"
          element={view(DestinationDetail)}
        />
        <Route path="como-viajar" element={view(HowToTravel)} />
        <Route path="*" element={view(NotFound)} />
      </Route>
    </Routes>
  );
}
