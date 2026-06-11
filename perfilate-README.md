# Perfilate — maqueta navegable

Prototipo **no funcional** de Perfilate, plataforma de orientacion academica y
profesional en datos. Hecho para mostrar como seria la pagina: tiene todas sus
partes y navegacion real, pero **no hay base de datos ni motor de recomendacion**.
Todos los datos son fijos (mock) y viven en memoria: si recargas la pagina, se
reinicia.

El unico calculo "real" es la afinidad de las rutas: una similitud coseno entre
el vector de pesos de tu perfil y el de cada ruta. Es determinista y transparente,
pero alcanza para mostrar como se sentiria un recomendador de verdad.

## Como correrlo en VS Code

1. Descomprimi la carpeta y abrila en VS Code (`File > Open Folder`).
2. Abri una terminal integrada (`Ctrl + ñ` o `Terminal > New Terminal`).
3. Instala las dependencias y levanta el server:

```bash
npm install
npm run dev
```

4. Abri el navegador en la URL que muestra la terminal (suele ser
   `http://localhost:5173`).

Necesitas Node.js 18+ instalado.

## Que se puede ver hoy

- **Login / landing** con la idea del producto (`/`).
- **Onboarding**: eleccion de metodo (manual andando; CV y SIU como placeholder)
  y carga manual con **sliders de peso** por dimension.
- **Inicio**: tu mejor match destacado + el resto de rutas ordenadas por afinidad,
  con justificacion generada y boton "no me interesa".
- **Detalle de ruta**: comparacion de tu perfil vs el de la ruta y el camino de
  recursos.
- **Admin**: entras desde el login con "Entrar como admin".

Las pantallas marcadas como *En construccion* son las que siguen: explorar/filtrar,
guardados, editar perfil, y todo el panel admin (catalogo, propuestas, armado de
rutas, moderacion).

## Mapa de archivos

```
src/
  data/mockData.js      datos fijos + calculo de afinidad
  state/store.jsx       estado global (login, perfil, guardados)
  components/           Layout, RouteCard, AffinityMeter
  pages/                Login, Onboarding, Home, RouteDetail, Placeholder
  App.jsx               ruteo
  index.css             design tokens y estilos base
```
