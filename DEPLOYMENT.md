# Deployment

Este documento explica cómo construir y ejecutar la imagen Docker localmente y cómo desplegar en Render.

## Tabla de contenidos
1. [Instalación de Docker](#instalación-de-docker)
2. [Construir la imagen Docker](#construir-la-imagen-docker)
3. [Ejecutar la imagen localmente](#ejecutar-la-imagen-localmente)
4. [Despliegue en Render](#despliegue-en-render)
5. [Troubleshooting](#troubleshooting)

---

## Instalación de Docker

### macOS (Homebrew - recomendado)

```bash
brew install docker
```

Luego instala Docker Desktop desde https://www.docker.com/products/docker-desktop o usando Homebrew:

```bash
brew install --cask docker
```

Abre Docker Desktop (búscalo en Applications). Verifica que está corriendo:

```bash
docker --version
docker ps
```

Si ves algo como `Docker version 20.x.x` y una lista vacía (sin error), está listo.

### macOS (alternativa: Colima - alternativa ligera a Docker Desktop)

```bash
brew install colima
colima start
```

### macOS (alternativa: Rancher Desktop)

Descarga desde https://rancherdesktop.io

### Windows / Linux

Descarga Docker Desktop desde https://www.docker.com/products/docker-desktop o sigue la guía oficial para tu SO.

---

## Construir la imagen Docker

### Paso 1: Posiciónate en la raíz del repo

```bash
cd /Users/joanespada/Desktop/Ing.\ en\ Software/MVP\ -\ Github/perfilate-mvp
```

(o simplemente arrastra la carpeta del Finder al terminal para copiar la ruta).

### Paso 2: Asegúrate de que Docker está corriendo

```bash
docker ps
```

Si ves un error como `Cannot connect to the Docker daemon`, abre Docker Desktop o ejecuta `colima start` si usas Colima.

### Paso 3: Construir la imagen

```bash
docker build -t perfilate-mvp:local .
```

Esto construirá una imagen con el tag `perfilate-mvp:local`. El proceso:
- Descarga la imagen base de Node (node:20-alpine) (~150 MB)
- Instala dependencias npm dentro del contenedor
- Compila la app con Vite (`npm run build`)
- Descarga nginx (nginx:stable-alpine)
- Copia los archivos compilados a nginx
- Finaliza (~300-400 MB total)

El proceso toma 2-5 minutos en la primera ejecución; las siguientes son más rápidas por caché.

### Paso 4: Verificar que se construyó correctamente

```bash
docker images | grep perfilate
```

Deberías ver algo como:

```
perfilate-mvp   local       abc123def456   2 minutes ago   85MB
```

---

## Ejecutar la imagen localmente

### Opción A: Ejecutar y acceder desde el navegador

```bash
docker run --rm -p 8080:80 perfilate-mvp:local
```

Luego abre en el navegador:

```
http://localhost:8080
```

Verás la página principal de Perfilate. Para detener el contenedor presiona `Ctrl+C`.

### Opción B: Ejecutar en background (detached)

```bash
docker run --rm -d -p 8080:80 --name perfilate-local perfilate-mvp:local
```

Ver logs:
```bash
docker logs -f perfilate-local
```

Detener:
```bash
docker stop perfilate-local
```

### Opción C: Ejecutar en otro puerto (ej. 3000)

```bash
docker run --rm -p 3000:80 perfilate-mvp:local
# luego http://localhost:3000
```

---

## Despliegue en Render

### Paso 1: Sube tu código a GitHub

```bash
git add .
git commit -m "Add Dockerfile, nginx config and deployment files"
git push
```

### Paso 2: En Render (render.com)

1. Conecta tu cuenta de GitHub a Render (si no está ya conectada).
2. Haz clic en "New +" → "Web Service".
3. Selecciona el repositorio `perfilate-mvp`.
4. Llena la información:
   - **Name**: `perfilate-mvp` (o el nombre que prefieras)
   - **Region**: Elige la que esté más cerca (ej. Oregon, Frankfurt, etc.)
   - **Branch**: `main` (o tu rama default)
   - **Build Command**: déjalo **vacío** (el Dockerfile tiene el build)
   - **Start Command**: déjalo **vacío** (el Dockerfile tiene el CMD)
   - **Runtime**: Docker (debe detectarse automáticamente)

5. Haz clic en "Create Web Service".

Render construirá la imagen y la desplegará. En 2-5 minutos verás una URL como `https://perfilate-mvp.onrender.com`.

### Paso 3: Verifica que funciona

Abre la URL en el navegador. Deberías ver Perfilate cargado.

### Notas sobre Render

- Render proporciona la variable de entorno `PORT` (por defecto 10000). El Dockerfile la inyecta en nginx vía `envsubst`.
- Si necesitas cambios, haz un push a `main` y Render re-construye automáticamente.
- Si la build falla, revisa los logs en Render → "Logs" para ver qué pasó.

---

## Troubleshooting

### Error: "Cannot connect to the Docker daemon"

**Solución**: Docker no está corriendo.

```bash
# macOS
open /Applications/Docker.app

# o si usas Colima:
colima start

# Verifica
docker ps
```

### Error: "Dockerfile not found"

**Solución**: Asegúrate de estar en la raíz del repo (donde está `Dockerfile`):

```bash
ls -la Dockerfile
# Deberías ver: -rw-r--r-- 1 user staff ... Dockerfile
```

### Error: "npm install / npm run build falla dentro del Dockerfile"

**Posibles causas**:
- `perfilate/package.json` no existe o tiene errores de sintaxis.
- `perfilate/package-lock.json` está fuera de sync. Regenera:
  ```bash
  cd perfilate
  npm install
  cd ..
  docker build -t perfilate-mvp:local .
  ```

### La imagen se construye pero no responde en http://localhost:8080

**Solución**:
1. Verifica que nginx está corriendo dentro del contenedor:
   ```bash
   docker run --rm -it perfilate-mvp:local sh
   ps aux | grep nginx
   # Deberías ver procesos nginx
   ```
2. Verifica el puerto:
   ```bash
   docker run --rm -p 8080:80 perfilate-mvp:local
   # En otra terminal
   curl http://localhost:8080
   ```

### Image muy grande (>500 MB)

**Solución**: El multi-stage build ya lo optimiza. Si sigue siendo grande, puedes usar `alpine` más agresivamente o pre-compilar node_modules en un volumen Docker.

---

## Tips y mejores prácticas

- **Caché**: El Dockerfile copia `package.json` / `package-lock.json` antes del resto del código para maximizar el caché de Docker.
- **Multi-stage**: La imagen final es solo nginx + archivos compilados (sin Node, sin node_modules).
- **Seguridad**: nginx en Alpine es ligero y seguro.
- **Variables de entorno**: Si Perfilate necesita env vars, puedes pasarlas en `docker run`:
  ```bash
  docker run -e MY_VAR=value -p 8080:80 perfilate-mvp:local
  ```
