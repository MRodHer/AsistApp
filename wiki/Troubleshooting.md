# Troubleshooting

Guía de solución de problemas comunes en AsistApp.

---

## Problemas de Aplicación

### La aplicación no carga

**Síntomas**:
- Pantalla en blanco
- Error en consola del navegador

**Diagnóstico**:
```bash
# Verificar que el servidor está corriendo
curl http://localhost:5173

# Ver logs de desarrollo
npm run dev
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Puerto ocupado | Cambiar puerto en vite.config.ts |
| Dependencias faltantes | `npm install` |
| Error de build | `npm run build` y ver errores |

---

### Error de conexión a Supabase

**Síntomas**:
- "Error de conexión"
- Datos no cargan

**Diagnóstico**:
```javascript
// En consola del navegador
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| .env no existe | Crear desde .env.example |
| Variables incorrectas | Verificar en Supabase Dashboard |
| Proyecto pausado | Reactivar en Supabase |

---

### Estilos no se aplican

**Síntomas**:
- Página sin estilos
- Tailwind no funciona

**Diagnóstico**:
```bash
# Verificar postcss
cat postcss.config.js

# Verificar CSS
head src/index.css
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| PostCSS mal configurado | Verificar `@tailwindcss/postcss` |
| CSS no importado | Verificar import en main.tsx |
| Build no actualizado | `npm run build` |

---

## Problemas del Checador

### "Empleado no encontrado"

**Síntomas**:
- Mensaje de error al registrar
- Empleado existe en sistema

**Diagnóstico**:
```sql
-- Verificar en Supabase SQL Editor
SELECT * FROM empleados WHERE numero_empleado = 'XXXX';
SELECT activo FROM empleados WHERE numero_empleado = 'XXXX';
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Número incorrecto | Verificar número exacto |
| Empleado inactivo | Activar en Empleados |
| Espacios en número | Trim del input |

---

### El reloj no actualiza

**Síntomas**:
- Hora congelada
- Segundos no cambian

**Soluciones**:

| Causa | Solución |
|-------|----------|
| JavaScript bloqueado | Permitir JS en navegador |
| Error de componente | Recargar página (F5) |
| Navegador antiguo | Actualizar navegador |

---

### Registro duplicado

**Síntomas**:
- Mismo empleado aparece dos veces
- Mismo horario

**Diagnóstico**:
```sql
SELECT * FROM asistencias
WHERE empleado_id = 'xxx'
AND fecha = CURRENT_DATE
ORDER BY created_at;
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Click múltiple | Implementar debounce |
| Sin confirmación visual | Esperar mensaje |

---

## Problemas de Base de Datos

### Error de duplicado (23505)

**Síntoma**:
```
duplicate key value violates unique constraint
```

**Solución**:
- Usar número de empleado diferente
- Verificar que no existe ya

---

### Error de foreign key (23503)

**Síntoma**:
```
insert or update violates foreign key constraint
```

**Solución**:
- El registro referenciado no existe
- Verificar que empleado_id/horario_id existen

---

### Migración fallida

**Síntomas**:
- Tablas no existen
- Error al ejecutar SQL

**Soluciones**:
1. Ir a Supabase → SQL Editor
2. Copiar contenido de `001_initial_schema.sql`
3. Ejecutar por partes si hay error
4. Verificar mensajes de error específicos

---

## Problemas de Red

### Timeout de conexión

**Síntomas**:
- Carga lenta
- Requests fallan

**Diagnóstico**:
```bash
# Probar conectividad
ping db.xxx.supabase.co

# Probar API
curl https://xxx.supabase.co/rest/v1/empleados
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Internet inestable | Verificar conexión |
| Firewall | Permitir puerto 443 |
| DNS | Usar DNS público (8.8.8.8) |

---

## Problemas de Dispositivos ZKTeco

### No conecta

**Síntomas**:
- Estado "Desconectado"
- Timeout en test

**Diagnóstico**:
```bash
# Verificar IP
ping 192.168.1.100

# Verificar puerto
nc -zv 192.168.1.100 4370
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| IP incorrecta | Verificar en dispositivo |
| Dispositivo apagado | Encender |
| Red diferente | Verificar VLAN/subnet |
| Firewall | Permitir puerto 4370 |

---

### No sincroniza usuarios

**Síntomas**:
- Usuarios no aparecen en dispositivo
- Error de sincronización

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Capacidad llena | Borrar usuarios antiguos |
| Conexión inestable | Verificar cable ethernet |
| Firmware antiguo | Actualizar dispositivo |

---

## Problemas de Reportes

### Datos incorrectos

**Síntomas**:
- Faltas que no son faltas
- Retardos no calculados

**Diagnóstico**:
```sql
-- Verificar registros
SELECT * FROM asistencias
WHERE empleado_id = 'xxx'
AND fecha BETWEEN '2024-02-01' AND '2024-02-29';

-- Verificar horario asignado
SELECT * FROM empleado_horarios WHERE empleado_id = 'xxx';
```

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Sin horario asignado | Asignar horario |
| Feriados no excluidos | No implementado aún |
| Registros incompletos | Verificar entrada/salida |

---

### Exportación vacía

**Síntomas**:
- CSV sin datos
- Solo headers

**Soluciones**:

| Causa | Solución |
|-------|----------|
| Filtro muy restrictivo | Ampliar rango de fechas |
| Sin registros | Verificar período |

---

## Logs y Debugging

### Ver logs del navegador

```
Chrome/Firefox: F12 → Console
```

### Ver errores de React Query

```javascript
// En consola
localStorage.setItem('tanstack-query-devtools', 'true');
// Recargar página
```

### Ver requests de red

```
Chrome/Firefox: F12 → Network
```

---

## Reinicio Completo

Si todo falla:

1. **Detener aplicación**
   ```bash
   # Ctrl+C en terminal de dev
   ```

2. **Limpiar caché**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   ```

3. **Reinstalar dependencias**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Verificar .env**
   ```bash
   cat .env
   ```

5. **Reiniciar**
   ```bash
   npm run dev
   ```

---

## Contacto de Soporte

Si el problema persiste:

1. Documentar el error exacto
2. Capturar screenshot
3. Copiar logs de consola
4. Describir pasos para reproducir
5. Contactar administrador del sistema

---

## Navegación Relacionada

- [FAQ](FAQ.md) - Preguntas frecuentes
- [Instalación](Instalacion.md) - Setup inicial
- [Arquitectura](Arquitectura.md) - Entender el sistema
