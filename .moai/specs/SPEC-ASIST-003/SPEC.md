# SPEC-ASIST-003: Gestión de Horarios

## Metadata
- **ID**: SPEC-ASIST-003
- **Title**: Gestión de Horarios de Trabajo
- **Status**: Implemented
- **Priority**: High
- **Created**: 2026-02-13
- **Updated**: 2026-02-13

## Overview

Sistema de configuración de horarios de trabajo. Permite definir turnos con horas de entrada/salida, tolerancia para retardos, y días laborales. Los horarios se asignan a empleados para calcular asistencia, retardos y faltas.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | El sistema DEBE permitir crear horarios con nombre identificador | Must |
| FR-002 | El sistema DEBE permitir definir hora de entrada | Must |
| FR-003 | El sistema DEBE permitir definir hora de salida | Must |
| FR-004 | El sistema DEBE permitir configurar tolerancia en minutos | Must |
| FR-005 | El sistema DEBE permitir seleccionar días laborales (Dom-Sáb) | Must |
| FR-006 | El sistema DEBE permitir activar/desactivar horarios | Should |
| FR-007 | El sistema DEBE permitir editar horarios existentes | Must |
| FR-008 | El sistema DEBE permitir eliminar horarios | Should |
| FR-009 | El sistema DEBE mostrar días laborales de forma visual | Should |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | La interfaz debe ser intuitiva sin capacitación | Should |
| NFR-002 | Los cambios deben guardarse en menos de 1 segundo | Should |

## Data Model

```sql
-- Horarios de trabajo
CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    dias_laborales INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 0=Dom, 1=Lun, ..., 6=Sáb
    activo BOOLEAN DEFAULT true
);

-- Asignación de horario a empleado
CREATE TABLE empleado_horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE,
    horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    UNIQUE(empleado_id, fecha_inicio)
);
```

## UI Components

### HorariosSection (en Configuración)
- Lista de horarios con detalles
- Badges visuales para días laborales
- Indicador de estado activo/inactivo
- Botones de edición y eliminación

### HorarioModal
- Campo nombre del horario
- Selectores de tiempo para entrada/salida
- Input numérico para tolerancia
- Selector visual de días (botones toggle)
- Checkbox de activo

## Horarios Predeterminados

```
Horario Estándar:
- Entrada: 08:00
- Salida: 17:00
- Tolerancia: 15 minutos
- Días: Lunes a Viernes
```

## Cálculo de Retardos

```
SI hora_registro > (hora_entrada + tolerancia_minutos)
ENTONCES es_retardo = true
```

## Implementation Files

- `src/pages/Configuracion.tsx` - Sección HorariosSection
- `supabase/migrations/001_initial_schema.sql` - Tablas horarios y empleado_horarios

## Future Enhancements

### Horarios Rotativos
- Soporte para turnos que cambian semanalmente
- Calendario de asignaciones

### Horarios Flexibles
- Rango de entrada permitido
- Horas objetivo en lugar de horario fijo

### Días Festivos
- Calendario de días no laborales
- Excepciones automáticas

## Test Cases

| ID | Description | Expected Result |
|----|-------------|-----------------|
| TC-001 | Crear horario con datos válidos | Horario creado en lista |
| TC-002 | Crear horario sin nombre | Validación falla |
| TC-003 | Modificar tolerancia | Valor actualizado |
| TC-004 | Desactivar horario | Badge muestra "Inactivo" |
| TC-005 | Seleccionar/deseleccionar días | Toggle visual correcto |
