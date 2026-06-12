## Generar `requirements.txt` para Docker / Render

Este repositorio contiene un pequeño script que genera un `requirements.txt` con las dependencias usadas por la app React (archivo `perfilate/package.json`) y las versiones concretas tomadas de `perfilate/package-lock.json`.

Pasos:

1. Asegúrate de tener Node.js y npm instalados.

2. Desde la carpeta raíz del repo, instala dependencias dentro de la carpeta `perfilate` (esto generará `package-lock.json` si aún no existe):

```bash
cd perfilate
npm install
cd ..
```

3. Ejecuta el script para generar `requirements.txt` en la raíz del repo:

```bash
node scripts/generate-requirements.js
```

4. El archivo `requirements.txt` contendrá líneas del estilo `paquete@version` y marcará las devDependencies.

Uso en Docker o Render:
- Puedes copiar `requirements.txt` dentro de tu contenedor o usarlo en pipelines para instalar versiones precisas o para documentar dependencias.
- Para instalar en un ambiente Node, lo correcto es usar `package.json` + `package-lock.json`. `requirements.txt` aquí es meramente informativo/para pasar a servicios que acepten una lista plana.

Notas:
- Si quieres que el script incluya transitive dependencies, podría extenderse para listarlas, pero por ahora solo lista las dependencias directas declaradas en `package.json` con las versiones resueltas en el lockfile.
- El script espera `perfilate/package-lock.json` con formato de npm (lockfileVersion >= 1).
