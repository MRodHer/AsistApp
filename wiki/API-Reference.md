# API Reference

Referencia de la API de AsistApp usando Supabase.

---

## Conexión

### Cliente JavaScript

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tu-proyecto.supabase.co',
  'tu-anon-key'
);
```

### REST API Directa

```
Base URL: https://tu-proyecto.supabase.co/rest/v1
Headers:
  apikey: tu-anon-key
  Authorization: Bearer tu-anon-key
  Content-Type: application/json
```

---

## Empleados

### Listar Empleados

```typescript
// Supabase JS
const { data, error } = await supabase
  .from('empleados')
  .select('*')
  .order('apellido_paterno');
```

```bash
# REST
GET /rest/v1/empleados?order=apellido_paterno
```

**Response**:
```json
[
  {
    "id": "uuid",
    "numero_empleado": "2024-0001",
    "nombre": "Juan",
    "apellido_paterno": "García",
    "apellido_materno": "López",
    "departamento": "Operaciones",
    "puesto": "Operador",
    "fecha_ingreso": "2024-01-15",
    "activo": true
  }
]
```

### Obtener Empleado por ID

```typescript
const { data, error } = await supabase
  .from('empleados')
  .select('*')
  .eq('id', 'uuid')
  .single();
```

```bash
GET /rest/v1/empleados?id=eq.uuid
```

### Buscar por Número

```typescript
const { data, error } = await supabase
  .from('empleados')
  .select('*')
  .eq('numero_empleado', '2024-0001')
  .eq('activo', true)
  .single();
```

### Crear Empleado

```typescript
const { data, error } = await supabase
  .from('empleados')
  .insert({
    numero_empleado: '2024-0002',
    nombre: 'María',
    apellido_paterno: 'Pérez',
    departamento: 'Administración',
    fecha_ingreso: '2024-02-01'
  });
```

```bash
POST /rest/v1/empleados
Content-Type: application/json

{
  "numero_empleado": "2024-0002",
  "nombre": "María",
  "apellido_paterno": "Pérez"
}
```

### Actualizar Empleado

```typescript
const { data, error } = await supabase
  .from('empleados')
  .update({ departamento: 'Ventas' })
  .eq('id', 'uuid');
```

```bash
PATCH /rest/v1/empleados?id=eq.uuid
Content-Type: application/json

{ "departamento": "Ventas" }
```

### Eliminar Empleado

```typescript
const { error } = await supabase
  .from('empleados')
  .delete()
  .eq('id', 'uuid');
```

```bash
DELETE /rest/v1/empleados?id=eq.uuid
```

---

## Asistencias

### Listar Asistencias

```typescript
const { data, error } = await supabase
  .from('asistencias')
  .select(`
    *,
    empleado:empleados(nombre, apellido_paterno, numero_empleado)
  `)
  .order('created_at', { ascending: false });
```

### Filtrar por Fecha

```typescript
const { data, error } = await supabase
  .from('asistencias')
  .select('*')
  .gte('fecha', '2024-02-01')
  .lte('fecha', '2024-02-28');
```

### Registrar Entrada

```typescript
const { data, error } = await supabase
  .from('asistencias')
  .insert({
    empleado_id: 'uuid-empleado',
    fecha: '2024-02-13',
    hora_entrada: '08:05:23',
    tipo_registro: 'entrada',
    metodo_registro: 'manual'
  });
```

### Registrar Salida

```typescript
const { data, error } = await supabase
  .from('asistencias')
  .insert({
    empleado_id: 'uuid-empleado',
    fecha: '2024-02-13',
    hora_salida: '17:03:45',
    tipo_registro: 'salida',
    metodo_registro: 'manual'
  });
```

### Contar Presentes Hoy

```typescript
const { data, error } = await supabase
  .from('asistencias')
  .select('empleado_id')
  .eq('fecha', new Date().toISOString().split('T')[0])
  .eq('tipo_registro', 'entrada');

const presentes = new Set(data.map(a => a.empleado_id)).size;
```

---

## Horarios

### Listar Horarios

```typescript
const { data, error } = await supabase
  .from('horarios')
  .select('*')
  .order('nombre');
```

### Crear Horario

```typescript
const { data, error } = await supabase
  .from('horarios')
  .insert({
    nombre: 'Turno Matutino',
    hora_entrada: '06:00',
    hora_salida: '14:00',
    tolerancia_minutos: 10,
    dias_laborales: [1, 2, 3, 4, 5, 6]
  });
```

### Actualizar Horario

```typescript
const { data, error } = await supabase
  .from('horarios')
  .update({
    tolerancia_minutos: 15
  })
  .eq('id', 'uuid');
```

---

## Dispositivos

### Listar Dispositivos

```typescript
const { data, error } = await supabase
  .from('dispositivos')
  .select('*')
  .order('nombre');
```

### Crear Dispositivo

```typescript
const { data, error } = await supabase
  .from('dispositivos')
  .insert({
    nombre: 'Checador Entrada',
    tipo: 'zkteco',
    ip_address: '192.168.1.100',
    puerto: 4370,
    ubicacion: 'Entrada principal'
  });
```

### Actualizar Última Sincronización

```typescript
const { data, error } = await supabase
  .from('dispositivos')
  .update({
    ultimo_sync: new Date().toISOString()
  })
  .eq('id', 'uuid');
```

---

## Queries Avanzadas

### Dashboard Stats

```typescript
const today = new Date().toISOString().split('T')[0];

// Total empleados activos
const { count: totalEmpleados } = await supabase
  .from('empleados')
  .select('id', { count: 'exact' })
  .eq('activo', true);

// Presentes hoy
const { data: asistencias } = await supabase
  .from('asistencias')
  .select('empleado_id')
  .eq('fecha', today)
  .eq('tipo_registro', 'entrada');

const presentesHoy = new Set(asistencias.map(a => a.empleado_id)).size;
const ausentesHoy = totalEmpleados - presentesHoy;
```

### Reporte Mensual

```typescript
const { data } = await supabase
  .from('asistencias')
  .select('*')
  .gte('fecha', '2024-02-01')
  .lte('fecha', '2024-02-29');

// Agrupar por empleado
const porEmpleado = data.reduce((acc, reg) => {
  if (!acc[reg.empleado_id]) acc[reg.empleado_id] = [];
  acc[reg.empleado_id].push(reg);
  return acc;
}, {});
```

---

## Manejo de Errores

### Estructura de Error

```typescript
const { data, error } = await supabase.from('empleados').select();

if (error) {
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  console.error('Details:', error.details);
}
```

### Errores Comunes

| Code | Descripción | Solución |
|------|-------------|----------|
| 23505 | Duplicate key | Valor único ya existe |
| 23503 | Foreign key violation | Referencia no existe |
| 42501 | Permission denied | Verificar RLS policies |
| PGRST116 | No rows found | single() sin resultados |

---

## Paginación

```typescript
// Primeros 10 registros
const { data } = await supabase
  .from('asistencias')
  .select('*')
  .range(0, 9);

// Siguientes 10
const { data: page2 } = await supabase
  .from('asistencias')
  .select('*')
  .range(10, 19);
```

---

## Navegación Relacionada

- [Base de Datos](Base-de-Datos.md) - Modelo de datos
- [Arquitectura](Arquitectura.md) - Estructura del sistema
