import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Empleado } from '../types/database';

export function Empleados() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);

  const { data: empleados, isLoading } = useQuery({
    queryKey: ['empleados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empleados')
        .select('*')
        .order('apellido_paterno');
      if (error) throw error;
      return data as Empleado[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('empleados').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
    },
  });

  const filteredEmpleados = empleados?.filter((emp) => {
    const fullName = `${emp.nombre} ${emp.apellido_paterno} ${emp.apellido_materno || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           emp.numero_empleado.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-600">Gestión de empleados del sistema</p>
        </div>
        <button
          onClick={() => { setEditingEmpleado(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Empleado
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o número de empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puesto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : filteredEmpleados?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No se encontraron empleados</p>
                </td>
              </tr>
            ) : (
              filteredEmpleados?.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {emp.foto_url ? (
                          <img src={emp.foto_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {emp.nombre} {emp.apellido_paterno} {emp.apellido_materno}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{emp.numero_empleado}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.departamento || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.puesto || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      emp.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {emp.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingEmpleado(emp); setShowModal(true); }}
                        className="p-2 text-gray-600 hover:text-asist-primary hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <EmpleadoModal
          empleado={editingEmpleado}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function EmpleadoModal({ empleado, onClose }: { empleado: Empleado | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    numero_empleado: empleado?.numero_empleado || '',
    nombre: empleado?.nombre || '',
    apellido_paterno: empleado?.apellido_paterno || '',
    apellido_materno: empleado?.apellido_materno || '',
    departamento: empleado?.departamento || '',
    puesto: empleado?.puesto || '',
    fecha_ingreso: empleado?.fecha_ingreso || new Date().toISOString().split('T')[0],
    activo: empleado?.activo ?? true,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (empleado) {
        const { error } = await supabase.from('empleados').update(data).eq('id', empleado.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('empleados').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Empleado *
              </label>
              <input
                type="text"
                required
                value={formData.numero_empleado}
                onChange={(e) => setFormData({ ...formData, numero_empleado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Paterno *
              </label>
              <input
                type="text"
                required
                value={formData.apellido_paterno}
                onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                value={formData.apellido_materno}
                onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puesto
              </label>
              <input
                type="text"
                value={formData.puesto}
                onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Ingreso
              </label>
              <input
                type="date"
                value={formData.fecha_ingreso}
                onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-asist-primary rounded border-gray-300 focus:ring-asist-primary"
                />
                <span className="text-sm text-gray-700">Empleado activo</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
