# AsistApp - Sistema de Control de Asistencia

## Descripción
Sistema de control de asistencia para empleados con integración biométrica ZKTeco. Permite registrar entradas/salidas, gestionar horarios y generar reportes.

## Stack Tecnológico
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **State**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Dates**: date-fns

## Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
│   └── Layout.tsx   # Layout principal con sidebar
├── lib/
│   └── supabase.ts  # Cliente Supabase
├── pages/           # Páginas de la aplicación
│   ├── Dashboard.tsx      # Estadísticas y últimos registros
│   ├── Empleados.tsx      # CRUD de empleados
│   ├── Asistencias.tsx    # Historial de registros
│   ├── Checador.tsx       # Pantalla de check-in/out
│   ├── Reportes.tsx       # Reportes mensuales
│   └── Configuracion.tsx  # Horarios y dispositivos
├── types/
│   └── database.ts  # Tipos TypeScript
└── App.tsx          # Router principal
```

## Rutas
- `/dashboard` - Panel principal
- `/empleados` - Gestión de empleados
- `/asistencias` - Historial de registros
- `/checador` - Pantalla standalone para registro
- `/reportes` - Análisis y exportación
- `/configuracion` - Horarios y dispositivos

## Base de Datos

### Tablas
- `empleados` - Datos de trabajadores
- `asistencias` - Registros de entrada/salida
- `horarios` - Turnos de trabajo
- `empleado_horarios` - Asignación horario-empleado
- `dispositivos` - Lectores biométricos

### Migración
```bash
# Ejecutar en Supabase SQL Editor
supabase/migrations/001_initial_schema.sql
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Configuración

### Variables de Entorno (.env)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## SPECs

| ID | Título | Estado |
|----|--------|--------|
| SPEC-ASIST-001 | Gestión de Empleados | Implemented |
| SPEC-ASIST-002 | Sistema de Checador | Implemented |
| SPEC-ASIST-003 | Gestión de Horarios | Implemented |
| SPEC-ASIST-004 | Integración ZKTeco | Planned |
| SPEC-ASIST-005 | Reportes y Análisis | Implemented |

## Colores del Tema
- Primary: `#2563eb` (Azul)
- Secondary: `#1e40af` (Azul oscuro)
- Success: `#16a34a` (Verde)
- Warning: `#f59e0b` (Naranja)
- Danger: `#dc2626` (Rojo)

## Dispositivos ZKTeco
- Puerto por defecto: 4370
- Protocolo: TCP/IP
- Modelos soportados: ZK-F22, ZK-MB160, ZK-K40, ZK-VF680
