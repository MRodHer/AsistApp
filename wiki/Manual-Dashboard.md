# Manual del Dashboard

El Dashboard es la pantalla principal de AsistApp. Proporciona una vista general del estado de asistencia del día actual.

---

## Acceso

**URL**: `/dashboard`

**Navegación**: Es la página de inicio al entrar al sistema.

---

## Componentes

### 1. Encabezado

Muestra la fecha actual en formato completo:
```
Jueves, 13 de febrero de 2026
```

### 2. Tarjetas de Estadísticas

Tres tarjetas con métricas clave:

#### Total Empleados
- **Icono**: 👥 (Usuarios)
- **Color**: Azul
- **Valor**: Cantidad de empleados con estado "activo"
- **Actualización**: En tiempo real con cada carga

#### Presentes Hoy
- **Icono**: ✅ (Usuario con check)
- **Color**: Verde
- **Valor**: Empleados que han registrado entrada hoy
- **Cálculo**: `COUNT(DISTINCT empleado_id) WHERE fecha = HOY AND tipo_registro = 'entrada'`

#### Ausentes Hoy
- **Icono**: ❌ (Usuario con X)
- **Color**: Rojo
- **Valor**: Total empleados - Presentes
- **Cálculo**: `total_empleados - presentes_hoy`

### 3. Últimos Registros

Lista de los 10 registros de asistencia más recientes:

| Columna | Descripción |
|---------|-------------|
| Icono | 🟢 Entrada / 🔴 Salida |
| Nombre | Nombre completo del empleado |
| Número | Número de empleado |
| Tipo | "Entrada" o "Salida" |
| Hora | Hora del registro (HH:MM:SS) |

---

## Interpretación de Datos

### Estado Ideal
```
Total: 25  |  Presentes: 25  |  Ausentes: 0
```
Todos los empleados han llegado.

### Alerta Temprana
```
Total: 25  |  Presentes: 20  |  Ausentes: 5
```
- Revisar si es dentro del horario de tolerancia
- Verificar si hay empleados con permisos/vacaciones
- Contactar si la ausencia es inesperada

### Interpretación de Últimos Registros

- **Registros alternados** (entrada-salida-entrada...): Flujo normal
- **Muchas entradas seguidas**: Hora pico de llegada
- **Muchas salidas seguidas**: Hora pico de salida
- **Sin registros recientes**: Posible problema con el checador

---

## Refresco de Datos

Los datos se cargan automáticamente al entrar al Dashboard.

**Refresco manual**: Presionar F5 o recargar la página.

**Actualización automática**: No implementada aún. Los datos muestran el estado al momento de cargar.

---

## Casos de Uso

### 1. Verificación Matutina

**Hora**: 15-30 minutos después del inicio de jornada

**Proceso**:
1. Abrir Dashboard
2. Verificar "Ausentes Hoy"
3. Si > 0, revisar si son ausencias esperadas
4. Tomar acción si hay ausencias inesperadas

### 2. Monitoreo Continuo

**Durante el día**:
- Revisar últimos registros para ver actividad
- Detectar registros inusuales (entrada muy tarde, salida muy temprano)

### 3. Cierre de Jornada

**Al final del día**:
1. Verificar que "Presentes" coincida con los que deben estar
2. Confirmar que se registraron las salidas

---

## Limitaciones Actuales

| Limitación | Impacto | Solución Futura |
|------------|---------|-----------------|
| Sin auto-refresh | Datos pueden estar desactualizados | Implementar WebSocket o polling |
| Solo muestra hoy | No hay histórico rápido | Agregar selector de fecha |
| Sin filtro por departamento | Vista general solamente | Agregar filtros |

---

## Preguntas Frecuentes

### ¿Por qué "Ausentes" muestra un número alto en la mañana?

Es normal. El cálculo se hace contra el total de empleados activos. A medida que registran entrada, el número baja.

### ¿Los datos son en tiempo real?

Los datos se cargan al abrir la página. Para ver actualizaciones, recargar la página.

### ¿Puedo ver el dashboard de otro día?

No directamente desde el Dashboard. Usa la sección de **Asistencias** con filtros de fecha.

---

## Navegación Relacionada

- [Asistencias](Manual-Asistencias.md) - Historial detallado
- [Reportes](Manual-Reportes.md) - Análisis mensual
- [Empleados](Manual-Empleados.md) - Gestión de personal
