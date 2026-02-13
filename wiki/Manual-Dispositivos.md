# Manual de Configuración de Dispositivos

Guía para registrar y configurar dispositivos biométricos y de registro.

---

## Acceso

**URL**: `/configuracion` → Pestaña **Dispositivos**

**Navegación**: Menú lateral → Configuración → Dispositivos

---

## Tipos de Dispositivos

### ZKTeco Biométrico

Lectores de huella y/o rostro de la marca ZKTeco.

| Característica | Valor |
|----------------|-------|
| Conexión | TCP/IP |
| Puerto default | 4370 |
| Protocolos | Propietario ZK |

**Modelos soportados**:
- ZK-F22 (huella + rostro)
- ZK-MB160 (multi-biométrico)
- ZK-K40 (solo huella)
- ZK-VF680 (solo rostro)

### Cámara IP

Cámaras con reconocimiento facial vía software.

| Característica | Valor |
|----------------|-------|
| Conexión | TCP/IP |
| Puerto | Variable |
| Protocolos | RTSP, HTTP |

### Tablet/Kiosko

Dispositivos Android/iOS con la app del checador.

| Característica | Valor |
|----------------|-------|
| Conexión | WiFi/Ethernet |
| Interfaz | Web browser |
| URL | /checador |

---

## Vista de Dispositivos

### Lista de Dispositivos

| Columna | Descripción |
|---------|-------------|
| Icono | Estado de conexión (verde/rojo) |
| Nombre | Identificador del dispositivo |
| Tipo | ZKTeco / Cámara / Tablet |
| IP:Puerto | Dirección de red |
| Estado | Badge Activo/Inactivo |
| Acciones | Editar / Eliminar |

---

## Operaciones

### Agregar Dispositivo

1. Click en **Agregar Dispositivo**
2. Completar formulario:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Nombre | Texto | ✅ | Identificador descriptivo |
| Tipo | Select | ✅ | ZKTeco / Cámara / Tablet |
| IP Address | Texto | ❌ | Dirección IPv4 |
| Puerto | Número | ❌ | Puerto TCP (default: 4370) |
| Ubicación | Texto | ❌ | Descripción física |
| Activo | Check | ✅ | Si está en uso |

3. Click en **Guardar**

### Editar Dispositivo

1. Localizar en la lista
2. Click en icono de **lápiz**
3. Modificar campos
4. Click en **Guardar**

### Eliminar Dispositivo

1. Click en icono de **papelera**
2. Confirmar eliminación

---

## Configuración de ZKTeco

### Paso 1: Configurar el Dispositivo

En el dispositivo ZKTeco:

1. Ir a **Menu** → **Comm** → **Ethernet**
2. Configurar:
   - **DHCP**: OFF (recomendado IP fija)
   - **IP Address**: Ej: 192.168.1.100
   - **Subnet Mask**: 255.255.255.0
   - **Gateway**: IP del router
3. Ir a **Comm** → **PC Connection**
   - **Comm Type**: TCP/IP
   - **IP Address**: IP del servidor AsistApp
   - **Port**: 4370

### Paso 2: Verificar Conectividad

Desde el servidor:

```bash
# Probar conexión
ping 192.168.1.100

# Probar puerto
nc -zv 192.168.1.100 4370
```

### Paso 3: Registrar en AsistApp

1. Configuración → Dispositivos → Agregar
2. Nombre: "Checador Entrada Principal"
3. Tipo: ZKTeco Biométrico
4. IP: 192.168.1.100
5. Puerto: 4370
6. Ubicación: "Entrada principal, junto a recepción"
7. Guardar

---

## Especificaciones ZKTeco

### Comunicación

```
Protocolo: TCP/IP
Puerto: 4370 (por defecto)
Timeout: 5000ms
Encriptación: Ninguna (red local)
```

### Capacidades por Modelo

| Modelo | Usuarios | Huellas | Rostros | Registros |
|--------|----------|---------|---------|-----------|
| ZK-F22 | 3,000 | 3,000 | 1,500 | 100,000 |
| ZK-MB160 | 6,000 | 6,000 | 3,000 | 200,000 |
| ZK-K40 | 1,000 | 2,000 | - | 50,000 |
| ZK-VF680 | 1,200 | - | 1,200 | 100,000 |

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| Connect | Establecer conexión |
| Disconnect | Cerrar conexión |
| GetAllUserInfo | Obtener usuarios |
| SetUserInfo | Registrar usuario |
| GetAttendance | Obtener asistencias |
| ClearAttendance | Borrar registros |
| GetDeviceInfo | Info del dispositivo |

