# Manual de Configuración de Horarios

Guía completa para configurar horarios de trabajo y asignarlos a empleados.

---

## Acceso

**URL**: `/configuracion` → Pestaña **Horarios**

**Navegación**: Menú lateral → Configuración → Horarios

---

## Conceptos

### ¿Qué es un Horario?

Un horario define:
- **Hora de entrada esperada**: Momento en que el empleado debe llegar
- **Hora de salida esperada**: Momento en que termina la jornada
- **Tolerancia**: Minutos de gracia antes de considerar retardo
- **Días laborales**: Qué días de la semana aplica

### ¿Para qué sirve?

1. **Calcular retardos**: Si llega después de entrada + tolerancia
2. **Calcular faltas**: Si no hay registro en día laboral
3. **Calcular horas**: Diferencia entre entrada y salida esperadas

---

## Vista de Horarios

### Lista de Horarios

Cada horario muestra:

| Elemento | Descripción |
|----------|-------------|
| Nombre | Identificador del horario |
| Rango de horas | Entrada - Salida |
| Tolerancia | Minutos permitidos |
| Días | Badges visuales Dom-Sáb |
| Estado | Badge Activo/Inactivo |
| Acciones | Editar / Eliminar |

### Indicador de Días

```
[Dom][Lun][Mar][Mié][Jue][Vie][Sáb]
  ⬜   🟦   🟦   🟦   🟦   🟦   ⬜

🟦 = Día laboral (activo)
⬜ = Día no laboral (inactivo)
```

---

## Operaciones

### Crear Horario

1. Click en **Nuevo Horario**
2. Completar formulario:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Nombre | Texto | ✅ | Identificador único |
| Hora Entrada | Tiempo | ✅ | Formato HH:MM |
| Hora Salida | Tiempo | ✅ | Formato HH:MM |
| Tolerancia | Número | ✅ | Minutos (0-60) |
| Días Laborales | Botones | ✅ | Selección múltiple |
| Activo | Check | ✅ | Si el horario está vigente |

3. Click en **Guardar**

### Editar Horario

1. Localizar horario en la lista
2. Click en icono de **lápiz**
3. Modificar campos
4. Click en **Guardar**

### Eliminar Horario

1. Click en icono de **papelera**
2. Confirmar eliminación

⚠️ **Advertencia**: Al eliminar un horario:
- Se eliminan las asignaciones a empleados
- Los cálculos históricos pueden verse afectados

---

## Configuración de Días

### Selector Visual

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Dom │ Lun │ Mar │ Mié │ Jue │ Vie │ Sáb │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

- **Click** en un día: Alterna activo/inactivo
- **Azul**: Día laboral
- **Gris**: Día no laboral

### Códigos de Días

| Día | Código | Nombre |
|-----|--------|--------|
| 0 | Dom | Domingo |
| 1 | Lun | Lunes |
| 2 | Mar | Martes |
| 3 | Mié | Miércoles |
| 4 | Jue | Jueves |
| 5 | Vie | Viernes |
| 6 | Sáb | Sábado |

---

## Ejemplos de Horarios

### Oficina Estándar
```
Nombre: Horario Oficina
Entrada: 09:00
Salida: 18:00
Tolerancia: 15 minutos
Días: Lun-Vie
```

### Turno Matutino
```
Nombre: Turno Mañana
Entrada: 06:00
Salida: 14:00
Tolerancia: 10 minutos
Días: Lun-Sáb
```

### Turno Vespertino
```
Nombre: Turno Tarde
Entrada: 14:00
Salida: 22:00
Tolerancia: 10 minutos
Días: Lun-Sáb
```

### Turno Nocturno
```
Nombre: Turno Noche
Entrada: 22:00
Salida: 06:00 (día siguiente)
Tolerancia: 15 minutos
Días: Lun-Sáb
```

### Medio Tiempo
```
Nombre: Medio Tiempo AM
Entrada: 08:00
Salida: 13:00
Tolerancia: 10 minutos
Días: Lun-Vie
```

