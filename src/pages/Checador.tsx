import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Fingerprint, Clock, CheckCircle, XCircle, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type RegistroTipo = 'entrada' | 'salida';

export function Checador() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState<RegistroTipo>('entrada');
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string; empleado?: string } | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const registrarMutation = useMutation({
    mutationFn: async ({ numero, tipo }: { numero: string; tipo: RegistroTipo }) => {
      // Find employee by numero_empleado
      const { data: empleado, error: empError } = await supabase
        .from('empleados')
        .select('id, nombre, apellido_paterno')
        .eq('numero_empleado', numero)
        .eq('activo', true)
        .single();

      if (empError || !empleado) {
        throw new Error('Empleado no encontrado');
      }

      const now = new Date();
      const fecha = format(now, 'yyyy-MM-dd');
      const hora = format(now, 'HH:mm:ss');

      // Insert attendance record
      const { error: asistError } = await supabase.from('asistencias').insert({
        empleado_id: empleado.id,
        fecha,
        hora_entrada: tipo === 'entrada' ? hora : null,
        hora_salida: tipo === 'salida' ? hora : null,
        tipo_registro: tipo,
        metodo_registro: 'manual',
      });

      if (asistError) throw asistError;

      return {
        empleado: `${empleado.nombre} ${empleado.apellido_paterno}`,
        tipo,
        hora,
      };
    },
    onSuccess: (data) => {
      setMensaje({
        type: 'success',
        text: `${data.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada a las ${data.hora}`,
        empleado: data.empleado,
      });
      setNumeroEmpleado('');
    },
    onError: (error: Error) => {
      setMensaje({
        type: 'error',
        text: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numeroEmpleado.trim()) {
      registrarMutation.mutate({ numero: numeroEmpleado.trim(), tipo: tipoRegistro });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-asist-primary to-asist-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-asist-primary text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">AsistApp</h1>
          <p className="text-white/80 text-sm">Sistema de Control de Asistencia</p>
        </div>

        {/* Clock */}
        <div className="bg-gray-50 px-8 py-6 text-center border-b">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <p className="text-5xl font-bold text-gray-900 font-mono">
            {format(currentTime, 'HH:mm:ss')}
          </p>
        </div>

        {/* Message */}
        {mensaje && (
          <div className={`px-8 py-4 flex items-center gap-3 ${
            mensaje.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {mensaje.type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div>
              {mensaje.empleado && (
                <p className={`font-semibold ${mensaje.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {mensaje.empleado}
                </p>
              )}
              <p className={`text-sm ${mensaje.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {mensaje.text}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Tipo de registro */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setTipoRegistro('entrada')}
              className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                tipoRegistro === 'entrada'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn className="w-5 h-5" />
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipoRegistro('salida')}
              className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                tipoRegistro === 'salida'
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogOut className="w-5 h-5" />
              Salida
            </button>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Empleado
            </label>
            <input
              type="text"
              value={numeroEmpleado}
              onChange={(e) => setNumeroEmpleado(e.target.value)}
              placeholder="Ingresa tu número de empleado"
              autoFocus
              className="w-full px-4 py-4 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-asist-primary focus:ring-4 focus:ring-asist-primary/20 outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!numeroEmpleado.trim() || registrarMutation.isPending}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              tipoRegistro === 'entrada'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {registrarMutation.isPending ? 'Registrando...' : `Registrar ${tipoRegistro === 'entrada' ? 'Entrada' : 'Salida'}`}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            Para usar biométrico, acerca tu huella o rostro al dispositivo
          </p>
        </div>
      </div>
    </div>
  );
}
