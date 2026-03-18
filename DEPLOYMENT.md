# Guía de Despliegue - FARE AI Analytics

## Opción Recomendada: Vercel (5 minutos)

Vercel es la forma más rápida y fácil de desplegar esta aplicación Vite.

### Paso 1: Preparar tu código

```bash
# Asegúrate de que el proyecto está en un repositorio Git
git init
git add .
git commit -m "Initial commit"
```

### Paso 2: Subir a GitHub

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio
2. Sigue las instrucciones para subir tu código:

```bash
git remote add origin https://github.com/tu-usuario/fare-ai.git
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" y selecciona "Continue with GitHub"
3. Autoriza a Vercel acceder a tus repositorios
4. Haz clic en "New Project"
5. Selecciona el repositorio `fare-ai`
6. Vercel detectará automáticamente que es un proyecto Vite
7. Haz clic en "Deploy"

**¡Listo!** Tu sitio estará en vivo en una URL como `https://fare-ai.vercel.app`

---

## Opción 2: Netlify (5 minutos)

Alternativa muy similar a Vercel.

### Pasos:

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up" → "GitHub"
3. Autoriza Netlify
4. Haz clic en "New site from Git"
5. Selecciona tu repositorio `fare-ai`
6. Verifica que los settings sean:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Haz clic en "Deploy site"

**¡Listo!** Tu sitio estará en vivo en unos minutos.

---

## Opción 3: Railway (10 minutos)

Plataforma moderna con buena integración con GitHub.

### Pasos:

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway y selecciona tu repositorio
5. Railway detectará automáticamente el tipo de proyecto
6. Configura las variables de entorno si es necesario
7. Haz clic en "Deploy"

---

## Opción 4: Servidor Propio (VPS)

Si tienes un servidor en AWS, DigitalOcean, Linode, etc.

### Requisito: Tener SSH acceso a tu servidor

```bash
# Desde tu máquina local
ssh usuario@tu-servidor.com
```

### Método A: Servir archivos estáticos con Nginx (Recomendado)

**En tu máquina local:**

```bash
# Compilar la aplicación
npm run build

# Copiar archivos al servidor
scp -r dist/* usuario@tu-servidor.com:/var/www/fare-ai/
```

**En tu servidor:**

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Crear directorio si no existe
sudo mkdir -p /var/www/fare-ai

# Cambiar permisos
sudo chown -R www-data:www-data /var/www/fare-ai

# Crear configuración Nginx
sudo nano /etc/nginx/sites-available/fare-ai
```

Pega esto en el editor:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/fare-ai;
    index index.html;

    # Redirigir todas las rutas a index.html (para React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache agresivo para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;
}
```

Luego:

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/fare-ai /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

**Agregar SSL (HTTPS) con Let's Encrypt:**

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo systemctl enable certbot.timer
```

---

### Método B: Desplegar con Node.js (si quieres agregar backend después)

**En tu máquina local:**

```bash
# Compilar
npm run build

# Copiar todo el proyecto
scp -r . usuario@tu-servidor.com:/var/www/fare-ai/
```

**En tu servidor:**

```bash
ssh usuario@tu-servidor.com

cd /var/www/fare-ai

# Instalar dependencias
npm install

# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación
pm2 start "npm run preview" --name "fare-ai"

# Hacer que PM2 se inicie automáticamente
pm2 startup
pm2 save

# Ver logs
pm2 logs fare-ai
```

**Configurar Nginx como proxy:**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Opción 5: Docker

Si tienes Docker instalado:

### Crear Dockerfile

Crea un archivo llamado `Dockerfile` en la raíz del proyecto:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Crear nginx.conf

Crea un archivo `nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### Construir y ejecutar

```bash
# Construir imagen
docker build -t fare-ai .

# Ejecutar contenedor
docker run -p 80:80 fare-ai

# Acceder en http://localhost
```

### Desplegar en servicios Docker

- **Docker Hub**: Sube tu imagen a Docker Hub
- **AWS ECS**: Usa tu imagen en Amazon ECS
- **Google Cloud Run**: Despliega en Google Cloud
- **Heroku**: Usa Docker en Heroku

---

## Dominio Personalizado

### En Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio
4. Sigue las instrucciones para actualizar DNS

### En Netlify

1. Ve a tu sitio en Netlify
2. Settings → Domain management
3. Agrega tu dominio
4. Sigue las instrucciones para actualizar DNS

### En servidor propio

Actualiza los DNS de tu dominio para que apunten a la IP de tu servidor:

```
A record: tu-dominio.com → tu-ip-servidor
CNAME: www.tu-dominio.com → tu-dominio.com
```

---

## Actualizar después del despliegue

### Con Vercel/Netlify

Solo haz push a GitHub y se desplegará automáticamente:

```bash
git add .
git commit -m "Actualización"
git push origin main
```

### Con servidor propio

```bash
# Compilar localmente
npm run build

# Copiar nuevos archivos
scp -r dist/* usuario@tu-servidor.com:/var/www/fare-ai/

# O si usas PM2
ssh usuario@tu-servidor.com
cd /var/www/fare-ai
git pull origin main
npm install
npm run build
pm2 restart fare-ai
```

---

## Monitoreo

### Vercel

- Dashboard automático con analytics
- Alertas de errores
- Performance monitoring

### Netlify

- Logs de build
- Alertas de deploy
- Analytics

### Servidor propio

```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log

# Ver logs de PM2
pm2 logs fare-ai

# Monitorear recursos
htop
```

---

## Troubleshooting

### "Build failed"

```bash
# Verifica que todo compila localmente
npm run build

# Si hay errores de TypeScript
npm run check

# Limpia y reinstala
rm -rf node_modules
npm install
```

### "Sitio no carga"

- Verifica que DNS está configurado correctamente
- Espera 24-48 horas para propagación de DNS
- Limpia caché del navegador (Ctrl+Shift+Del)

### "Errores 404 en rutas"

Asegúrate de que tu servidor está configurado para servir `index.html` para todas las rutas (ya está configurado en los ejemplos arriba).

---

¿Necesitas ayuda con algún paso específico? Revisa la documentación de tu proveedor de hosting.
