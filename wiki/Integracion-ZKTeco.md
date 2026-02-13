# Integración ZKTeco

Guía técnica para integrar dispositivos biométricos ZKTeco con AsistApp.

---

## Estado de Implementación

| Funcionalidad | Estado |
|---------------|--------|
| Registro de dispositivos | ✅ Implementado |
| Gestión de conexión | ⏳ Pendiente |
| Sincronización de usuarios | ⏳ Pendiente |
| Importación de asistencias | ⏳ Pendiente |
| Gestión de huellas | ⏳ Pendiente |

---

## Dispositivos Soportados

### Modelos Compatibles

| Modelo | Huella | Rostro | Capacidad | Precio Est. |
|--------|--------|--------|-----------|-------------|
| ZK-F22 | ✅ | ✅ | 3,000 usuarios | $200-300 USD |
| ZK-MB160 | ✅ | ✅ | 6,000 usuarios | $350-450 USD |
| ZK-K40 | ✅ | ❌ | 1,000 usuarios | $100-150 USD |
| ZK-VF680 | ❌ | ✅ | 1,200 usuarios | $250-350 USD |
| ZK-iClock560 | ✅ | ❌ | 8,000 usuarios | $300-400 USD |

### Especificaciones Técnicas

```
Protocolo: TCP/IP
Puerto: 4370 (configurable)
Comunicación: Propietaria ZK
Timeout: 5000ms recomendado
```

---

## Arquitectura de Integración

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AsistApp UI   │────▶│  Backend API    │────▶│  ZKTeco Device  │
│   (React)       │     │  (Node.js)      │     │  (TCP/IP)       │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Supabase     │
                        │   (PostgreSQL)  │
                        └─────────────────┘
```

### Componentes Necesarios

1. **Backend Service** (Node.js)
   - Comunicación TCP con dispositivos
   - API REST para frontend
   - Jobs de sincronización

2. **ZK Protocol Library**
   - Librería: `zklib` o `node-zklib`
   - Comandos de comunicación
   - Parseo de respuestas

---

## Protocolo de Comunicación

### Conexión

```javascript
const ZKLib = require('zklib');

const device = new ZKLib({
  ip: '192.168.1.100',
  port: 4370,
  inport: 5200,
  timeout: 5000
});

// Conectar
await device.connect();

// Desconectar
await device.disconnect();
```

### Comandos Disponibles

| Comando | Descripción | Uso |
|---------|-------------|-----|
| connect() | Establecer conexión | Inicio de sesión |
| disconnect() | Cerrar conexión | Fin de operaciones |
| getInfo() | Info del dispositivo | Diagnóstico |
| getUsers() | Obtener usuarios | Sincronización |
| setUser() | Registrar usuario | Alta de empleado |
| getAttendance() | Obtener registros | Importación |
| clearAttendance() | Limpiar registros | Post-importación |
| getTime() | Hora del dispositivo | Verificación |
| setTime() | Configurar hora | Sincronización |

---

## Sincronización de Usuarios

### Flujo: App → Dispositivo

```javascript
// 1. Obtener empleados de la BD
const { data: empleados } = await supabase
  .from('empleados')
  .select('*')
  .eq('activo', true);

// 2. Conectar al dispositivo
await device.connect();

// 3. Registrar cada empleado
for (const emp of empleados) {
  await device.setUser({
    uid: emp.numero_empleado,
    name: `${emp.nombre} ${emp.apellido_paterno}`,
    role: 0, // Usuario normal
    password: ''
  });
}

// 4. Desconectar
await device.disconnect();
```

### Flujo: Dispositivo → App

```javascript
// 1. Conectar al dispositivo
await device.connect();

// 2. Obtener usuarios del dispositivo
const users = await device.getUsers();

// 3. Actualizar IDs en BD
for (const user of users) {
  await supabase
    .from('empleados')
    .update({ huella_id: user.uid })
    .eq('numero_empleado', user.uid);
}

