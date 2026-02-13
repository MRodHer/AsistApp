-- AsistApp: Sistema de Control de Asistencia
-- Migración inicial

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
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

-- Tabla de horarios
CREATE TABLE IF NOT EXISTS horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    dias_laborales INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 0=Dom, 1=Lun, ..., 6=Sab
    activo BOOLEAN DEFAULT true
);

-- Relación empleado-horario
CREATE TABLE IF NOT EXISTS empleado_horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE,
    horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    UNIQUE(empleado_id, fecha_inicio)
);

-- Dispositivos biométricos
CREATE TABLE IF NOT EXISTS dispositivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('zkteco', 'camara', 'tablet')),
    ip_address INET,
    puerto INTEGER,
    ubicacion VARCHAR(200),
    activo BOOLEAN DEFAULT true,
    ultimo_sync TIMESTAMPTZ
);

-- Registros de asistencia
CREATE TABLE IF NOT EXISTS asistencias (
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

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_asistencias_empleado ON asistencias(empleado_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX IF NOT EXISTS idx_asistencias_empleado_fecha ON asistencias(empleado_id, fecha);
CREATE INDEX IF NOT EXISTS idx_empleados_activo ON empleados(activo);
CREATE INDEX IF NOT EXISTS idx_empleados_numero ON empleados(numero_empleado);

-- Trigger para actualizar updated_at
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

-- Datos de ejemplo: horario estándar
INSERT INTO horarios (nombre, hora_entrada, hora_salida, tolerancia_minutos, dias_laborales)
VALUES ('Horario Estándar', '08:00', '17:00', 15, ARRAY[1,2,3,4,5])
ON CONFLICT DO NOTHING;

-- Vista para reporte diario
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

-- RLS Policies (deshabilitado por ahora para simplicidad)
-- ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
