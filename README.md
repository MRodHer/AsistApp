# AsistApp - Sistema de Control de Asistencia

Sistema de control de asistencia para empleados con integración biométrica ZKTeco.

## Características

- **Checador Digital**: Registro de entrada/salida manual o biométrico
- **Gestión de Empleados**: CRUD completo con fotos y datos biométricos
- **Horarios Flexibles**: Configuración de turnos, tolerancias y días laborales
- **Reportes**: Análisis mensual de asistencia, retardos y faltas
- **Integración ZKTeco**: Soporte para lectores de huella y reconocimiento facial

## Stack Tecnológico

- React + TypeScript + Vite
- Tailwind CSS v4
- Supabase (PostgreSQL)
- TanStack Query
- React Router v6
- Lucide Icons
- date-fns

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Supabase

# Ejecutar migración en Supabase SQL Editor
# Ver: supabase/migrations/001_initial_schema.sql

# Desarrollo
npm run dev

# Build
npm run build
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Panel principal con estadísticas |
| `/empleados` | Gestión de empleados |
| `/asistencias` | Historial de registros |
| `/checador` | Pantalla standalone para registro |
| `/reportes` | Análisis y exportación |
| `/configuracion` | Horarios y dispositivos |

## Base de Datos

### Tablas
- `empleados` - Datos de trabajadores
- `asistencias` - Registros de entrada/salida
- `horarios` - Turnos de trabajo
- `empleado_horarios` - Asignación horario-empleado
- `dispositivos` - Lectores biométricos

## Dispositivos ZKTeco

| Modelo | Huella | Rostro |
|--------|--------|--------|
| ZK-F22 | ✅ | ✅ |
| ZK-MB160 | ✅ | ✅ |
| ZK-K40 | ✅ | ❌ |
| ZK-VF680 | ❌ | ✅ |

Puerto por defecto: 4370 (TCP/IP)

## Licencia

MIT
