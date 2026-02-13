# Manual de Consulta de Asistencias

Guía para consultar, filtrar y exportar el historial de registros de asistencia.

---

## Acceso

**URL**: `/asistencias`

**Navegación**: Menú lateral → Asistencias

---

## Vista General

### Barra de Filtros

| Filtro | Descripción |
|--------|-------------|
| Búsqueda | Filtrar por nombre o número de empleado |
| Período | Hoy / Esta semana / Este mes / Personalizado |
| Fecha desde | Fecha inicial (modo personalizado) |
| Fecha hasta | Fecha final (modo personalizado) |

### Botón Exportar

- **Ubicación**: Esquina superior derecha
- **Acción**: Descarga archivo CSV con los datos filtrados

### Tabla de Registros

| Columna | Descripción |
|---------|-------------|
| Fecha | Día del registro |
| Empleado | Nombre + Número |
| Departamento | Área del empleado |
| Tipo | Badge "Entrada" o "Salida" |
| Hora | Hora exacta del registro |
| Método | manual / huella / rostro |

---

## Filtros de Período

### Hoy
Muestra solo registros del día actual.

### Esta Semana
Muestra registros de lunes a domingo de la semana actual.

### Este Mes
Muestra registros del 1 al último día del mes actual.

### Personalizado
Permite seleccionar rango de fechas específico:
1. Seleccionar "Personalizado" en el dropdown
2. Aparecen dos campos de fecha
3. Seleccionar fecha inicial
4. Seleccionar fecha final
5. Los datos se filtran automáticamente

---

## Búsqueda

### Campos de Búsqueda
- Nombre completo del empleado
- Número de empleado

### Comportamiento
- Búsqueda instantánea mientras escribes
- No distingue mayúsculas/minúsculas
- Búsqueda parcial ("gar" encuentra "García")
- Combina con el filtro de período activo

### Ejemplos

| Búsqueda | Encuentra |
|----------|-----------|
| "juan" | Juan García, Juan Pérez, Juanita López |
| "2024-001" | Empleado con número 2024-001 |
| "ops" | Empleados con "ops" en nombre o número |

---

## Exportación CSV

### Proceso

1. Aplicar filtros deseados
2. Click en **Exportar CSV**
3. Se descarga archivo automáticamente

### Nombre del Archivo

```
asistencias_YYYY-MM-DD_YYYY-MM-DD.csv
```
Ejemplo: `asistencias_2026-02-01_2026-02-13.csv`

### Contenido del CSV

```csv
Fecha,Empleado,No. Empleado,Departamento,Tipo,Hora,Método
2026-02-13,Juan García López,2024-0001,Operaciones,entrada,08:05:23,manual
2026-02-13,María Pérez Soto,2024-0002,Administración,entrada,08:12:45,manual
...
```

### Columnas Exportadas

| Columna | Formato |
|---------|---------|
| Fecha | YYYY-MM-DD |
| Empleado | Nombre Apellido |
| No. Empleado | Como está registrado |
| Departamento | Texto o vacío |
| Tipo | entrada / salida |
| Hora | HH:MM:SS |
| Método | manual / huella / rostro |

---

## Interpretación de Datos

### Registro Normal

```
Juan García - Entrada 08:05 - Salida 17:03
```
El empleado cumplió su jornada.

### Sin Salida

```
Juan García - Entrada 08:05 - (sin salida)
```
Posibles causas:
- Olvidó registrar salida
- Aún está trabajando
- Error de sistema

### Sin Entrada

```
Juan García - (sin entrada) - Salida 17:03
```
Posibles causas:
- Olvidó registrar entrada
- Error de sistema
- Llegó antes de que abriera el sistema

### Múltiples Registros

```
Juan García - Entrada 08:05
Juan García - Salida 12:00
Juan García - Entrada 13:00
Juan García - Salida 17:05
```
Normal si el empleado tiene horario con descanso (ej: salir a comer).

---

## Casos de Uso

### 1. Verificar Asistencia del Día

1. Abrir Asistencias
2. Filtro: "Hoy"
3. Revisar lista de registros
4. Identificar faltantes

### 2. Auditoría de Empleado Específico

1. Abrir Asistencias
2. Filtro: "Este mes" o rango personalizado
3. Buscar nombre o número del empleado
4. Analizar patrón de registros

### 3. Reporte para Nómina

1. Abrir Asistencias
2. Filtro: Rango de fechas del período de nómina
3. Click en Exportar CSV
4. Abrir CSV en Excel
5. Procesar según necesidades de nómina

### 4. Detectar Irregularidades

Buscar patrones anómalos:
- Entradas muy tardías recurrentes
- Salidas muy tempranas
- Días sin entrada ni salida
- Registros en horarios inusuales

---

## Limitaciones Actuales

| Limitación | Impacto | Workaround |
|------------|---------|------------|
| No hay paginación | Lento con muchos registros | Usar filtros de fecha |
| No hay ordenamiento | Siempre por fecha desc | Ordenar en Excel |
| No hay edición | No se pueden corregir registros | Editar en Supabase |
| No hay eliminación | No se pueden borrar errores | Eliminar en Supabase |

---

## Registro Manual (Admin)

Si necesitas agregar un registro manualmente:

### Via Supabase Dashboard

1. Ir a Supabase → Table Editor → asistencias
2. Click en "Insert row"
3. Completar:
   - `empleado_id`: UUID del empleado (buscar en tabla empleados)
   - `fecha`: YYYY-MM-DD
   - `hora_entrada` o `hora_salida`: HH:MM:SS
   - `tipo_registro`: 'entrada' o 'salida'
   - `metodo_registro`: 'manual'
   - `notas`: Razón del registro manual
4. Save

### Ejemplo de Nota

```
Registro manual por olvido de checada. Autorizado por [Nombre Admin].
```

---

## Preguntas Frecuentes

### ¿Por qué no veo registros de hoy?

- Verificar que el filtro sea "Hoy"
- Verificar que el empleado haya registrado
- Recargar la página

### ¿Puedo ver registros de empleados inactivos?

Sí, los registros históricos se mantienen aunque el empleado esté inactivo.

### ¿El CSV se puede abrir en Excel?

Sí, Excel reconoce el formato CSV automáticamente.

### ¿Hay límite de registros a exportar?

No hay límite, pero exportaciones muy grandes pueden tardar.

---

## Navegación Relacionada

- [Dashboard](Manual-Dashboard.md) - Vista rápida del día
- [Reportes](Manual-Reportes.md) - Análisis mensual
- [Empleados](Manual-Empleados.md) - Ver datos de empleados
