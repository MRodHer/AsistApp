# Base de Datos

Documentación del modelo de datos de AsistApp.

---

## Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐
│    empleados    │       │    horarios     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ numero_empleado │       │ nombre          │
│ nombre          │       │ hora_entrada    │
│ apellido_paterno│       │ hora_salida     │
│ apellido_materno│       │ tolerancia_min  │
│ departamento    │       │ dias_laborales  │
│ puesto          │       │ activo          │
│ fecha_ingreso   │       └────────┬────────┘
│ activo          │                │
│ foto_url        │                │
│ huella_id       │                │
│ rostro_id       │                │
└────────┬────────┘                │
         │                         │
         │    ┌────────────────────┘
         │    │
         ▼    ▼
┌─────────────────────┐
│  empleado_horarios  │
├─────────────────────┤
│ id (PK)             │
│ empleado_id (FK)    │
│ horario_id (FK)     │
│ fecha_inicio        │
│ fecha_fin           │
└─────────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│   asistencias   │       │  dispositivos   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ empleado_id(FK) │───────│ nombre          │
│ fecha           │       │ tipo            │
│ hora_entrada    │       │ ip_address      │
│ hora_salida     │       │ puerto          │
│ tipo_registro   │       │ ubicacion       │
│ metodo_registro │       │ activo          │
│ dispositivo_id  │───────│ ultimo_sync     │
│ notas           │       └─────────────────┘
└─────────────────┘
```

---

## Tablas

### empleados

Almacena información de los trabajadores.

```sql
CREATE TABLE empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    numero_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    departamento VARCHAR(100),
    puesto VARCHAR(100),
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    foto_url TEXT,
    huella_id VARCHAR(100),
    rostro_id VARCHAR(100)
);
```

| Columna | Tipo | Null | Default | Descripción |
|---------|------|------|---------|-------------|
| id | UUID | NO | auto | Identificador único |
| created_at | TIMESTAMPTZ | NO | NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | NO | NOW() | Última modificación |
| numero_empleado | VARCHAR(20) | NO | - | Número único de empleado |
| nombre | VARCHAR(100) | NO | - | Nombre(s) |
| apellido_paterno | VARCHAR(100) | NO | - | Primer apellido |
| apellido_materno | VARCHAR(100) | SÍ | NULL | Segundo apellido |
| departamento | VARCHAR(100) | SÍ | NULL | Área de trabajo |
| puesto | VARCHAR(100) | SÍ | NULL | Cargo |
| fecha_ingreso | DATE | NO | CURRENT_DATE | Fecha de alta |
| activo | BOOLEAN | NO | true | Estado activo/inactivo |
| foto_url | TEXT | SÍ | NULL | URL de foto |
| huella_id | VARCHAR(100) | SÍ | NULL | ID en dispositivo (huella) |
| rostro_id | VARCHAR(100) | SÍ | NULL | ID en dispositivo (rostro) |

**Índices**:
```sql
CREATE INDEX idx_empleados_activo ON empleados(activo);
CREATE INDEX idx_empleados_numero ON empleados(numero_empleado);
```

---

### horarios

Define los turnos de trabajo.

```sql
CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    dias_laborales INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    activo BOOLEAN DEFAULT true
);
```

| Columna | Tipo | Null | Default | Descripción |
|---------|------|------|---------|-------------|
| id | UUID | NO | auto | Identificador único |
| created_at | TIMESTAMPTZ | NO | NOW() | Fecha de creación |
| nombre | VARCHAR(100) | NO | - | Nombre del horario |
| hora_entrada | TIME | NO | - | Hora esperada de entrada |
| hora_salida | TIME | NO | - | Hora esperada de salida |
| tolerancia_minutos | INTEGER | NO | 15 | Minutos de tolerancia |
| dias_laborales | INTEGER[] | NO | [1,2,3,4,5] | Días de la semana (0=Dom) |
| activo | BOOLEAN | NO | true | Si está vigente |

---

### empleado_horarios

Relación entre empleados y horarios.

```sql
CREATE TABLE empleado_horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE,
    horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    UNIQUE(empleado_id, fecha_inicio)
);
```

| Columna | Tipo | Null | Default | Descripción |
|---------|------|------|---------|-------------|
| id | UUID | NO | auto | Identificador único |
| empleado_id | UUID | NO | - | FK a empleados |
| horario_id | UUID | NO | - | FK a horarios |
| fecha_inicio | DATE | NO | CURRENT_DATE | Inicio de vigencia |
| fecha_fin | DATE | SÍ | NULL | Fin de vigencia (null=activo) |

---

### dispositivos

Registra los dispositivos biométricos.

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
```

