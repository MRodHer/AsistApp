export interface Database {
  public: {
    Tables: {
      empleados: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          numero_empleado: string;
          nombre: string;
          apellido_paterno: string;
          apellido_materno: string | null;
          departamento: string | null;
          puesto: string | null;
          fecha_ingreso: string;
          activo: boolean;
          foto_url: string | null;
          huella_id: string | null;
          rostro_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['empleados']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['empleados']['Insert']>;
      };
      asistencias: {
        Row: {
          id: string;
          created_at: string;
          empleado_id: string;
          fecha: string;
          hora_entrada: string | null;
          hora_salida: string | null;
          tipo_registro: 'entrada' | 'salida';
          metodo_registro: 'huella' | 'rostro' | 'manual';
          dispositivo_id: string | null;
          notas: string | null;
        };
        Insert: Omit<Database['public']['Tables']['asistencias']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['asistencias']['Insert']>;
      };
      horarios: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          hora_entrada: string;
          hora_salida: string;
          tolerancia_minutos: number;
          dias_laborales: number[];
          activo: boolean;
        };
        Insert: Omit<Database['public']['Tables']['horarios']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['horarios']['Insert']>;
      };
      empleado_horarios: {
        Row: {
          id: string;
          empleado_id: string;
          horario_id: string;
          fecha_inicio: string;
          fecha_fin: string | null;
        };
        Insert: Omit<Database['public']['Tables']['empleado_horarios']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['empleado_horarios']['Insert']>;
      };
      dispositivos: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          tipo: 'zkteco' | 'camara' | 'tablet';
          ip_address: string | null;
          puerto: number | null;
          ubicacion: string | null;
          activo: boolean;
          ultimo_sync: string | null;
        };
        Insert: Omit<Database['public']['Tables']['dispositivos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['dispositivos']['Insert']>;
      };
    };
  };
}

export type Empleado = Database['public']['Tables']['empleados']['Row'];
export type Asistencia = Database['public']['Tables']['asistencias']['Row'];
export type Horario = Database['public']['Tables']['horarios']['Row'];
export type EmpleadoHorario = Database['public']['Tables']['empleado_horarios']['Row'];
export type Dispositivo = Database['public']['Tables']['dispositivos']['Row'];
