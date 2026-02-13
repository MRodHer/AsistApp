# SPEC-ASIST-002: Sistema de Checador

## Metadata
- **ID**: SPEC-ASIST-002
- **Title**: Sistema de Checador (Check-in/Check-out)
- **Status**: Implemented
- **Priority**: Critical
- **Created**: 2026-02-13
- **Updated**: 2026-02-13

## Overview

Pantalla standalone para registro de entrada y salida de empleados. Diseñada para uso en dispositivos de acceso (tablets, kioscos) con interfaz simple y clara. Soporta registro manual por número de empleado y futura integración con dispositivos biométricos.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | El sistema DEBE mostrar reloj en tiempo real | Must |
| FR-002 | El sistema DEBE permitir seleccionar tipo: Entrada o Salida | Must |
| FR-003 | El sistema DEBE aceptar número de empleado para registro | Must |
| FR-004 | El sistema DEBE validar que el empleado exista y esté activo | Must |
| FR-005 | El sistema DEBE registrar fecha y hora exacta del registro | Must |
| FR-006 | El sistema DEBE mostrar confirmación con nombre del empleado | Must |
| FR-007 | El sistema DEBE mostrar mensaje de error si el empleado no existe | Must |
| FR-008 | El sistema DEBE limpiar el formulario después de cada registro | Should |
| FR-009 | El sistema DEBE funcionar como página independiente (/checador) | Must |
| FR-010 | El sistema DEBE soportar método de registro: manual, huella, rostro | Should |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | La UI debe ser legible a 2 metros de distancia | Should |
| NFR-002 | El registro debe completarse en menos de 500ms | Must |
| NFR-003 | La pantalla debe funcionar en modo landscape y portrait | Should |
| NFR-004 | Los mensajes deben auto-ocultarse después de 5 segundos | Should |

## Data Model

```sql
CREATE TABLE asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_entrada TIME,
    hora_salida TIME,
    tipo_registro VARCHAR(10) NOT NULL CHECK (tipo_registro IN ('entrada', 'salida')),
    metodo_registro VARCHAR(10) NOT NULL CHECK (metodo_registro IN ('huella', 'rostro', 'manual')),
    dispositivo_id UUID REFERENCES dispositivos(id),
    notas TEXT
);
```

## UI Components

### ChecadorPage
- Header con logo AsistApp
- Reloj digital grande (HH:mm:ss)
- Fecha en español (Lunes, 13 de febrero)
- Botones de selección: Entrada (verde) / Salida (rojo)
- Input grande para número de empleado
- Botón de registro
- Área de mensajes (éxito/error)
- Footer con instrucciones

### States
- **Default**: Esperando input
- **Loading**: Registrando...
- **Success**: Muestra nombre y hora registrada
- **Error**: Muestra mensaje de error

## User Flow

```
1. Usuario se acerca al checador
2. Selecciona "Entrada" o "Salida"
3. Ingresa número de empleado
4. Presiona "Registrar"
5. Sistema valida empleado
6. Si válido: muestra confirmación verde
7. Si inválido: muestra error rojo
8. Después de 5s: limpia y vuelve a estado inicial
```

## Implementation Files

- `src/pages/Checador.tsx` - Página standalone del checador
- `src/lib/supabase.ts` - Cliente de base de datos

## Future Enhancements

### Integración Biométrica (SPEC-ASIST-004)
- Conexión con dispositivos ZKTeco
- Registro automático por huella
- Reconocimiento facial

### Modo Offline
- Almacenamiento local de registros
- Sincronización cuando hay conexión

## Test Cases

| ID | Description | Expected Result |
|----|-------------|-----------------|
| TC-001 | Registrar entrada con empleado válido | Éxito, muestra nombre |
| TC-002 | Registrar con empleado inexistente | Error "Empleado no encontrado" |
| TC-003 | Registrar con empleado inactivo | Error "Empleado no encontrado" |
| TC-004 | Verificar hora exacta registrada | Hora coincide con reloj del sistema |
| TC-005 | Mensaje desaparece después de 5s | Formulario limpio |
