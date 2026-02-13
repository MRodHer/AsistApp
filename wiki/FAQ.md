# Preguntas Frecuentes (FAQ)

Respuestas a las preguntas más comunes sobre AsistApp.

---

## General

### ¿Qué es AsistApp?

AsistApp es un sistema de control de asistencia que permite:
- Registrar entradas y salidas de empleados
- Gestionar horarios de trabajo
- Generar reportes de asistencia
- Integrar dispositivos biométricos ZKTeco

---

### ¿Cuánto cuesta?

**AsistApp es software de código abierto (MIT).**

Costos asociados:
- **Supabase**: Gratis hasta 500MB / $25+/mes planes Pro
- **Hosting**: $0-20/mes dependiendo de opción
- **Dispositivos ZKTeco**: $100-400 USD por unidad

---

### ¿Necesito internet?

**Para la aplicación web**: Sí, requiere conexión a internet para comunicarse con Supabase.

**Para dispositivos ZKTeco**: Solo necesitan red local. Los registros se almacenan localmente y se sincronizan cuando hay conexión.

---

### ¿Funciona en celular?

Sí, la interfaz es responsive. Sin embargo, el **Checador** está optimizado para tablets/kioscos por el tamaño de los elementos.

---

## Empleados

### ¿Cómo agrego un nuevo empleado?

1. Ir a **Empleados**
2. Click en **Agregar Empleado**
3. Completar formulario
4. Click en **Guardar**

---

### ¿Puedo importar empleados desde Excel?

No en la versión actual. Está planificado para futuras versiones.

**Workaround**: Insertar directamente en Supabase vía SQL o Table Editor.

---

### ¿Qué pasa si un empleado se va?

1. Ir a **Empleados**
2. Editar el empleado
3. Desmarcar "Empleado activo"
4. Guardar

**NO eliminar** si deseas conservar historial de asistencia.

---

### ¿Puedo tener empleados con el mismo nombre?

Sí, siempre que tengan **número de empleado diferente**.

---

## Asistencia

### ¿Cómo registro una entrada?

**Método manual (Checador)**:
1. Ir a `/checador`
2. Seleccionar **Entrada**
3. Ingresar número de empleado
4. Click en **Registrar**

**Método biométrico** (futuro):
Acercar huella o rostro al dispositivo ZKTeco.

---

### ¿Qué pasa si olvido registrar?

Contactar al administrador para registro manual en la base de datos.

---

### ¿Puedo corregir un registro erróneo?

No directamente desde la interfaz. El administrador debe:
1. Acceder a Supabase
2. Table Editor → asistencias
3. Editar o eliminar el registro

---

### ¿Se puede registrar asistencia desde casa?

Técnicamente sí, si el checador es accesible por internet. Sin embargo, no hay verificación de ubicación implementada.

---

## Horarios

### ¿Qué es la tolerancia?

Es el tiempo de gracia después de la hora de entrada antes de considerar como retardo.

**Ejemplo**: Entrada 08:00, tolerancia 15 min → Hasta 08:15 no es retardo.

---

### ¿Puedo tener múltiples horarios?

Sí. Puedes crear tantos horarios como necesites y asignarlos a diferentes empleados.

---

### ¿Cómo manejo turnos rotativos?

1. Crear cada turno como horario separado
2. Asignar con fecha_inicio y fecha_fin en la base de datos
3. Crear nueva asignación cuando cambie el turno

---

### ¿Los feriados se excluyen automáticamente?

No. Actualmente no hay calendario de feriados. Los días festivos cuentan como faltas si no hay registro.

---

## Reportes

### ¿Por qué los retardos muestran 0?

El cálculo de retardos requiere:
1. Empleado con horario asignado
2. Implementación completa (pendiente SPEC-ASIST-004)

---

### ¿Puedo exportar a Excel?

Sí, exportando a CSV. Excel abre archivos CSV directamente.

---

### ¿Los reportes son en tiempo real?

Los datos se actualizan al cargar la página. Para ver cambios recientes, recargar la página.

---

### ¿Puedo programar reportes automáticos?

No en la versión actual. Está planificado para futuras versiones.

---

## Dispositivos ZKTeco

### ¿Qué modelos son compatibles?

- ZK-F22 (huella + rostro)
- ZK-MB160 (multi-biométrico)
- ZK-K40 (solo huella)
- ZK-VF680 (solo rostro)
- Otros modelos ZKTeco con protocolo TCP/IP

---

### ¿Necesito comprar un dispositivo?

No es obligatorio. Puedes usar solo el checador manual (por número de empleado).

El dispositivo biométrico es para:
- Mayor seguridad (evitar suplantación)
- Mayor velocidad de registro
- Registro sin memorizar número

---

### ¿Dónde comprar dispositivos?

- Amazon
- MercadoLibre
- Distribuidores ZKTeco locales
- Tiendas de seguridad electrónica

---

### ¿La integración ya funciona?

La gestión de dispositivos (registrar IP, puerto) está implementada. La comunicación directa con los dispositivos está pendiente (SPEC-ASIST-004).

---

## Seguridad

### ¿Los datos están seguros?

Sí, los datos se almacenan en Supabase que ofrece:
- Encriptación en tránsito (HTTPS)
- Encriptación en reposo
- Backups automáticos
- Infraestructura cloud segura

---

### ¿Hay control de acceso?

No en la versión actual. Cualquier persona con acceso a la URL puede ver/modificar datos.

**Planificado**: Autenticación de usuarios y roles.

---

### ¿Se puede auditar quién hizo cambios?

No directamente. La columna `created_at` registra cuándo se creó un registro, pero no quién lo creó.

**Planificado**: Logs de auditoría completos.

---

## Técnico

### ¿Qué tecnologías usa?

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, REST API)
- **Hosting**: Cualquier servidor web estático

---

### ¿Puedo modificar el código?

Sí, es código abierto bajo licencia MIT. Puedes:
- Usar comercialmente
- Modificar
- Distribuir
- Uso privado

---

### ¿Cómo actualizo a nuevas versiones?

```bash
git pull origin master
npm install
npm run build
```

---

### ¿Hay API disponible?

Sí, Supabase expone automáticamente una API REST. Ver [API Reference](API-Reference.md).

---

## Soporte

### ¿Dónde reporto bugs?

En el repositorio de GitHub:
https://github.com/MRodHer/AsistApp/issues

---

### ¿Hay documentación técnica?

Sí, en esta wiki y en la carpeta `.moai/specs/` del proyecto.

---

### ¿Ofrecen soporte comercial?

Contactar al desarrollador para opciones de soporte y personalización.

---

## Navegación Relacionada

- [Troubleshooting](Troubleshooting.md) - Solución de problemas
- [Instalación](Instalacion.md) - Setup inicial
- [Manual de Usuario](Primer-Uso.md) - Guía de uso
