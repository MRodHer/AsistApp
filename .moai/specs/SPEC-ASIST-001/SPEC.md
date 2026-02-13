# SPEC-ASIST-001: Gestión de Empleados

## Metadata
- **ID**: SPEC-ASIST-001
- **Title**: Gestión de Empleados
- **Status**: Implemented
- **Priority**: High
- **Created**: 2026-02-13
- **Updated**: 2026-02-13

## Overview

Sistema de gestión de empleados para el control de asistencia. Permite registrar, editar y administrar la información de los trabajadores incluyendo datos personales, departamento, puesto y datos biométricos.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | El sistema DEBE permitir registrar nuevos empleados con número único | Must |
| FR-002 | El sistema DEBE almacenar nombre completo (nombre, apellido paterno, materno) | Must |
| FR-003 | El sistema DEBE permitir asignar departamento y puesto | Should |
| FR-004 | El sistema DEBE registrar fecha de ingreso | Must |
| FR-005 | El sistema DEBE permitir marcar empleados como activos/inactivos | Must |
| FR-006 | El sistema DEBE permitir subir foto del empleado | Should |
| FR-007 | El sistema DEBE almacenar IDs de huella y rostro para biométricos | Should |
| FR-008 | El sistema DEBE permitir búsqueda por nombre o número de empleado | Must |
| FR-009 | El sistema DEBE permitir editar información de empleados | Must |
| FR-010 | El sistema DEBE permitir eliminar empleados | Should |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | La lista debe cargar en menos de 2 segundos | Should |
| NFR-002 | La búsqueda debe ser instantánea (debounce 300ms) | Should |
| NFR-003 | La UI debe ser responsive (móvil/desktop) | Must |

## Data Model

```sql
CREATE TABLE empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    numero_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    departamento VARCHAR(100),
    puesto VARCHAR(100),
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    foto_url TEXT,
    huella_id VARCHAR(100),
    rostro_id VARCHAR(100)
);
```

## UI Components

### EmpleadosPage
- Tabla con columnas: Empleado, No. Empleado, Departamento, Puesto, Estado, Acciones
- Barra de búsqueda con icono
- Botón "Agregar Empleado"
- Badges de estado (Activo/Inactivo)

### EmpleadoModal
- Formulario con campos requeridos marcados
- Validación en cliente
- Botones Cancelar/Guardar

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /empleados | Lista todos los empleados |
| GET | /empleados/:id | Obtiene un empleado |
| POST | /empleados | Crea nuevo empleado |
| PATCH | /empleados/:id | Actualiza empleado |
| DELETE | /empleados/:id | Elimina empleado |

## Implementation Files

- `src/pages/Empleados.tsx` - Página principal y modal
- `src/types/database.ts` - Tipos TypeScript
- `supabase/migrations/001_initial_schema.sql` - Migración DB

## Test Cases

| ID | Description | Expected Result |
|----|-------------|-----------------|
| TC-001 | Crear empleado con datos válidos | Empleado creado, aparece en lista |
| TC-002 | Crear empleado con número duplicado | Error de duplicado |
| TC-003 | Buscar por nombre parcial | Resultados filtrados |
| TC-004 | Editar empleado existente | Datos actualizados |
| TC-005 | Desactivar empleado | Badge cambia a "Inactivo" |
