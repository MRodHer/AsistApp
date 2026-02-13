# SPEC-ASIST-004: Integración Biométrica ZKTeco

## Metadata
- **ID**: SPEC-ASIST-004
- **Title**: Integración con Dispositivos Biométricos ZKTeco
- **Status**: Planned
- **Priority**: High
- **Created**: 2026-02-13
- **Updated**: 2026-02-13

## Overview

Integración con dispositivos biométricos ZKTeco para registro automático de asistencia mediante huella digital y reconocimiento facial. El sistema se conecta a los dispositivos vía red TCP/IP para sincronizar usuarios y obtener registros de asistencia en tiempo real.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | El sistema DEBE permitir registrar dispositivos ZKTeco | Must |
| FR-002 | El sistema DEBE almacenar IP y puerto de cada dispositivo | Must |
| FR-003 | El sistema DEBE mostrar estado de conexión del dispositivo | Should |
| FR-004 | El sistema DEBE sincronizar empleados con el dispositivo | Must |
| FR-005 | El sistema DEBE importar registros de asistencia del dispositivo | Must |
| FR-006 | El sistema DEBE soportar registro por huella digital | Must |
| FR-007 | El sistema DEBE soportar registro por reconocimiento facial | Should |
| FR-008 | El sistema DEBE registrar fecha/hora de última sincronización | Should |
| FR-009 | El sistema DEBE permitir activar/desactivar dispositivos | Should |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | La sincronización debe completarse en menos de 30 segundos | Should |
| NFR-002 | El sistema debe reintentar conexión en caso de fallo | Should |
| NFR-003 | Los registros deben importarse cada 5 minutos automáticamente | Should |

## Data Model

```sql
CREATE TABLE dispositivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('zkteco', 'camara', 'tablet')),
    ip_address INET,
    puerto INTEGER DEFAULT 4370,
    ubicacion VARCHAR(200),
    activo BOOLEAN DEFAULT true,
    ultimo_sync TIMESTAMPTZ
);

-- Campos en empleados para biométricos
ALTER TABLE empleados ADD COLUMN huella_id VARCHAR(100);
ALTER TABLE empleados ADD COLUMN rostro_id VARCHAR(100);

-- Campo en asistencias para dispositivo
ALTER TABLE asistencias ADD COLUMN dispositivo_id UUID REFERENCES dispositivos(id);
```

## ZKTeco Communication Protocol

### Conexión
```
Protocolo: TCP/IP
Puerto por defecto: 4370
Timeout: 5000ms
```

### Comandos Principales
| Comando | Descripción |
|---------|-------------|
| Connect | Establecer conexión |
| Disconnect | Cerrar conexión |
| GetAllUserInfo | Obtener todos los usuarios |
| SetUserInfo | Registrar usuario |
| GetAttendanceLog | Obtener registros de asistencia |
| ClearAttendanceLog | Limpiar registros (después de importar) |
| GetDeviceInfo | Información del dispositivo |

## Modelos ZKTeco Soportados

| Modelo | Huella | Rostro | Notas |
|--------|--------|--------|-------|
| ZK-F22 | ✅ | ✅ | Recomendado |
| ZK-MB160 | ✅ | ✅ | Multi-biométrico |
| ZK-K40 | ✅ | ❌ | Solo huella |
| ZK-VF680 | ❌ | ✅ | Solo rostro |

## UI Components

### DispositivosSection (en Configuración)
- Lista de dispositivos registrados
- Indicador de conexión (verde/rojo)
- Última sincronización
- Botón de sincronizar manualmente

### DispositivoModal
- Nombre del dispositivo
- Tipo (ZKTeco/Cámara/Tablet)
- Dirección IP
- Puerto
- Ubicación
- Estado activo

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AsistApp UI   │────▶│  Backend API    │────▶│  ZKTeco Device  │
│   (React)       │     │  (Node.js)      │     │  (TCP/IP)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Supabase     │
                        │   (PostgreSQL)  │
                        └─────────────────┘
```

## Implementation Plan

### Phase 1: Device Management (Implemented)
- [x] UI para CRUD de dispositivos
- [x] Modelo de datos

### Phase 2: Connection Layer (Pending)
- [ ] Servicio Node.js para comunicación TCP
- [ ] Endpoint para test de conexión
- [ ] Endpoint para sincronización

### Phase 3: User Sync (Pending)
- [ ] Sincronizar empleados → dispositivo
- [ ] Registrar huella en dispositivo
- [ ] Registrar rostro en dispositivo

### Phase 4: Attendance Import (Pending)
- [ ] Cron job para importar registros
- [ ] Mapeo de IDs dispositivo ↔ empleados
- [ ] Manejo de duplicados

## Libraries Recomendadas

### Node.js
```javascript
// zklib - Librería para comunicación ZKTeco
const ZKLib = require('zklib');

const zk = new ZKLib({
  ip: '192.168.1.100',
  port: 4370,
  inport: 5200,
  timeout: 5000
});

await zk.connect();
const attendance = await zk.getAttendance();
await zk.disconnect();
```

## Test Cases

| ID | Description | Expected Result |
|----|-------------|-----------------|
| TC-001 | Agregar dispositivo con IP válida | Dispositivo registrado |
| TC-002 | Test conexión con dispositivo | Estado "Conectado" |
| TC-003 | Sincronizar empleados | Usuarios creados en dispositivo |
| TC-004 | Importar asistencias | Registros en tabla asistencias |
| TC-005 | Dispositivo offline | Estado "Desconectado" |
