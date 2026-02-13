import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Calendar, Users, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';

type ReportType = 'resumen' | 'retardos' | 'faltas' | 'horas';

export function Reportes() {
  const [reportType, setReportType] = useState<ReportType>('resumen');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  const startDate = startOfMonth(new Date(month + '-01'));
  const endDate = endOfMonth(startDate);

  const { data: empleados } = useQuery({
    queryKey: ['empleados-activos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('empleados')
        .select('*')
        .eq('activo', true)
        .order('apellido_paterno');
      return data || [];
    },
  });

  const { data: asistencias } = useQuery({
    queryKey: ['asistencias-reporte', month],
    queryFn: async () => {
      const { data } = await supabase
        .from('asistencias')
        .select('*')
        .gte('fecha', format(startDate, 'yyyy-MM-dd'))
        .lte('fecha', format(endDate, 'yyyy-MM-dd'));
      return data || [];
    },
  });

  // Calculate statistics
  const workDays = eachDayOfInterval({ start: startDate, end: endDate })
    .filter(d => !isWeekend(d)).length;

  const getEmpleadoStats = (empleadoId: string) => {
    const empAsistencias = asistencias?.filter(a => a.empleado_id === empleadoId) || [];
    const diasConEntrada = new Set(empAsistencias.filter(a => a.tipo_registro === 'entrada').map(a => a.fecha)).size;
    const diasConSalida = new Set(empAsistencias.filter(a => a.tipo_registro === 'salida').map(a => a.fecha)).size;

    return {
      diasTrabajados: diasConEntrada,
      faltas: Math.max(0, workDays - diasConEntrada),
      retardos: 0, // Would need horario data to calculate
    };
  };

  const reportCards = [
    { id: 'resumen', title: 'Resumen General', icon: FileText },
    { id: 'retardos', title: 'Retardos', icon: Clock },
    { id: 'faltas', title: 'Faltas', icon: AlertTriangle },
    { id: 'horas', title: 'Horas Trabajadas', icon: Calendar },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Análisis y estadísticas de asistencia</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {reportCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setReportType(card.id as ReportType)}
            className={`p-4 rounded-xl text-left transition-all ${
              reportType === card.id
                ? 'bg-asist-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <card.icon className={`w-6 h-6 mb-2 ${reportType === card.id ? 'text-white' : 'text-asist-primary'}`} />
            <p className="font-medium">{card.title}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {reportCards.find(r => r.id === reportType)?.title} - {format(startDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 text-asist-primary hover:bg-asist-primary/10 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{empleados?.length || 0}</p>
            <p className="text-sm text-gray-600">Empleados Activos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{workDays}</p>
            <p className="text-sm text-gray-600">Días Laborales</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{asistencias?.length || 0}</p>
            <p className="text-sm text-gray-600">Registros Totales</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Días Trabajados</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faltas</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Retardos</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empleados?.map((emp: any) => {
                const stats = getEmpleadoStats(emp.id);
                const asistenciaPct = workDays > 0 ? Math.round((stats.diasTrabajados / workDays) * 100) : 0;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {emp.nombre} {emp.apellido_paterno} {emp.apellido_materno}
                        </p>
                        <p className="text-sm text-gray-500">#{emp.numero_empleado}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      {stats.diasTrabajados}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stats.faltas > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {stats.faltas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stats.retardos > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {stats.retardos}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              asistenciaPct >= 90 ? 'bg-green-500' :
                              asistenciaPct >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${asistenciaPct}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{asistenciaPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