| Columna | Tipo | Null | Default | Descripción |
|---------|------|------|---------|-------------|
| id | UUID | NO | auto | Identificador único |
| created_at | TIMESTAMPTZ | NO | NOW() | Fecha de creación |
| nombre | VARCHAR(100) | NO | - | Nombre descriptivo |
| tipo | VARCHAR(20) | NO | - | Tipo de dispositivo |
| ip_address | INET | SÍ | NULL | Dirección IP |
| puerto | INTEGER | SÍ | 4370 | Puerto TCP |
| ubicacion | VARCHAR(200) | SÍ | NULL | Ubicación física |
| activo | BOOLEAN | NO | true | Si está activo |
| ultimo_sync | TIMESTAMPTZ | SÍ | NULL | Última sincronización |

---

### asistencias

Registros de entrada/salida.

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

| Columna | Tipo | Null | Default | Descripción |
|---------|------|------|---------|-------------|
| id | UUID | NO | auto | Identificador único |
| created_at | TIMESTAMPTZ | NO | NOW() | Momento del registro |
| empleado_id | UUID | NO | - | FK a empleados |
| fecha | DATE | NO | CURRENT_DATE | Fecha del registro |
| hora_entrada | TIME | SÍ | NULL | Hora de entrada |
| hora_salida | TIME | SÍ | NULL | Hora de salida |
| tipo_registro | VARCHAR(10) | NO | - | 'entrada' o 'salida' |
| metodo_registro | VARCHAR(10) | NO | - | Método usado |
| dispositivo_id | UUID | SÍ | NULL | FK a dispositivos |
| notas | TEXT | SÍ | NULL | Observaciones |

**Índices**:
```sql
CREATE INDEX idx_asistencias_empleado ON asistencias(empleado_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_asistencias_empleado_fecha ON asistencias(empleado_id, fecha);
```

---

## Vistas

### vista_asistencia_diaria

Consolidación diaria de asistencia.

```sql
CREATE OR REPLACE VIEW vista_asistencia_diaria AS
SELECT
    e.id as empleado_id,
    e.numero_empleado,
    e.nombre || ' ' || e.apellido_paterno || COALESCE(' ' || e.apellido_materno, '') as nombre_completo,
    e.departamento,
    a.fecha,
    MIN(CASE WHEN a.tipo_registro = 'entrada' THEN a.hora_entrada END) as primera_entrada,
    MAX(CASE WHEN a.tipo_registro = 'salida' THEN a.hora_salida END) as ultima_salida,
    h.hora_entrada as hora_entrada_esperada,
    h.hora_salida as hora_salida_esperada,
    h.tolerancia_minutos
FROM empleados e
LEFT JOIN asistencias a ON e.id = a.empleado_id
LEFT JOIN empleado_horarios eh ON e.id = eh.empleado_id
    AND a.fecha BETWEEN eh.fecha_inicio AND COALESCE(eh.fecha_fin, '9999-12-31')
LEFT JOIN horarios h ON eh.horario_id = h.id
WHERE e.activo = true
GROUP BY e.id, e.numero_empleado, e.nombre, e.apellido_paterno, e.apellido_materno,
         e.departamento, a.fecha, h.hora_entrada, h.hora_salida, h.tolerancia_minutos;
```

---

## Triggers

### update_updated_at

Actualiza automáticamente `updated_at` en empleados.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_empleados_updated_at
    BEFORE UPDATE ON empleados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Queries Comunes

### Empleados activos
```sql
SELECT * FROM empleados WHERE activo = true ORDER BY apellido_paterno;
```

### Asistencias de hoy
```sql
SELECT a.*, e.nombre, e.apellido_paterno
FROM asistencias a
JOIN empleados e ON a.empleado_id = e.id
WHERE a.fecha = CURRENT_DATE
ORDER BY a.created_at DESC;
```

### Conteo de presentes/ausentes
```sql
WITH presentes AS (
    SELECT DISTINCT empleado_id
    FROM asistencias
    WHERE fecha = CURRENT_DATE AND tipo_registro = 'entrada'
)
SELECT
    (SELECT COUNT(*) FROM empleados WHERE activo = true) as total,
    (SELECT COUNT(*) FROM presentes) as presentes,
    (SELECT COUNT(*) FROM empleados WHERE activo = true) -
    (SELECT COUNT(*) FROM presentes) as ausentes;
```

---

## Navegación Relacionada

- [Arquitectura](Arquitectura.md) - Visión general
- [API Reference](API-Reference.md) - Endpoints
- [Respaldos](Respaldos.md) - Backup de datos