---

## Sincronización

### Proceso de Sincronización

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AsistApp   │────▶│   Backend   │────▶│   ZKTeco    │
│   (Front)   │     │   (Node)    │     │  (Device)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Supabase   │
                    │    (DB)     │
                    └─────────────┘
```

### Tipos de Sincronización

| Tipo | Dirección | Propósito |
|------|-----------|-----------|
| Usuarios | App → Device | Registrar empleados en lector |
| Asistencias | Device → App | Importar registros |
| Huellas | Device ↔ App | Gestión biométrica |

### Estado de Implementación

| Funcionalidad | Estado |
|---------------|--------|
| Registro de dispositivo | ✅ Implementado |
| Test de conexión | ⏳ Pendiente |
| Sync usuarios | ⏳ Pendiente |
| Import asistencias | ⏳ Pendiente |
| Sync huellas | ⏳ Pendiente |

---

## Solución de Problemas

### Dispositivo No Conecta

**Verificar**:
1. Dispositivo encendido
2. Cable de red conectado
3. Misma subred que el servidor
4. Puerto 4370 no bloqueado por firewall

**Comandos útiles**:
```bash
# Verificar IP
ping 192.168.1.100

# Verificar puerto
telnet 192.168.1.100 4370

# Ver tabla ARP
arp -a | grep 192.168.1.100
```

### Error de Timeout

**Causas**:
- Red congestionada
- Dispositivo ocupado
- IP incorrecta

**Soluciones**:
1. Verificar IP en dispositivo
2. Reiniciar dispositivo
3. Aumentar timeout en configuración

### Registros No Importan

**Verificar**:
1. Hay registros en el dispositivo
2. La fecha/hora del dispositivo es correcta
3. Los IDs de usuario coinciden

---

## Ubicación Física

### Recomendaciones

| Aspecto | Recomendación |
|---------|---------------|
| Altura | 1.2 - 1.4 metros |
| Iluminación | Evitar luz directa |
| Acceso | Zona de paso obligado |
| Protección | Carcasa si es área industrial |
| Red | Cable ethernet preferido |

### Diagrama de Instalación

```
         ┌─────────────────────────────────────┐
         │           ÁREA DE ENTRADA           │
         │                                     │
         │    ┌─────────┐                      │
         │    │ ZKTeco  │◄── 1.3m del suelo    │
         │    │ Device  │                      │
         │    └────┬────┘                      │
         │         │ Cable ethernet            │
         │    ┌────┴────┐                      │
         │    │ Switch  │                      │
         │    └────┬────┘                      │
         │         │                           │
         └─────────┼───────────────────────────┘
                   │
              Al servidor
```

---

## Seguridad

### Recomendaciones

1. **Red dedicada**: Aislar dispositivos en VLAN
2. **Firewall**: Permitir solo puertos necesarios
3. **Acceso físico**: Proteger el dispositivo
4. **Backups**: Respaldar datos periódicamente

### Puertos Requeridos

| Puerto | Protocolo | Dirección | Uso |
|--------|-----------|-----------|-----|
| 4370 | TCP | Bidireccional | Comunicación principal |
| 80 | TCP | Saliente | Actualizaciones (opcional) |

---

## Preguntas Frecuentes

### ¿Puedo usar WiFi en lugar de cable?

Sí, si el dispositivo lo soporta. El cable ethernet es más confiable.

### ¿Qué pasa si el dispositivo se desconecta?

Los registros se almacenan localmente en el dispositivo hasta que se sincronicen.

### ¿Cuántos dispositivos puedo tener?

No hay límite en el software. Depende de la capacidad de red y servidor.

### ¿Los dispositivos necesitan internet?

No, solo conexión a la red local donde está el servidor.

---

## Navegación Relacionada

- [Integración ZKTeco](Integracion-ZKTeco.md) - Detalles técnicos
- [Checador](Manual-Checador.md) - Uso del checador
- [Troubleshooting](Troubleshooting.md) - Solución de problemas
