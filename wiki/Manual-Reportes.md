# Manual de Generación de Reportes

Guía para generar y analizar reportes de asistencia mensuales.

---

## Acceso

**URL**: `/reportes`

**Navegación**: Menú lateral → Reportes

---

## Vista General

### Selector de Mes

- **Ubicación**: Esquina superior derecha
- **Formato**: YYYY-MM (selector tipo mes)
- **Default**: Mes actual

### Tipos de Reporte

Cuatro tarjetas seleccionables:

| Tipo | Icono | Descripción |
|------|-------|-------------|
| Resumen General | 📄 | Vista consolidada del mes |
| Retardos | ⏰ | Detalle de llegadas tardías |
| Faltas | ⚠️ | Detalle de ausencias |
| Horas Trabajadas | 📅 | Total de horas por empleado |

### Estadísticas Globales

Tres métricas del período seleccionado:
- **Empleados Activos**: Total de empleados con estado activo
- **Días Laborales**: Días hábiles del mes (Lun-Vie)
- **Registros Totales**: Cantidad de checadas en el período

---

## Tipos de Reporte

### 1. Resumen General

**Propósito**: Vista consolidada de asistencia de todos los empleados.

**Columnas**:

| Columna | Descripción |
|---------|-------------|
| Empleado | Nombre + Número |
| Días Trabajados | Días con al menos una entrada |
| Faltas | Días laborales sin entrada |
| Retardos | Entradas después de tolerancia |
| % Asistencia | (Días trabajados / Días laborales) × 100 |

**Barra de Progreso**:
- 🟢 Verde: ≥90% asistencia
- 🟡 Amarillo: 70-89% asistencia
- 🔴 Rojo: <70% asistencia

### 2. Retardos

**Propósito**: Identificar patrones de llegadas tardías.

**Información mostrada**:
- Lista de empleados con retardos
- Cantidad de retardos por empleado
- Fechas específicas de retardo
- Minutos de retraso

**Cálculo de Retardo**:
```
Si hora_entrada > (horario.hora_entrada + horario.tolerancia)
Entonces es_retardo = true
```

**Nota**: Requiere que el empleado tenga horario asignado.

### 3. Faltas

**Propósito**: Identificar ausencias no justificadas.

**Información mostrada**:
- Lista de empleados con faltas
- Cantidad de faltas por empleado
- Fechas específicas de ausencia

**Cálculo de Falta**:
```
Para cada día laboral del mes:
  Si NO existe registro de entrada para el empleado
  Entonces falta = true
```

**Consideraciones**:
- Solo cuenta días Lunes a Viernes
- No considera feriados (aún)
- No considera vacaciones/permisos (aún)

### 4. Horas Trabajadas

**Propósito**: Calcular tiempo efectivo de trabajo.

**Información mostrada**:
- Total de horas por empleado
- Comparación con horas esperadas
- Déficit o excedente

**Cálculo de Horas**:
```
Para cada día:
  horas = hora_salida - hora_entrada

Total = Σ horas de todos los días
```

**Limitaciones actuales**:
- Requiere entrada Y salida para calcular
- No considera descansos/comida

---

## Exportación

### Botón Exportar

- **Ubicación**: Header del reporte
- **Acción**: Descarga CSV del reporte actual

### Contenido del CSV

Varía según el tipo de reporte seleccionado.

**Ejemplo Resumen General**:
```csv
Empleado,No. Empleado,Días Trabajados,Faltas,Retardos,% Asistencia
Juan García,2024-0001,20,2,1,91
María Pérez,2024-0002,22,0,0,100
...
```

---

## Interpretación

### Empleado Modelo

```
Días Trabajados: 22
Faltas: 0
Retardos: 0
% Asistencia: 100%
```

### Empleado con Problemas

```
Días Trabajados: 15
Faltas: 7
Retardos: 5
% Asistencia: 68%
```

**Acciones sugeridas**:
1. Verificar razones de ausencia
2. Conversar con el empleado
3. Documentar situación

### Patrones a Detectar

| Patrón | Posible Causa | Acción |
|--------|---------------|--------|
| Retardos lunes frecuentes | Problema de fin de semana | Hablar con empleado |
| Salidas tempranas viernes | Posible abuso | Monitorear |
| Faltas después de quincena | Posible problema financiero | Verificar |
| Sin salidas registradas | Olvida registrar | Capacitar |

---

## Casos de Uso

### 1. Cierre de Nómina

1. Abrir Reportes
2. Seleccionar mes del período
3. Tipo: Resumen General
4. Exportar CSV
5. Usar datos para cálculo de nómina:
   - Días trabajados → Salario proporcional
   - Faltas → Descuentos
   - Retardos → Según política

### 2. Evaluación de Desempeño

1. Seleccionar varios meses (uno a la vez)
2. Exportar CSV de cada mes
3. Consolidar en Excel
4. Analizar tendencias:
   - ¿Mejora o empeora?
   - ¿Hay meses críticos?

### 3. Detección de Anomalías

1. Tipo: Retardos
2. Ordenar por cantidad (en Excel)
3. Identificar outliers
4. Investigar casos específicos

### 4. Reporte para Gerencia

1. Tipo: Resumen General
2. Exportar CSV
3. Crear gráficos en Excel:
   - Barras de % asistencia
   - Pie de empleados por rango
4. Presentar hallazgos

---

## Limitaciones Actuales

| Limitación | Impacto | Solución Futura |
|------------|---------|-----------------|
| Sin cálculo de retardos | Columna siempre en 0 | Integrar con horarios |
| Sin feriados | Faltas incorrectas | Calendario de feriados |
| Sin justificaciones | Todo cuenta como falta | Módulo de permisos |
| Sin horas extra | No se detectan | Reglas de hora extra |
| Un mes a la vez | Comparaciones manuales | Rango multi-mes |

---

## Preguntas Frecuentes

### ¿Por qué los retardos siempre dicen 0?

El cálculo de retardos requiere:
1. Empleado con horario asignado
2. Implementación de la lógica (pendiente en SPEC-ASIST-004)

### ¿Los feriados cuentan como falta?

Actualmente sí. No hay calendario de feriados implementado.

### ¿Puedo ver reportes de años anteriores?

Sí, el selector de mes permite navegar a cualquier período histórico.

### ¿El reporte considera empleados inactivos?

No, solo muestra empleados con estado "activo".

---

## Fórmulas de Cálculo

### Días Laborales del Mes

```javascript
const workDays = eachDayOfInterval({ start: inicioMes, end: finMes })
  .filter(d => !isWeekend(d))
  .length;
```

### Porcentaje de Asistencia

```javascript
const asistenciaPct = Math.round((diasTrabajados / diasLaborales) * 100);
```

### Días Trabajados

```javascript
const diasTrabajados = new Set(
  asistencias
    .filter(a => a.empleado_id === empleado.id && a.tipo_registro === 'entrada')
    .map(a => a.fecha)
).size;
```

---

## Navegación Relacionada

- [Asistencias](Manual-Asistencias.md) - Datos detallados
- [Horarios](Manual-Horarios.md) - Configurar para retardos
- [Dashboard](Manual-Dashboard.md) - Vista del día
