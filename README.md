# FARE AI Analytics - Simulaciones Interactivas

Aplicación web independiente con 3 simulaciones predictivas: Churn, Ventas y Leads. Construida con React, TypeScript, Tailwind CSS y Framer Motion.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- npm o pnpm

### Instalación Local

```bash
# Clonar o descargar el proyecto
cd fare-ai-export

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`. Este es el contenido que debes desplegar.

---

## 📦 Opciones de Despliegue

### 1. **Vercel** (Recomendado - Más fácil)

Vercel es la forma más rápida de desplegar una aplicación Vite. Es gratis para proyectos públicos.

**Pasos:**
1. Sube tu proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en "New Project"
4. Selecciona tu repositorio
5. Vercel detectará automáticamente que es un proyecto Vite
6. Haz clic en "Deploy"

Tu sitio estará en vivo en minutos con una URL como `https://tu-proyecto.vercel.app`

**Ventajas:**
- Despliegue automático con cada push a GitHub
- SSL gratis
- Dominio personalizado gratis
- CDN global

---

### 2. **Netlify**

Similar a Vercel, muy fácil de usar.

**Pasos:**
1. Sube tu proyecto a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Haz clic en "New site from Git"
4. Selecciona tu repositorio
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Haz clic en "Deploy site"

---

### 3. **Railway**

Plataforma moderna para desplegar aplicaciones.

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Crea una nueva cuenta
3. Conecta tu repositorio de GitHub
4. Railway detectará automáticamente el tipo de proyecto
5. Configura las variables de entorno si es necesario
6. Haz clic en "Deploy"

---

### 4. **Tu Propio Servidor (VPS)**

Si tienes un servidor (AWS, DigitalOcean, Linode, etc.):

**Opción A: Servir archivos estáticos**

```bash
# En tu servidor
cd /var/www/fare-ai

# Copiar los archivos compilados
scp -r dist/* usuario@tu-servidor:/var/www/fare-ai/

# Configurar Nginx
sudo nano /etc/nginx/sites-available/fare-ai
```

Configuración Nginx:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/fare-ai;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Luego:
```bash
sudo systemctl restart nginx
```

**Opción B: Con Node.js (si quieres agregar un backend)**

```bash
# Instalar PM2 para mantener la app corriendo
npm install -g pm2

# En tu servidor
cd /var/www/fare-ai
npm install
npm run build

# Iniciar con PM2
pm2 start "npm run preview" --name "fare-ai"
pm2 startup
pm2 save
```

---

### 5. **Docker** (Para máxima portabilidad)

Crea un archivo `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Luego:
```bash
docker build -t fare-ai .
docker run -p 80:80 fare-ai
```

---

## 🛠️ Estructura del Proyecto

```
fare-ai-export/
├── src/
│   ├── pages/                    # Páginas principales
│   │   ├── Home.tsx             # Landing page
│   │   ├── ChurnSimulation.tsx   # Caso 1: Predicción de churn
│   │   ├── SalesSimulation.tsx   # Caso 2: Forecast de ventas
│   │   ├── LeadsSimulation.tsx   # Caso 3: Priorización de leads
│   │   └── NotFound.tsx          # Página 404
│   ├── components/              # Componentes reutilizables
│   │   ├── AppLayout.tsx        # Layout principal con sidebar
│   │   ├── SimulationHeader.tsx  # Header de cada simulación
│   │   ├── PredictionLoader.tsx  # Animación de carga
│   │   ├── ResultCard.tsx        # Card de resultados
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx      # Tema claro/oscuro
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilidades
│   ├── App.tsx                  # Rutas principales
│   ├── main.tsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── index.html                   # HTML principal
├── package.json                 # Dependencias
├── vite.config.ts               # Configuración Vite
├── tsconfig.json                # Configuración TypeScript
└── dist/                        # Compilado (se genera con `npm run build`)
```

---

## 🎨 Personalización

### Cambiar colores

Edita `src/index.css` en la sección `:root`:

```css
:root {
  --primary: oklch(0.623 0.214 259.815);  /* Color principal */
  --accent: oklch(0.967 0.001 286.375);   /* Color de acentos */
  /* ... más variables */
}
```

### Cambiar textos

Los textos están en los archivos de las páginas:
- `src/pages/Home.tsx` - Descripción de los casos
- `src/pages/ChurnSimulation.tsx` - Textos del caso Churn
- `src/pages/SalesSimulation.tsx` - Textos del caso Ventas
- `src/pages/LeadsSimulation.tsx` - Textos del caso Leads

### Agregar tu logo

Reemplaza el logo en `src/components/AppLayout.tsx`:

```tsx
<img src="tu-logo.png" alt="Logo" className="w-8 h-8" />
```

---

## 📊 Características

- ✅ 3 simulaciones interactivas (Churn, Ventas, Leads)
- ✅ Interfaz moderna con glassmorphism y animaciones
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tema claro/oscuro
- ✅ Predicciones en tiempo real
- ✅ Recomendaciones accionables
- ✅ Visualización de resultados con gráficos

---

## 🔧 Desarrollo

### Agregar una nueva página

1. Crea un archivo en `src/pages/MiPagina.tsx`
2. Importa en `src/App.tsx`
3. Agrega la ruta:

```tsx
<Route path="/mi-pagina" component={MiPagina} />
```

### Agregar un nuevo componente

1. Crea el archivo en `src/components/MiComponente.tsx`
2. Importa donde lo necesites

### Usar componentes shadcn/ui

Todos los componentes shadcn/ui ya están disponibles en `src/components/ui/`. Úsalos así:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MiComponente() {
  return (
    <Card>
      <Button>Haz clic</Button>
    </Card>
  );
}
```

---

## 📱 Variables de Entorno

Si necesitas agregar variables de entorno, crea un archivo `.env`:

```
VITE_API_URL=https://api.ejemplo.com
VITE_APP_NAME=FARE AI
```

Úsalas en el código:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🚨 Solución de Problemas

### "Port 3000 is already in use"

```bash
# En macOS/Linux
lsof -i :3000
kill -9 <PID>

# O usa otro puerto
npm run dev -- --port 3001
```

### "Module not found"

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Build falla

```bash
# Verifica que TypeScript está correcto
npm run check

# Limpia y reconstruye
rm -rf dist
npm run build
```

---

## 📞 Soporte

Para más información sobre:
- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

---

## 📄 Licencia

MIT - Libre para usar en proyectos comerciales y personales.

---

**¿Preguntas?** Revisa la documentación de Vite o React, o consulta los archivos de configuración.