// 4. Desconectar
await device.disconnect();
```

---

## Importación de Asistencias

### Proceso Automático

```javascript
async function importarAsistencias(dispositivoId) {
  // 1. Obtener config del dispositivo
  const { data: dispositivo } = await supabase
    .from('dispositivos')
    .select('*')
    .eq('id', dispositivoId)
    .single();

  // 2. Conectar
  const device = new ZKLib({
    ip: dispositivo.ip_address,
    port: dispositivo.puerto
  });
  await device.connect();

  // 3. Obtener registros
  const logs = await device.getAttendance();

  // 4. Procesar cada registro
  for (const log of logs) {
    // Buscar empleado por UID
    const { data: empleado } = await supabase
      .from('empleados')
      .select('id')
      .eq('numero_empleado', log.uid)
      .single();

    if (empleado) {
      // Insertar asistencia
      await supabase.from('asistencias').insert({
        empleado_id: empleado.id,
        fecha: log.timestamp.toISOString().split('T')[0],
        hora_entrada: log.type === 0 ? log.timestamp.toTimeString().split(' ')[0] : null,
        hora_salida: log.type === 1 ? log.timestamp.toTimeString().split(' ')[0] : null,
        tipo_registro: log.type === 0 ? 'entrada' : 'salida',
        metodo_registro: 'huella',
        dispositivo_id: dispositivoId
      });
    }
  }

  // 5. Limpiar registros del dispositivo (opcional)
  await device.clearAttendance();

  // 6. Actualizar última sincronización
  await supabase
    .from('dispositivos')
    .update({ ultimo_sync: new Date().toISOString() })
    .eq('id', dispositivoId);

  // 7. Desconectar
  await device.disconnect();
}
```

### Cron Job

```javascript
// Ejecutar cada 5 minutos
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
  const { data: dispositivos } = await supabase
    .from('dispositivos')
    .select('id')
    .eq('activo', true)
    .eq('tipo', 'zkteco');

  for (const disp of dispositivos) {
    try {
      await importarAsistencias(disp.id);
    } catch (error) {
      console.error(`Error sync ${disp.id}:`, error);
    }
  }
});
```

---

## Configuración del Dispositivo

### Pasos en el Dispositivo

1. **Configurar Red**
   ```
   Menu → Comm → Ethernet
   - DHCP: OFF
   - IP Address: 192.168.1.100
   - Subnet Mask: 255.255.255.0
   - Gateway: 192.168.1.1
   ```

2. **Configurar Comunicación**
   ```
   Menu → Comm → PC Connection
   - Comm Type: TCP/IP
   - IP Address: (IP del servidor)
   - Port: 4370
   ```

3. **Verificar Conexión**
   ```bash
   ping 192.168.1.100
   telnet 192.168.1.100 4370
   ```

---

## Manejo de Errores

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| ECONNREFUSED | Dispositivo apagado o IP incorrecta | Verificar conexión física |
| ETIMEDOUT | Red lenta o firewall | Verificar red y firewall |
| Invalid response | Protocolo incompatible | Verificar modelo soportado |
| Device busy | Otro cliente conectado | Esperar o reiniciar |

### Retry Logic

```javascript
async function connectWithRetry(device, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await device.connect();
      return true;
    } catch (error) {
      console.log(`Retry ${i + 1}/${maxRetries}`);
      await sleep(2000);
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Seguridad

### Recomendaciones

1. **Red Aislada**
   - VLAN dedicada para dispositivos
   - Sin acceso a internet

2. **Firewall**
   - Solo permitir puerto 4370
   - Solo desde servidor AsistApp

3. **Contraseña del Dispositivo**
   - Cambiar contraseña default
   - Limitar acceso al menú

---

## Plan de Implementación

### Fase 1: Backend Service
- [ ] Crear servicio Node.js
- [ ] Implementar conexión ZK
- [ ] Endpoint de test conexión
- [ ] Endpoint de sync usuarios

### Fase 2: Sincronización
- [ ] Importación de asistencias
- [ ] Job automático (cron)
- [ ] UI de estado de sync

### Fase 3: Gestión Biométrica
- [ ] Registro de huellas desde app
- [ ] Registro de rostros
- [ ] Eliminación de biométricos

---

## Navegación Relacionada

- [Manual Dispositivos](Manual-Dispositivos.md) - Configuración UI
- [Arquitectura](Arquitectura.md) - Visión técnica
- [Troubleshooting](Troubleshooting.md) - Solución de problemas
