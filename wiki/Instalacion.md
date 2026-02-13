# Instalación

## Requisitos del Sistema

### Software
| Componente | Versión Mínima | Recomendada |
|------------|----------------|-------------|
| Node.js | 18.x | 20.x |
| npm | 9.x | 10.x |
| Git | 2.x | 2.40+ |

### Servicios
- Cuenta en [Supabase](https://supabase.com) (gratuita o de pago)
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Hardware (para dispositivos biométricos)
- Lector ZKTeco compatible (ver [Dispositivos Soportados](Manual-Dispositivos.md#dispositivos-soportados))
- Red local con acceso TCP/IP al dispositivo

---

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MRodHer/AsistApp.git
cd AsistApp
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React 18
- TypeScript 5
- Tailwind CSS 4
- Supabase JS Client
- TanStack Query
- React Router
- Lucide Icons
- date-fns

### 3. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear cuenta
2. Click en "New Project"
3. Configurar:
   - **Name**: AsistApp
   - **Database Password**: (guardar en lugar seguro)
   - **Region**: Seleccionar la más cercana
4. Esperar a que se cree el proyecto (~2 minutos)

### 4. Ejecutar Migración de Base de Datos

1. En Supabase Dashboard, ir a **SQL Editor**
2. Click en "New Query"
3. Copiar contenido de `supabase/migrations/001_initial_schema.sql`
4. Click en "Run"

**Verificar que se crearon las tablas:**
- `empleados`
- `asistencias`
- `horarios`
- `empleado_horarios`
- `dispositivos`

### 5. Obtener Credenciales de Supabase

1. Ir a **Settings** → **API**
2. Copiar:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public key** (ej: `eyJhbGciOiJIUzI1NiIs...`)

### 6. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir navegador en `http://localhost:5173`

---

## Build para Producción

### Generar Build

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos.

### Vista Previa del Build

```bash
npm run preview
```

---

## Despliegue

### Opción 1: Nginx

```nginx
server {
    listen 80;
    server_name asistapp.tudominio.com;
    root /var/www/asistapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Opción 2: Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Opción 3: Vercel/Netlify

1. Conectar repositorio de GitHub
2. Configurar variables de entorno en el dashboard
3. Deploy automático en cada push

---

## Verificación de Instalación

Checklist post-instalación:

- [ ] La aplicación carga sin errores en consola
- [ ] El dashboard muestra "0 empleados"
- [ ] Se puede acceder a `/checador`
- [ ] La configuración de horarios está disponible
- [ ] El horario "Estándar" aparece creado

Si algo falla, ver [Troubleshooting](Troubleshooting.md).
