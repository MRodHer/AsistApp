import { useQuery } from '@tanstack/react-query';
import { Users, Clock, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', today],
    queryFn: async () => {
      const [empleadosRes, asistenciasRes] = await Promise.all([
        supabase.from('empleados').select('id', { count: 'exact' }).eq('activo', true),
        supabase.from('asistencias').select('empleado_id').eq('fecha', today).eq('tipo_registro', 'entrada'),
      ]);

      const totalEmpleados = empleadosRes.count || 0;
      const presentesHoy = new Set(asistenciasRes.data?.map(a => a.empleado_id) || []).size;
      const ausentesHoy = totalEmpleados - presentesHoy;

      return {
        totalEmpleados,
        presentesHoy,
        ausentesHoy,
      };
    },
  });

  const { data: ultimosRegistros } = useQuery({
    queryKey: ['ultimos-registros'],
    queryFn: async () => {
      const { data } = await supabase
        .from('asistencias')
        .select(`
          *,
          empleado:empleados(nombre, apellido_paterno, numero_empleado)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  const statCards = [
    {
      title: 'Total Empleados',
      value: stats?.totalEmpleados || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Presentes Hoy',
      value: stats?.presentesHoy || 0,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Ausentes Hoy',
      value: stats?.ausentesHoy || 0,
      icon: UserX,
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimos Registros */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Últimos Registros</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {ultimosRegistros?.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay registros de asistencia aún</p>
            </div>
          ) : (
            ultimosRegistros?.map((registro: any) => (
              <div key={registro.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    registro.tipo_registro === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      registro.tipo_registro === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {registro.empleado?.nombre} {registro.empleado?.apellido_paterno}
                    </p>
                    <p className="text-sm text-gray-500">
                      #{registro.empleado?.numero_empleado}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    registro.tipo_registro === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {registro.tipo_registro === 'entrada' ? 'Entrada' : 'Salida'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {registro.tipo_registro === 'entrada' ? registro.hora_entrada : registro.hora_salida}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
