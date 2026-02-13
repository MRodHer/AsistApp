# Primer Uso

Guía del flujo diario de operación del sistema AsistApp.

---

## Flujo Diario Típico

```
┌─────────────────────────────────────────────────────────────────┐
│                        INICIO DEL DÍA                           │
├─────────────────────────────────────────────────────────────────┤
│  06:00  Empleados comienzan a llegar                            │
│         └─► Registran ENTRADA en checador                       │
│                                                                 │
│  08:15  Administrador revisa dashboard                          │
│         └─► Ve quién ha llegado y quién falta                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        FIN DEL DÍA                              │
├─────────────────────────────────────────────────────────────────┤
│  17:00  Empleados comienzan a salir                             │
│         └─► Registran SALIDA en checador                        │
│                                                                 │
│  18:00  Administrador genera reporte del día                    │
│         └─► Exporta CSV si es necesario                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        FIN DE MES                               │
├─────────────────────────────────────────────────────────────────┤
│  Día 30/31  Administrador genera reporte mensual                │
│             └─► Revisa faltas, retardos, % asistencia           │
│             └─► Exporta para nómina                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Para el Empleado

### Registrar Entrada

1. Acercarse al dispositivo checador
2. Verificar que el reloj muestre la hora correcta
3. Tocar botón **Entrada** (se pondrá verde)
4. Ingresar número de empleado
5. Presionar **Registrar Entrada**
6. Esperar confirmación:
   - ✅ Verde: "Entrada registrada a las HH:MM"
   - ❌ Rojo: Ver mensaje de error

### Registrar Salida

1. Acercarse al dispositivo checador
2. Tocar botón **Salida** (se pondrá rojo)
3. Ingresar número de empleado
4. Presionar **Registrar Salida**
5. Esperar confirmación

### Errores Comunes

| Mensaje | Causa | Solución |
|---------|-------|----------|
| "Empleado no encontrado" | Número incorrecto | Verificar número de empleado |
| "Empleado no encontrado" | Empleado inactivo | Contactar administrador |
| Sin respuesta | Sin conexión | Verificar internet |

---

## Para el Administrador

### Revisión Matutina

**Objetivo**: Identificar ausencias temprano

1. Abrir **Dashboard** a las 08:15-08:30
2. Revisar card "Ausentes Hoy"
3. Si hay ausencias inesperadas:
   - Verificar en **Asistencias** si hay registro tardío
   - Contactar al empleado si es necesario

### Monitoreo del Día

**Dashboard** muestra en tiempo real:
- Total de empleados activos
- Cuántos han registrado entrada
- Cuántos faltan
- Últimos 10 registros

### Registro Manual (Excepciones)

Si un empleado no pudo registrar (falla de dispositivo, olvido):

1. Ir a **Asistencias**
2. El registro manual directo no está implementado aún
3. **Workaround**: Ir a Supabase → Table Editor → asistencias
4. Insertar registro con:
   - empleado_id (UUID del empleado)
   - fecha (YYYY-MM-DD)
   - hora_entrada o hora_salida
   - tipo_registro ('entrada' o 'salida')
   - metodo_registro ('manual')
   - notas (razón del registro manual)

### Cierre del Día

1. Abrir **Asistencias**
2. Filtrar por "Hoy"
3. Verificar que todos tengan entrada Y salida
4. Exportar CSV si se requiere respaldo diario

---

## Reportes Periódicos

### Reporte Semanal

1. Ir a **Reportes**
2. Seleccionar tipo: **Resumen General**
3. Cambiar período si es necesario
4. Revisar:
   - Empleados con más faltas
   - Empleados con más retardos
   - % de asistencia general

### Reporte Mensual (para Nómina)

1. Ir a **Reportes**
2. Seleccionar mes a reportar
3. Click en **Exportar**
4. El CSV incluye:
   - Nombre completo
   - Número de empleado
   - Días trabajados
   - Faltas
   - Retardos
   - % Asistencia

---

## Casos Especiales

### Empleado Olvidó Registrar Salida

El día siguiente:
1. El administrador nota en Asistencias que falta la salida
2. Consulta al empleado la hora de salida
3. Registra manualmente en la base de datos

### Empleado Nuevo

1. Registrar en **Empleados** con todos los datos
2. Asignar número de empleado
3. Informar al empleado su número
4. El empleado ya puede usar el checador

### Empleado Sale de la Empresa

1. Ir a **Empleados**
2. Buscar al empleado
3. Click en editar
4. Desmarcar "Empleado activo"
5. Guardar

El empleado ya no podrá registrar asistencia pero sus registros históricos se mantienen.

### Dispositivo Checador No Funciona

1. Verificar conexión a internet
2. Verificar que el servidor esté corriendo
3. Si persiste, usar otro dispositivo o registrar manualmente después

---

## Siguiente Paso

Para detalles específicos de cada módulo, consultar:
- [Manual del Dashboard](Manual-Dashboard.md)
- [Manual de Empleados](Manual-Empleados.md)
- [Manual del Checador](Manual-Checador.md)
