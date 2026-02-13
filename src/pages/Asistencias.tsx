import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Search, Filter, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type FilterPeriod = 'hoy' | 'semana' | 'mes' | 'custom';

export function Asistencias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [period, setPeriod] = useState<FilterPeriod>('hoy');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const getDateRange = () => {
    const today = new Date();
    switch (period) {
      case 'hoy':
        return { from: format(today, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') };
      case 'semana':
        return {
          from: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
          to: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        };
      case 'mes':
        return {
          from: format(startOfMonth(today), 'yyyy-MM-dd'),
          to: format(endOfMonth(today), 'yyyy-MM-dd'),
        };
      case 'custom':
        return { from: customDateFrom, to: customDateTo };
      default:
        return { from: format(today, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') };
    }
  };

  const dateRange = getDateRange();

  const { data: asistencias, isLoading } = useQuery({
    queryKey: ['asistencias', dateRange.from, dateRange.to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asistencias')
        .select(`
          *,
          empleado:empleados(nombre, apellido_paterno, apellido_materno, numero_empleado, departamento)
        `)
        .gte('fecha', dateRange.from)
        .lte('fecha', dateRange.to)
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  const filteredAsistencias = asistencias?.filter((a: any) => {
    if (!searchTerm) return true;
    const fullName = `${a.empleado?.nombre} ${a.empleado?.apellido_paterno}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           a.empleado?.numero_empleado?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportToCSV = () => {
    if (!filteredAsistencias?.length) return;

    const headers = ['Fecha', 'Empleado', 'No. Empleado', 'Departamento', 'Tipo', 'Hora', 'Método'];
    const rows = filteredAsistencias.map((a: any) => [
      a.fecha,
      `${a.empleado?.nombre} ${a.empleado?.apellido_paterno}`,
      a.empleado?.numero_empleado,
      a.empleado?.departamento || '',
      a.tipo_registro,
      a.tipo_registro === 'entrada' ? a.hora_entrada : a.hora_salida,
      a.metodo_registro,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencias_${dateRange.from}_${dateRange.to}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asistencias</h1>
          <p className="text-gray-600">Registro de entradas y salidas</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={!filteredAsistencias?.length}
          className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as FilterPeriod)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Custom date range */}
          {period === 'custom' && (
            <>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : filteredAsistencias?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay registros en este período</p>
                </td>
              </tr>
            ) : (
              filteredAsistencias?.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(a.fecha), "d 'de' MMM, yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {a.empleado?.nombre} {a.empleado?.apellido_paterno}
                      </p>
                      <p className="text-sm text-gray-500">#{a.empleado?.numero_empleado}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{a.empleado?.departamento || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      a.tipo_registro === 'entrada'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {a.tipo_registro === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-900">
                    {a.tipo_registro === 'entrada' ? a.hora_entrada : a.hora_salida}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
                      {a.metodo_registro}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
