# Manual del Checador

El Checador es la interfaz donde los empleados registran su entrada y salida. Está diseñado para ser simple, rápido y funcionar en dispositivos táctiles.

---

## Acceso

**URL**: `/checador`

**Características**:
- Página independiente (sin menú lateral)
- Optimizada para pantallas táctiles
- Funciona en tablets, kioscos o computadoras

---

## Interfaz

### Elementos de Pantalla

```
┌─────────────────────────────────────────┐
│              [Logo AsistApp]             │
│         Control de Asistencia            │
├─────────────────────────────────────────┤
│         📅 Jueves, 13 de febrero         │
│              ┌─────────┐                 │
│              │ 08:45:32│                 │
│              └─────────┘                 │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐     │
│  │   ENTRADA    │  │    SALIDA    │     │
│  │   (verde)    │  │    (rojo)    │     │
│  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────┤
│      Número de Empleado                  │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      REGISTRAR ENTRADA          │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│   Para usar biométrico, acerca tu       │
│   huella o rostro al dispositivo        │
└─────────────────────────────────────────┘
```

### Componentes

| Componente | Descripción |
|------------|-------------|
| Logo | Identidad visual de AsistApp |
| Fecha | Día actual en español |
| Reloj | Hora en tiempo real (HH:MM:SS) |
| Botones Entrada/Salida | Selección de tipo de registro |
| Campo de texto | Para ingresar número de empleado |
| Botón Registrar | Envía el registro |
| Footer | Instrucciones adicionales |

---

## Proceso de Registro

### Paso 1: Seleccionar Tipo

- **ENTRADA**: Botón verde (seleccionado por defecto)
- **SALIDA**: Botón rojo

El botón seleccionado se resalta y agranda ligeramente.

### Paso 2: Ingresar Número

- Tocar el campo de texto
- Escribir número de empleado
- El campo acepta caracteres alfanuméricos

### Paso 3: Registrar

- Presionar botón "Registrar Entrada/Salida"
- Esperar respuesta del sistema

### Paso 4: Confirmación

**Éxito** (fondo verde):
```
✓ Juan García López
  Entrada registrada a las 08:45:32
```

**Error** (fondo rojo):
```
✗ Empleado no encontrado
```

La confirmación desaparece automáticamente después de 5 segundos.

---

## Mensajes del Sistema

### Mensajes de Éxito

| Mensaje | Significado |
|---------|-------------|
| "Entrada registrada a las HH:MM:SS" | Registro de entrada exitoso |
| "Salida registrada a las HH:MM:SS" | Registro de salida exitoso |

### Mensajes de Error

| Mensaje | Causa | Solución |
|---------|-------|----------|
| "Empleado no encontrado" | Número incorrecto | Verificar número |
| "Empleado no encontrado" | Empleado inactivo | Contactar administrador |
| "Error de conexión" | Sin internet | Verificar red |

---

## Configuración de Dispositivo

### Tablet/Kiosko

**Requisitos mínimos**:
- Pantalla: 7" o mayor
- Resolución: 768x1024 mínimo
- Navegador: Chrome, Firefox o Safari actualizado
- Conexión: WiFi o Ethernet estable

**Configuración recomendada**:
```
1. Instalar navegador Chrome
2. Crear acceso directo a /checador
3. Configurar como página de inicio
4. Activar modo kiosko (pantalla completa)
5. Desactivar suspensión de pantalla
6. Configurar brillo al 80%
```

### Modo Kiosko

**Chrome (Windows)**:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://tu-servidor/checador
```

**Chrome (macOS)**:
```bash
open -a "Google Chrome" --args --kiosk --app=http://tu-servidor/checador
```

**Chrome (Linux)**:
```bash
google-chrome --kiosk --app=http://tu-servidor/checador
```

### Montaje Físico

**Recomendaciones**:
- Altura: 1.2-1.4 metros del suelo
- Ángulo: Ligeramente inclinado hacia el usuario
- Iluminación: Evitar luz directa sobre pantalla
- Protección: Carcasa resistente si es área industrial

---

## Integración con Biométricos

### Estado Actual

La versión actual solo soporta **registro manual** por número de empleado.

### Futuro (SPEC-ASIST-004)

Cuando se implemente la integración ZKTeco:

1. Empleado acerca huella o rostro
2. Dispositivo identifica al empleado
3. Sistema registra automáticamente
4. Pantalla muestra confirmación

**Dispositivos soportados**:
- ZKTeco ZK-F22 (huella + rostro)
- ZKTeco ZK-MB160 (multi-biométrico)
- ZKTeco ZK-K40 (solo huella)
- ZKTeco ZK-VF680 (solo rostro)

---

## Solución de Problemas

### El reloj no avanza

**Causa**: JavaScript desactivado o error de carga
**Solución**: Recargar página (F5)

### No responde al tocar

**Causa**: Pantalla táctil no calibrada
**Solución**: Calibrar touch screen en configuración del sistema

### "Empleado no encontrado" con número correcto

**Verificar**:
1. El empleado existe en el sistema
2. El empleado está marcado como "activo"
3. No hay espacios extra en el número

### Tarda mucho en registrar

**Causa**: Conexión lenta
**Solución**:
- Verificar conexión a internet
- Verificar que el servidor esté respondiendo

### La pantalla se apaga

**Causa**: Ahorro de energía activado
**Solución**: Desactivar suspensión de pantalla en configuración del dispositivo

---

## Mejores Prácticas

### Para Empleados

1. ✅ Verificar que la hora sea correcta antes de registrar
2. ✅ Esperar la confirmación antes de retirarse
3. ✅ Memorizar su número de empleado
4. ❌ No registrar por otros compañeros

### Para Administradores

1. ✅ Ubicar el checador en zona de paso obligado
2. ✅ Mantener pantalla limpia y visible
3. ✅ Verificar conexión diariamente
4. ✅ Tener plan B si falla (registro manual posterior)

---

## Estadísticas de Uso

El sistema registra para cada registro:
- Empleado ID
- Fecha
- Hora exacta (entrada o salida)
- Tipo de registro
- Método (manual, huella, rostro)
- Dispositivo usado

Estos datos se usan para generar reportes y detectar patrones.

---

## Navegación Relacionada

- [Asistencias](Manual-Asistencias.md) - Ver registros
- [Dashboard](Manual-Dashboard.md) - Monitorear actividad
- [Dispositivos](Manual-Dispositivos.md) - Configurar lectores
