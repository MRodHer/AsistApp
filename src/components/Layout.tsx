import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Settings,
  Fingerprint
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Empleados', href: '/empleados', icon: Users },
  { name: 'Asistencias', href: '/asistencias', icon: Clock },
  { name: 'Reportes', href: '/reportes', icon: FileText },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-asist-primary text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/20">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AsistApp</h1>
            <p className="text-xs text-white/70">Control de Asistencia</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Link to Checador */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <a
            href="/checador"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-asist-success text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Fingerprint className="w-5 h-5" />
            <span className="font-medium">Abrir Checador</span>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