### Fin de Semana
```
Nombre: Guardias Fin de Semana
Entrada: 08:00
Salida: 20:00
Tolerancia: 15 minutos
Días: Sáb-Dom
```

---

## Cálculo de Tolerancia

### Cómo Funciona

```
Hora límite = Hora entrada + Tolerancia

Ejemplo:
- Entrada: 08:00
- Tolerancia: 15 min
- Hora límite: 08:15

Si empleado llega a las 08:14 → NO es retardo
Si empleado llega a las 08:16 → ES retardo
```

### Recomendaciones de Tolerancia

| Tipo de Trabajo | Tolerancia Sugerida |
|-----------------|---------------------|
| Producción | 5-10 minutos |
| Oficina | 10-15 minutos |
| Ventas | 15 minutos |
| Ejecutivos | 15-30 minutos |

---

## Asignación a Empleados

### Estado Actual

La asignación de horarios a empleados se hace a través de la tabla `empleado_horarios` en la base de datos.

### Estructura de Asignación

```sql
empleado_horarios (
    id           UUID
    empleado_id  UUID  -- Referencia al empleado
    horario_id   UUID  -- Referencia al horario
    fecha_inicio DATE  -- Desde cuándo aplica
    fecha_fin    DATE  -- Hasta cuándo aplica (null = vigente)
)
```

### Asignar Manualmente (Supabase)

1. Ir a Supabase → Table Editor → empleado_horarios
2. Insert row
3. Completar:
   - empleado_id: UUID del empleado
   - horario_id: UUID del horario
   - fecha_inicio: Fecha desde cuando aplica

### Interfaz de Asignación (Futuro)

Planificado para futuras versiones:
- Dropdown de horario en formulario de empleado
- Vista de empleados por horario
- Cambio masivo de horarios

---

## Horarios Especiales

### Turno Partido

Para turnos con descanso intermedio (ej: comida):

**Opción 1**: Dos horarios separados
```
Turno Mañana: 08:00 - 13:00
Turno Tarde: 14:00 - 18:00
```

**Opción 2**: Un horario, cuatro registros diarios
```
08:00 - Entrada mañana
13:00 - Salida a comer
14:00 - Entrada tarde
18:00 - Salida final
```

### Horario Rotativo

Para empleados que cambian de turno cada semana:

1. Crear todos los turnos necesarios
2. Asignar con fecha_inicio y fecha_fin
3. Crear nueva asignación para siguiente rotación

### Horario Flexible

Para empleados sin hora fija:

1. Crear horario con rango amplio (ej: 06:00 - 22:00)
2. Tolerancia alta (ej: 60 min)
3. Solo se usa para calcular si hubo registro ese día

---

## Datos en Base de Datos

### Tabla horarios

```sql
CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    dias_laborales INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    activo BOOLEAN DEFAULT true
);
```

### Registro Predeterminado

```sql
INSERT INTO horarios (nombre, hora_entrada, hora_salida, tolerancia_minutos, dias_laborales)
VALUES ('Horario Estándar', '08:00', '17:00', 15, ARRAY[1,2,3,4,5]);
```

---

## Preguntas Frecuentes

### ¿Puedo tener empleados sin horario?

Sí, pero:
- No se calcularán retardos
- No se calcularán faltas correctamente
- Solo se contarán registros de asistencia

### ¿Qué pasa si cambio un horario?

Los cambios afectan:
- ✅ Cálculos futuros
- ❓ Cálculos históricos (depende de la implementación)

### ¿Puedo tener múltiples horarios activos?

Sí, puedes tener varios horarios y asignarlos a diferentes empleados.

### ¿Qué pasa con turnos nocturnos que cruzan medianoche?

Actualmente, el sistema registra la fecha del día de entrada. La salida al día siguiente se registra con la fecha del día siguiente.

---

## Navegación Relacionada

- [Empleados](Manual-Empleados.md) - Asignar horarios
- [Reportes](Manual-Reportes.md) - Ver retardos/faltas
- [Dispositivos](Manual-Dispositivos.md) - Configurar lectores
