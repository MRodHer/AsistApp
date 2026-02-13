# SPEC-ASIST-005: Reportes y Análisis

## Metadata
- **ID**: SPEC-ASIST-005
- **Title**: Reportes y Análisis de Asistencia
- **Status**: Implemented
- **Priority**: Medium
- **Created**: 2026-02-13
- **Updated**: 2026-02-13

## Overview

Módulo de reportes y análisis para visualizar estadísticas de asistencia, detectar patrones de retardos y faltas, y generar informes exportables. Incluye dashboard con métricas en tiempo real y reportes mensuales detallados.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | El sistema DEBE mostrar estadísticas del día actual | Must |
| FR-002 | El sistema DEBE mostrar empleados presentes/ausentes | Must |
| FR-003 | El sistema DEBE mostrar últimos registros en tiempo real | Must |
| FR-004 | El sistema DEBE generar reporte mensual por empleado | Must |
| FR-005 | El sistema DEBE calcular días trabajados, faltas y retardos | Must |
| FR-006 | El sistema DEBE calcular porcentaje de asistencia | Must |
| FR-007 | El sistema DEBE permitir filtrar por período | Must |
| FR-008 | El sistema DEBE permitir búsqueda de asistencias | Should |
| FR-009 | El sistema DEBE exportar reportes a CSV | Must |
| FR-010 | El sistema DEBE mostrar barra de progreso de asistencia | Should |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | El dashboard debe cargar en menos de 2 segundos | Should |
| NFR-002 | Los reportes deben calcular en menos de 5 segundos | Should |
| NFR-003 | La exportación CSV debe completarse inmediatamente | Should |

## Dashboard Metrics

### Cards Principales
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Empleados │  │  Presentes Hoy  │  │  Ausentes Hoy   │
│       25        │  │       22        │  │        3        │
│   👥 (azul)     │  │   ✅ (verde)    │  │   ❌ (rojo)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Últimos Registros
- Lista de los 10 registros más recientes
- Nombre del empleado
- Tipo (Entrada/Salida)
- Hora
- Indicador visual de color

## Reportes Disponibles

### 1. Resumen General
- Vista consolidada del mes
- Total por empleado
- Métricas agregadas

### 2. Retardos
- Lista de retardos por empleado
- Minutos de retraso
- Patrones identificados

### 3. Faltas
- Lista de ausencias
- Días específicos
- Justificaciones (futuro)

### 4. Horas Trabajadas
- Total de horas por empleado
- Comparación con horario asignado
- Horas extras (futuro)

## Cálculos

### Porcentaje de Asistencia
```
asistencia_pct = (dias_trabajados / dias_laborales) * 100
```

### Días Laborales
```sql
-- Excluir fines de semana (sábado y domingo)
SELECT COUNT(*)
FROM generate_series(fecha_inicio, fecha_fin, '1 day') AS fecha
WHERE EXTRACT(DOW FROM fecha) NOT IN (0, 6);
```

### Retardos
```
IF hora_entrada > (horario.hora_entrada + tolerancia)
THEN retardo = TRUE
```

## UI Components

### Dashboard
- StatCards con iconos y colores
- Lista de últimos registros
- Actualización en tiempo real (opcional)

### AsistenciasPage
- Filtros: período, búsqueda
- Tabla de registros
- Exportación CSV

### ReportesPage
- Selector de tipo de reporte
- Selector de mes
- Tabla resumen por empleado
- Barras de progreso para %

## Data Views

```sql
CREATE OR REPLACE VIEW vista_asistencia_diaria AS
SELECT
    e.id as empleado_id,
    e.numero_empleado,
    e.nombre || ' ' || e.apellido_paterno as nombre_completo,
    e.departamento,
    a.fecha,
    MIN(CASE WHEN a.tipo_registro = 'entrada' THEN a.hora_entrada END) as primera_entrada,
    MAX(CASE WHEN a.tipo_registro = 'salida' THEN a.hora_salida END) as ultima_salida,
    h.hora_entrada as hora_entrada_esperada,
    h.hora_salida as hora_salida_esperada,
    h.tolerancia_minutos
FROM empleados e
LEFT JOIN asistencias a ON e.id = a.empleado_id
LEFT JOIN empleado_horarios eh ON e.id = eh.empleado_id
LEFT JOIN horarios h ON eh.horario_id = h.id
WHERE e.activo = true
GROUP BY e.id, a.fecha, h.hora_entrada, h.hora_salida, h.tolerancia_minutos;
```

## Implementation Files

- `src/pages/Dashboard.tsx` - Dashboard principal
- `src/pages/Asistencias.tsx` - Historial de registros
- `src/pages/Reportes.tsx` - Reportes mensuales

## Future Enhancements

### Gráficas
- Tendencia de asistencia semanal
- Distribución de retardos por hora
- Comparativo entre departamentos

### Alertas
- Notificación por email de faltas
- Alerta de retardos recurrentes
- Reporte automático fin de mes

### Exportación Avanzada
- Exportar a Excel (XLSX)
- Exportar a PDF
- Programar envío automático

## Test Cases

| ID | Description | Expected Result |
|----|-------------|-----------------|
| TC-001 | Ver dashboard del día | Stats correctas |
| TC-002 | Filtrar asistencias por semana | Solo registros de la semana |
| TC-003 | Exportar a CSV | Archivo descargado |
| TC-004 | Ver reporte mensual | Tabla con todos los empleados |
| TC-005 | Calcular % asistencia | Porcentaje correcto |
