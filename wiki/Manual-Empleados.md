# Manual de Gestión de Empleados

Guía completa para administrar el catálogo de empleados en AsistApp.

---

## Acceso

**URL**: `/empleados`

**Navegación**: Menú lateral → Empleados

---

## Vista General

### Barra de Herramientas

- **Búsqueda**: Campo de texto para filtrar por nombre o número
- **Botón "Agregar Empleado"**: Abre formulario de nuevo empleado

### Tabla de Empleados

| Columna | Descripción |
|---------|-------------|
| Empleado | Foto (si existe) + Nombre completo |
| No. Empleado | Identificador único |
| Departamento | Área de trabajo |
| Puesto | Cargo |
| Estado | Badge "Activo" (verde) o "Inactivo" (rojo) |
| Acciones | Botones de Editar y Eliminar |

---

## Operaciones

### Agregar Empleado

1. Click en **Agregar Empleado**
2. Completar formulario:

#### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| No. Empleado | Texto | ✅ | Identificador único. No puede duplicarse. |
| Nombre | Texto | ✅ | Nombre(s) del empleado |
| Apellido Paterno | Texto | ✅ | Primer apellido |
| Apellido Materno | Texto | ❌ | Segundo apellido |
| Departamento | Texto | ❌ | Área de trabajo |
| Puesto | Texto | ❌ | Cargo que desempeña |
| Fecha de Ingreso | Fecha | ✅ | Fecha de alta en la empresa |
| Empleado activo | Check | ✅ | Si puede registrar asistencia |

3. Click en **Guardar**

#### Validaciones

- **No. Empleado**: Debe ser único en todo el sistema
- **Nombre**: Mínimo 2 caracteres
- **Apellido Paterno**: Mínimo 2 caracteres

#### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Duplicate key" | Número de empleado ya existe | Usar otro número |
| Formulario no envía | Campo requerido vacío | Completar campos marcados con * |

---

### Editar Empleado

1. Localizar empleado en la tabla
2. Click en icono de **lápiz** (Editar)
3. Modificar campos necesarios
4. Click en **Guardar**

#### Campos Editables
- Todos los campos excepto el ID interno
- El número de empleado puede cambiarse si no hay duplicados

#### Cambiar Estado

Para desactivar un empleado:
1. Editar empleado
2. Desmarcar "Empleado activo"
3. Guardar

**Efecto**: El empleado no podrá registrar asistencia en el checador.

---

### Eliminar Empleado

1. Localizar empleado en la tabla
2. Click en icono de **papelera** (Eliminar)
3. Confirmar en el diálogo

#### Advertencias

⚠️ **Eliminación en cascada**: Al eliminar un empleado:
- Se eliminan TODOS sus registros de asistencia
- Se eliminan sus asignaciones de horario
- Esta acción NO se puede deshacer

#### Alternativa Recomendada

En lugar de eliminar, **desactivar** al empleado:
- Mantiene historial de asistencia
- Puede reactivarse en el futuro
- No afecta reportes históricos

---

### Buscar Empleados

El campo de búsqueda filtra por:
- Nombre completo (nombre + apellidos)
- Número de empleado

**Comportamiento**:
- Búsqueda instantánea mientras escribes
- No distingue mayúsculas/minúsculas
- Búsqueda parcial (ej: "gar" encuentra "García")

---

## Estructura de Datos

### Campos en Base de Datos

```sql
empleados (
    id              UUID        -- Identificador interno (auto)
    created_at      TIMESTAMP   -- Fecha de creación (auto)
    updated_at      TIMESTAMP   -- Última modificación (auto)
    numero_empleado VARCHAR(20) -- Número único
    nombre          VARCHAR(100)-- Nombre(s)
    apellido_paterno VARCHAR(100)
    apellido_materno VARCHAR(100)
    departamento    VARCHAR(100)
    puesto          VARCHAR(100)
    fecha_ingreso   DATE
    activo          BOOLEAN
    foto_url        TEXT        -- URL de foto (futuro)
    huella_id       VARCHAR(100)-- ID en dispositivo (futuro)
    rostro_id       VARCHAR(100)-- ID facial (futuro)
)
```

### Campos para Biométricos (Futuro)

| Campo | Uso |
|-------|-----|
| foto_url | Foto del empleado para identificación visual |
| huella_id | Identificador de huella en dispositivo ZKTeco |
| rostro_id | Identificador facial en dispositivo ZKTeco |

---

## Mejores Prácticas

### Nomenclatura de Números

**Recomendación**: Usar formato estructurado

```
Formato: [PREFIJO]-[AÑO]-[SECUENCIAL]

Ejemplos:
- EMP-2024-0001
- ADM-2024-0001
- OPE-2025-0001

Beneficios:
- Fácil identificar tipo de empleado
- Fácil identificar año de ingreso
- Secuencial para ordenamiento
```

### Departamentos Estándar

Definir catálogo consistente:
```
- Administración
- Operaciones
- Producción
- Ventas
- Almacén
- Mantenimiento
- Recursos Humanos
- Contabilidad
```

### Datos Completos

Aunque solo nombre y apellido paterno son obligatorios, se recomienda:
- ✅ Siempre incluir departamento (para reportes)
- ✅ Siempre incluir puesto (para organigrama)
- ✅ Fecha de ingreso correcta (para antigüedad)

---

## Integración con Otros Módulos

### Con Checador
- Solo empleados **activos** pueden registrar asistencia
- El número de empleado es lo que ingresan en el checador

### Con Horarios
- Los empleados se asignan a horarios (tabla empleado_horarios)
- Sin horario asignado, no se calculan retardos

### Con Reportes
- Solo empleados activos aparecen en reportes
- Histórico incluye empleados inactivos

---

## Preguntas Frecuentes

### ¿Puedo tener dos empleados con el mismo nombre?

Sí, siempre que tengan diferente número de empleado.

### ¿Qué pasa si cambio el número de empleado?

- Los registros de asistencia se mantienen (usan ID interno)
- El empleado debe usar el nuevo número en el checador

### ¿Cómo reactivo un empleado?

1. Editar empleado
2. Marcar "Empleado activo"
3. Guardar

### ¿Puedo importar empleados desde Excel?

No en esta versión. Está planificado para futuras versiones.

---

## Navegación Relacionada

- [Checador](Manual-Checador.md) - Donde los empleados registran
- [Horarios](Manual-Horarios.md) - Asignación de turnos
- [Asistencias](Manual-Asistencias.md) - Historial de registros
