# Arquitectura del Sistema

Documentación técnica de la arquitectura de AsistApp.

---

## Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Browser   │  │   Tablet    │  │   Kiosko    │              │
│  │   (Admin)   │  │  (Checador) │  │  (Checador) │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     React SPA (Vite)                        ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           ││
│  │  │Dashboard│ │Empleados│ │Checador │ │Reportes │           ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Supabase JS Client
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE DATOS                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Supabase Cloud                           ││
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐               ││
│  │  │ PostgreSQL│  │   Auth    │  │  Storage  │               ││
│  │  │ Database  │  │  (futuro) │  │  (futuro) │               ││
│  │  └───────────┘  └───────────┘  └───────────┘               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ TCP/IP (futuro)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DISPOSITIVOS                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   ZKTeco    │  │   ZKTeco    │  │   Cámara    │              │
│  │   Huella    │  │   Rostro    │  │     IP      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool |
| Tailwind CSS | 4.x | Estilos |
| TanStack Query | 5.x | Data fetching |
| React Router | 6.x | Routing |
| Lucide React | Latest | Iconografía |
| date-fns | Latest | Manejo de fechas |

### Backend

| Tecnología | Propósito |
|------------|-----------|
| Supabase | BaaS (Backend as a Service) |
| PostgreSQL | Base de datos relacional |
| PostgREST | API REST automática |

### Infraestructura

| Servicio | Propósito |
|----------|-----------|
| Nginx | Servidor web estático |
| Docker | Contenedorización |
| GitHub | Control de versiones |

---

## Estructura del Proyecto

```
AsistApp/
├── public/                 # Assets estáticos
│   └── vite.svg
├── src/
│   ├── components/         # Componentes reutilizables
│   │   └── Layout.tsx      # Layout principal con sidebar
│   ├── lib/
│   │   └── supabase.ts     # Cliente Supabase
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Empleados.tsx
│   │   ├── Asistencias.tsx
│   │   ├── Checador.tsx
│   │   ├── Reportes.tsx
│   │   └── Configuracion.tsx
│   ├── types/
│   │   └── database.ts     # Tipos TypeScript
│   ├── App.tsx             # Router principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globales + Tailwind
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── wiki/                   # Documentación
├── .moai/                  # MoAI ADK specs
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Flujo de Datos

### Registro de Asistencia

```
1. Empleado ingresa número
         │
         ▼
2. Checador.tsx envía request
         │
         ▼
3. Supabase client ejecuta query
   ┌─────────────────────────────────────┐
   │ SELECT * FROM empleados             │
   │ WHERE numero_empleado = ? AND activo│
   └─────────────────────────────────────┘
         │
         ▼
4. Si existe, INSERT en asistencias
   ┌─────────────────────────────────────┐
   │ INSERT INTO asistencias             │
   │ (empleado_id, fecha, hora, tipo)    │
   │ VALUES (?, now(), now(), 'entrada') │
   └─────────────────────────────────────┘
         │
         ▼
5. Retorna resultado a UI
         │
         ▼
6. UI muestra confirmación
```

### Carga de Dashboard

```
1. Usuario navega a /dashboard
         │
         ▼
2. useQuery hooks se ejecutan en paralelo
   ┌────────────────┐  ┌────────────────┐
   │ Query: stats   │  │ Query: últimos │
   │ - Empleados    │  │ - Registros    │
   │ - Presentes    │  │ - Con empleado │
   │ - Ausentes     │  │ - Ordenados    │
   └────────────────┘  └────────────────┘
         │                    │
         ▼                    ▼
3. TanStack Query maneja cache
         │
         ▼
4. Componentes renderizan datos
```

---

## Patrones de Diseño

### Component Pattern

```typescript
// Página con datos
function Dashboard() {
  const { data, isLoading } = useQuery({...});

  if (isLoading) return <Loading />;

  return (
    <div>
      <StatCards data={data} />
      <RecentList data={data} />
    </div>
  );
}
```

### Query Pattern

```typescript
// Hook de query reutilizable
const { data: empleados } = useQuery({
  queryKey: ['empleados'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('empleados')
      .select('*')
      .eq('activo', true);
    if (error) throw error;
    return data;
  },
});
```

### Mutation Pattern

```typescript
// Mutación con invalidación
const mutation = useMutation({
  mutationFn: async (data) => {
    const { error } = await supabase
      .from('empleados')
      .insert(data);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['empleados']);
  },
});
```

---

## Routing

### Estructura de Rutas

```typescript
<Routes>
  {/* Standalone - sin layout */}
  <Route path="/checador" element={<Checador />} />

  {/* Con layout (sidebar) */}
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="empleados" element={<Empleados />} />
    <Route path="asistencias" element={<Asistencias />} />
    <Route path="reportes" element={<Reportes />} />
    <Route path="configuracion" element={<Configuracion />} />
  </Route>
</Routes>
```

### Layout Component

```typescript
function Layout() {
  return (
    <div className="min-h-screen">
      <Sidebar />        {/* Navegación lateral */}
      <main>
        <Outlet />       {/* Contenido de la ruta */}
      </main>
    </div>
  );
}
```

---

## Estado de la Aplicación

### TanStack Query (Server State)

```
┌─────────────────────────────────────────┐
│           TanStack Query Cache          │
├─────────────────────────────────────────┤
│ ['empleados']      → Lista de empleados │
│ ['asistencias', date] → Registros       │
│ ['horarios']       → Horarios           │
│ ['dispositivos']   → Dispositivos       │
│ ['dashboard-stats'] → Estadísticas      │
└─────────────────────────────────────────┘
```

### Estado Local (React State)

```typescript
// Estado de UI local
const [searchTerm, setSearchTerm] = useState('');
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState(null);
```

---

## Seguridad

### Actual

| Aspecto | Estado |
|---------|--------|
| HTTPS | ✅ Recomendado en producción |
| Auth | ⏳ No implementado |
| RLS | ⏳ No implementado |
| CORS | ✅ Manejado por Supabase |

### Futuro

| Mejora | Prioridad |
|--------|-----------|
| Autenticación usuarios | Alta |
| Row Level Security | Alta |
| Roles y permisos | Media |
| Audit logs | Baja |

---

## Performance

### Optimizaciones Actuales

- **Code Splitting**: Vite divide el bundle automáticamente
- **Query Caching**: TanStack Query cachea respuestas
- **Stale Time**: 5 minutos para reducir requests

### Métricas Objetivo

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| First Paint | < 1s | ~0.5s |
| Time to Interactive | < 2s | ~1.5s |
| Bundle Size | < 500KB | ~500KB |

---

## Despliegue

### Build

```bash
npm run build
# Output: dist/
```

### Opciones de Hosting

| Opción | Costo | Complejidad |
|--------|-------|-------------|
| Vercel | Gratis | Baja |
| Netlify | Gratis | Baja |
| Nginx + VPS | $5-20/mes | Media |
| Docker + Cloud | Variable | Alta |

---

## Navegación Relacionada

- [Base de Datos](Base-de-Datos.md) - Modelo de datos
- [API Reference](API-Reference.md) - Endpoints
- [Integración ZKTeco](Integracion-ZKTeco.md) - Biométricos
