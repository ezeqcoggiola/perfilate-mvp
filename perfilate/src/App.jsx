import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./state/store";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import RouteDetail from "./pages/RouteDetail";
import ResourceDetail from "./pages/ResourceDetail";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Explore from "./pages/Explore";
import ProposeResource from "./pages/ProposeResource";
import Dashboard from "./pages/admin/Dashboard";
import Catalog from "./pages/admin/Catalog";
import CatalogForm from "./pages/admin/CatalogForm";
import Proposals from "./pages/admin/Proposals";
import ProposalDetail from "./pages/admin/ProposalDetail";
import Routes_ from "./pages/admin/Routes";
import RouteForm from "./pages/admin/RouteForm";
import Moderacion from "./pages/admin/Moderacion";

// Guard simple: si no hay rol, manda al login.
function Require({ children }) {
  const { role } = useApp();
  return role ? children : <Navigate to="/" replace />;
}

// Guard de admin: requiere sesion y rol admin; si es usuario, lo manda al area de usuario.
function RequireAdmin({ children }) {
  const { role } = useApp();
  if (!role) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/ingresar" element={<SignIn />} />
      <Route path="/onboarding" element={<Require><Onboarding /></Require>} />

      {/* Detalle de ruta: usa el shell con navegacion */}
      <Route path="/ruta/:id" element={<Require><Layout /></Require>}>
        <Route index element={<RouteDetail />} />
      </Route>

      {/* Detalle de recurso */}
      <Route path="/recurso/:id" element={<Require><Layout /></Require>}>
        <Route index element={<ResourceDetail />} />
      </Route>

      {/* Area usuario */}
      <Route path="/app" element={<Require><Layout /></Require>}>
        <Route index element={<Home />} />
        <Route path="rutas" element={<Explore />} />
        <Route path="guardados" element={<Saved />} />
        <Route path="proponer" element={<ProposeResource />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      {/* Area admin */}
      <Route path="/admin" element={<RequireAdmin><Layout admin /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="catalogo/nuevo" element={<CatalogForm />} />
        <Route path="catalogo/:id/editar" element={<CatalogForm />} />
        <Route path="propuestas" element={<Proposals />} />
        <Route path="propuestas/:id" element={<ProposalDetail />} />
        <Route path="rutas" element={<Routes_ />} />
        <Route path="rutas/nueva" element={<RouteForm />} />
        <Route path="rutas/:id/editar" element={<RouteForm />} />
        <Route path="moderacion" element={<Moderacion />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
