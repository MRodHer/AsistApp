import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Wifi, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Horario, Dispositivo } from '../types/database';

type Tab = 'horarios' | 'dispositivos';

export function Configuracion() {
  const [activeTab, setActiveTab] = useState<Tab>('horarios');

  const tabs = [
    { id: 'horarios', label: 'Horarios', icon: Clock },
    { id: 'dispositivos', label: 'Dispositivos', icon: Wifi },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Administra horarios y dispositivos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-asist-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'horarios' && <HorariosSection />}
      {activeTab === 'dispositivos' && <DispositivosSection />}
    </div>
  );
}

function HorariosSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);

  const { data: horarios, isLoading } = useQuery({
    queryKey: ['horarios'],
    queryFn: async () => {
      const { data, error } = await supabase.from('horarios').select('*').order('nombre');
      if (error) throw error;
      return data as Horario[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('horarios').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['horarios'] }),
  });

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Horarios de Trabajo</h2>
        <button
          onClick={() => { setEditingHorario(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Horario
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="px-6 py-8 text-center text-gray-500">Cargando...</div>
        ) : horarios?.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay horarios configurados</p>
          </div>
        ) : (
          horarios?.map((horario) => (
            <div key={horario.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{horario.nombre}</h3>
                  {!horario.activo && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>
                    {horario.hora_entrada} - {horario.hora_salida}
                  </span>
                  <span>|</span>
                  <span>Tolerancia: {horario.tolerancia_minutos} min</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {diasSemana.map((dia, idx) => (
                    <span
                      key={idx}
                      className={`w-8 h-6 flex items-center justify-center text-xs rounded ${
                        horario.dias_laborales?.includes(idx)
                          ? 'bg-asist-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {dia}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingHorario(horario); setShowModal(true); }}
                  className="p-2 text-gray-600 hover:text-asist-primary hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este horario?')) deleteMutation.mutate(horario.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <HorarioModal horario={editingHorario} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function HorarioModal({ horario, onClose }: { horario: Horario | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nombre: horario?.nombre || '',
    hora_entrada: horario?.hora_entrada || '08:00',
    hora_salida: horario?.hora_salida || '17:00',
    tolerancia_minutos: horario?.tolerancia_minutos || 15,
    dias_laborales: horario?.dias_laborales || [1, 2, 3, 4, 5],
    activo: horario?.activo ?? true,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (horario) {
        const { error } = await supabase.from('horarios').update(data).eq('id', horario.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('horarios').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      onClose();
    },
  });

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const toggleDia = (idx: number) => {
    const dias = formData.dias_laborales.includes(idx)
      ? formData.dias_laborales.filter(d => d !== idx)
      : [...formData.dias_laborales, idx].sort();
    setFormData({ ...formData, dias_laborales: dias });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {horario ? 'Editar Horario' : 'Nuevo Horario'}
          </h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora Entrada</label>
              <input
                type="time"
                required
                value={formData.hora_entrada}
                onChange={(e) => setFormData({ ...formData, hora_entrada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora Salida</label>
              <input
                type="time"
                required
                value={formData.hora_salida}
                onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tolerancia (minutos)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={formData.tolerancia_minutos}
              onChange={(e) => setFormData({ ...formData, tolerancia_minutos: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Días Laborales</label>
            <div className="flex gap-2">
              {diasSemana.map((dia, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDia(idx)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    formData.dias_laborales.includes(idx)
                      ? 'bg-asist-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dia}
                </button>
              ))}
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
              className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DispositivosSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingDispositivo, setEditingDispositivo] = useState<Dispositivo | null>(null);

  const { data: dispositivos, isLoading } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('dispositivos').select('*').order('nombre');
      if (error) throw error;
      return data as Dispositivo[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dispositivos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dispositivos'] }),
  });

  const tipoLabels: Record<string, string> = {
    zkteco: 'ZKTeco Biométrico',
    camara: 'Cámara IP',
    tablet: 'Tablet/Kiosko',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Dispositivos de Registro</h2>
        <button
          onClick={() => { setEditingDispositivo(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Dispositivo
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="px-6 py-8 text-center text-gray-500">Cargando...</div>
        ) : dispositivos?.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Wifi className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay dispositivos configurados</p>
          </div>
        ) : (
          dispositivos?.map((disp) => (
            <div key={disp.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  disp.activo ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Wifi className={`w-6 h-6 ${disp.activo ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{disp.nombre}</h3>
                  <p className="text-sm text-gray-600">{tipoLabels[disp.tipo]}</p>
                  {disp.ip_address && (
                    <p className="text-xs text-gray-500">{disp.ip_address}:{disp.puerto}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  disp.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {disp.activo ? 'Activo' : 'Inactivo'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingDispositivo(disp); setShowModal(true); }}
                    className="p-2 text-gray-600 hover:text-asist-primary hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar este dispositivo?')) deleteMutation.mutate(disp.id);
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <DispositivoModal dispositivo={editingDispositivo} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function DispositivoModal({ dispositivo, onClose }: { dispositivo: Dispositivo | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nombre: dispositivo?.nombre || '',
    tipo: dispositivo?.tipo || 'zkteco',
    ip_address: dispositivo?.ip_address || '',
    puerto: dispositivo?.puerto || 4370,
    ubicacion: dispositivo?.ubicacion || '',
    activo: dispositivo?.activo ?? true,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (dispositivo) {
        const { error } = await supabase.from('dispositivos').update(data).eq('id', dispositivo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('dispositivos').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {dispositivo ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
          </h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              placeholder="Ej: Checador Entrada Principal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
            >
              <option value="zkteco">ZKTeco Biométrico</option>
              <option value="camara">Cámara IP</option>
              <option value="tablet">Tablet/Kiosko</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección IP</label>
              <input
                type="text"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puerto</label>
              <input
                type="number"
                value={formData.puerto}
                onChange={(e) => setFormData({ ...formData, puerto: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asist-primary focus:border-transparent"
              placeholder="Ej: Entrada Principal"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-asist-primary rounded border-gray-300 focus:ring-asist-primary"
            />
            <label htmlFor="activo" className="text-sm text-gray-700">Dispositivo activo</label>
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
              className="flex items-center gap-2 px-4 py-2 bg-asist-primary text-white rounded-lg hover:bg-asist-secondary transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
