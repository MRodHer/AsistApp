# Respaldos

Guía para realizar y restaurar respaldos de AsistApp.

---

## Componentes a Respaldar

| Componente | Ubicación | Frecuencia | Criticidad |
|------------|-----------|------------|------------|
| Base de datos | Supabase | Diario | Alta |
| Código fuente | GitHub | Por commit | Media |
| Variables de entorno | .env | Semanal | Alta |
| Configuración | .moai/, wiki/ | Semanal | Baja |

---

## Respaldo de Base de Datos

### Método 1: Supabase Dashboard

1. Ir a **Settings** → **Database**
2. Sección **Database Backups**
3. Click en **Download backup**
4. Guardar archivo `.sql`

### Método 2: pg_dump

```bash
# Obtener connection string de Supabase Dashboard
# Settings → Database → Connection string → URI

pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --file backup_$(date +%Y%m%d).sql \
  --no-owner \
  --no-acl
```

### Método 3: Script Automatizado

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/asistapp"
DB_URL="postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres"

mkdir -p $BACKUP_DIR

pg_dump "$DB_URL" \
  --file "$BACKUP_DIR/backup_$DATE.sql" \
  --no-owner \
  --no-acl

# Comprimir
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completado: backup_$DATE.sql.gz"
```

### Cron Job

```bash
# Ejecutar backup diario a las 3 AM
0 3 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

---

## Respaldo de Código

### GitHub (Automático)

El código se respalda automáticamente con cada push:

```bash
git add -A
git commit -m "Cambios del día"
git push origin master
```

### Clon Local

```bash
# Clon completo del repositorio
git clone --mirror https://github.com/MRodHer/AsistApp.git AsistApp.git

# Actualizar mirror
cd AsistApp.git && git fetch --all
```

---

## Respaldo de Configuración

### Variables de Entorno

```bash
# Respaldar .env (SIN subir a git)
cp .env .env.backup.$(date +%Y%m%d)

# Guardar en lugar seguro (encriptado)
gpg -c .env.backup.$(date +%Y%m%d)
```

### Configuración MoAI

```bash
# Incluido en git, pero respaldo adicional
tar -czvf moai_config_$(date +%Y%m%d).tar.gz .moai/
```

---

## Restauración

### Restaurar Base de Datos

#### Desde SQL dump

```bash
# 1. Conectar a Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# 2. Limpiar tablas existentes (CUIDADO)
DROP TABLE IF EXISTS asistencias CASCADE;
DROP TABLE IF EXISTS empleado_horarios CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS dispositivos CASCADE;

# 3. Restaurar
\i backup_20240213.sql
```

#### Desde Supabase

1. **Settings** → **Database**
2. **Point-in-time Recovery** (si está disponible)
3. Seleccionar fecha/hora
4. Confirmar restauración

### Restaurar Código

```bash
# Clonar desde GitHub
git clone https://github.com/MRodHer/AsistApp.git
cd AsistApp

# O restaurar desde mirror
git clone /backups/AsistApp.git AsistApp
```

### Restaurar .env

```bash
# Desencriptar
gpg -d .env.backup.20240213.gpg > .env

# O copiar de backup
cp .env.backup.20240213 .env
```

---

## Verificación de Respaldos

### Checklist Semanal

- [ ] Verificar que existen backups de los últimos 7 días
- [ ] Verificar tamaño de archivos (no vacíos)
- [ ] Verificar integridad de al menos un backup
- [ ] Revisar logs de errores

### Test de Restauración

```bash
# 1. Crear BD de prueba
createdb asistapp_test

# 2. Restaurar backup
psql asistapp_test < backup_20240213.sql

# 3. Verificar datos
psql asistapp_test -c "SELECT COUNT(*) FROM empleados;"
psql asistapp_test -c "SELECT COUNT(*) FROM asistencias;"

# 4. Limpiar
dropdb asistapp_test
```

---

## Almacenamiento de Respaldos

### Recomendaciones

| Tipo | Retención | Ubicación |
|------|-----------|-----------|
| Diario | 7 días | Servidor local |
| Semanal | 4 semanas | Nube (S3, GCS) |
| Mensual | 12 meses | Offline/Cinta |

### Amazon S3

```bash
# Subir a S3
aws s3 cp backup_$DATE.sql.gz s3://mi-bucket/asistapp/

# Lifecycle policy para expiración automática
```

### Google Cloud Storage

```bash
# Subir a GCS
gsutil cp backup_$DATE.sql.gz gs://mi-bucket/asistapp/
```

---

## Recuperación de Desastres

### Escenario: Pérdida Total

1. **Obtener último backup de BD**
2. **Clonar código desde GitHub**
3. **Restaurar .env desde backup encriptado**
4. **Crear nuevo proyecto Supabase**
5. **Ejecutar migración + restaurar datos**
6. **Actualizar .env con nuevas credenciales**
7. **Desplegar aplicación**
8. **Verificar funcionamiento**

### RTO/RPO

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| RTO (Recovery Time) | < 4 horas | ~2 horas |
| RPO (Recovery Point) | < 24 horas | ~24 horas |

---

## Exportación de Datos

### Para Auditoría

```sql
-- Exportar asistencias del mes
COPY (
  SELECT e.numero_empleado, e.nombre, e.apellido_paterno,
         a.fecha, a.hora_entrada, a.hora_salida
  FROM asistencias a
  JOIN empleados e ON a.empleado_id = e.id
  WHERE a.fecha BETWEEN '2024-02-01' AND '2024-02-29'
) TO '/tmp/asistencias_febrero.csv' CSV HEADER;
```

### Para Migración

```bash
# Exportar esquema
pg_dump --schema-only > schema.sql

# Exportar datos
pg_dump --data-only > data.sql
```

---

## Navegación Relacionada

- [Base de Datos](Base-de-Datos.md) - Estructura de datos
- [Troubleshooting](Troubleshooting.md) - Solución de problemas
- [Arquitectura](Arquitectura.md) - Visión técnica
