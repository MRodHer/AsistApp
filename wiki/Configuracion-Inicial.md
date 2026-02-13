# Configuración Inicial

Una vez instalado AsistApp, sigue estos pasos para configurar el sistema antes del primer uso.

---

## 1. Configurar Horarios de Trabajo

### Acceder a Configuración
1. Ir a **Configuración** en el menú lateral
2. Seleccionar pestaña **Horarios**

### Horario Predeterminado
El sistema incluye un horario estándar:
- **Nombre**: Horario Estándar
- **Entrada**: 08:00
- **Salida**: 17:00
- **Tolerancia**: 15 minutos
- **Días**: Lunes a Viernes

### Crear Horario Personalizado

1. Click en **Nuevo Horario**
2. Completar formulario:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| Nombre | Identificador del turno | "Turno Matutino" |
| Hora Entrada | Hora esperada de llegada | 06:00 |
| Hora Salida | Hora esperada de salida | 14:00 |
| Tolerancia | Minutos de gracia | 10 |
| Días Laborales | Días que aplica | Lun-Sáb |

3. Click en **Guardar**

### Ejemplos de Horarios Comunes

```
Turno Matutino:     06:00 - 14:00  (Lun-Sáb, 10 min tolerancia)
Turno Vespertino:   14:00 - 22:00  (Lun-Sáb, 10 min tolerancia)
Turno Nocturno:     22:00 - 06:00  (Lun-Sáb, 15 min tolerancia)
Horario Oficina:    09:00 - 18:00  (Lun-Vie, 15 min tolerancia)
Medio Tiempo:       08:00 - 13:00  (Lun-Vie, 10 min tolerancia)
```

---

## 2. Registrar Empleados

### Datos Requeridos

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| No. Empleado | ✅ | Identificador único |
| Nombre | ✅ | Nombre(s) |
| Apellido Paterno | ✅ | Primer apellido |
| Apellido Materno | ❌ | Segundo apellido |
| Departamento | ❌ | Área de trabajo |
| Puesto | ❌ | Cargo |
| Fecha Ingreso | ✅ | Fecha de alta |
| Activo | ✅ | Estado del empleado |

### Registro Manual

1. Ir a **Empleados**
2. Click en **Agregar Empleado**
3. Completar formulario
4. Click en **Guardar**

### Importación Masiva (Futuro)

La función de importación desde CSV/Excel está planificada para versiones futuras.

### Recomendaciones de Numeración

```
Formato recomendado: AAAA-NNNN
- AAAA = Año de ingreso
- NNNN = Número secuencial

Ejemplos:
- 2024-0001
- 2024-0002
- 2025-0001
```

---

## 3. Configurar Dispositivos (Opcional)

Si usas lectores biométricos ZKTeco:

### Agregar Dispositivo

1. Ir a **Configuración** → **Dispositivos**
2. Click en **Agregar Dispositivo**
3. Completar:

| Campo | Descripción |
|-------|-------------|
| Nombre | Identificador (ej: "Entrada Principal") |
| Tipo | ZKTeco Biométrico / Cámara / Tablet |
| IP | Dirección IP del dispositivo |
| Puerto | Puerto TCP (default: 4370) |
| Ubicación | Descripción física |

### Encontrar IP del Dispositivo ZKTeco

1. En el dispositivo, ir a **Menú** → **Comm** → **Ethernet**
2. Anotar la IP mostrada
3. Asegurar que esté en la misma red que el servidor

---

## 4. Configurar el Checador

### URL del Checador
```
http://[tu-servidor]/checador
```

### Modo Kiosko (Chrome)

Para usar en una tablet dedicada:

```bash
# Windows
chrome.exe --kiosk http://localhost:5173/checador

# macOS
open -a "Google Chrome" --args --kiosk http://localhost:5173/checador

# Linux
google-chrome --kiosk http://localhost:5173/checador
```

### Configuración de Pantalla

- **Orientación**: Portrait o Landscape
- **Resolución mínima**: 768x1024
- **Brillo**: 70-100% para buena visibilidad

---

## 5. Verificación Final

### Checklist de Configuración

- [ ] Al menos un horario configurado
- [ ] Al menos un empleado registrado
- [ ] Checador accesible desde dispositivo de registro
- [ ] (Opcional) Dispositivo ZKTeco conectado y visible

### Prueba de Registro

1. Abrir `/checador`
2. Seleccionar **Entrada**
3. Ingresar número de empleado de prueba
4. Verificar mensaje de éxito con nombre correcto
5. Ir a **Asistencias** y confirmar que aparece el registro

---

## Siguiente Paso

Continuar con [Primer Uso](Primer-Uso.md) para aprender el flujo diario de operación.
