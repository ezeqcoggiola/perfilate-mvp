import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./state/store";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import RouteDetail from "./pages/RouteDetail";
import Placeholder from "./pages/Placeholder";

// Guard simple: si no hay rol, manda al login.
function Require({ children }) {
  const { role } = useApp();
  return role ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onboarding" element={<Require><Onboarding /></Require>} />

      {/* Detalle de ruta: usa el shell con navegacion */}
      <Route path="/ruta/:id" element={<Require><Layout /></Require>}>
        <Route index element={<RouteDetail />} />
      </Route>

      {/* Area usuario */}
      <Route path="/app" element={<Require><Layout /></Require>}>
        <Route index element={<Home />} />
        <Route path="rutas" element={<Placeholder title="Explorar rutas" note="Listado completo, busqueda y filtros por tipo, area y nivel." />} />
        <Route path="guardados" element={<Placeholder title="Guardados" note="Tus rutas y recursos marcados con corazon." />} />
        <Route path="perfil" element={<Placeholder title="Tu perfil" note="Ver y editar tus dimensiones; las recomendaciones se recalculan." />} />
      </Route>

      {/* Area admin */}
      <Route path="/admin" element={<Require><Layout admin /></Require>}>
        <Route index element={<Placeholder title="Panel de administracion" note="Resumen del catalogo y la actividad de la plataforma." />} />
        <Route path="catalogo" element={<Placeholder title="Catalogo de recursos" note="Cargar, editar e importar recursos en bulk." />} />
        <Route path="propuestas" element={<Placeholder title="Propuestas de usuarios" note="Revisar recursos sugeridos y aprobarlos o descartarlos." />} />
        <Route path="rutas" element={<Placeholder title="Armado de rutas" note="Crear rutas y asociar recursos en orden." />} />
        <Route path="moderacion" element={<Placeholder title="Moderacion" note="Revisar comentarios y resultados de encuestas." />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
