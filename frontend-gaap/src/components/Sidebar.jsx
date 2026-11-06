// src/components/Sidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  FileText,
  Users,
  UserCheck,
  Building2,
  Ban,
  Settings,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, backendStatus, onOpenAuth }) {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
    { id: 'novo-agendamento', label: 'Novo Agendamento', icon: CalendarPlus },
    { id: 'relatorios', label: 'Relatórios de Treino', icon: FileText },
    { id: 'alunos', label: 'Alunos / Atletas', icon: Users },
    { id: 'profissionais', label: 'Profissionais', icon: UserCheck },
    { id: 'espacos-servicos', label: 'Espaços & Serviços', icon: Building2 },
    { id: 'bloqueios', label: 'Bloqueios de Agenda', icon: Ban },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-badge">G</div>
          <div>
            <h1 className="logo-title">GAAP</h1>
            <span className="logo-sub">Alta Performance</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item"
          style={{ marginBottom: '8px' }}
          onClick={onOpenAuth}
        >
          <Settings size={18} />
          <span>Configurar API</span>
        </button>

        <div className="status-badge">
          <span
            className={`status-dot ${backendStatus.online ? 'online' : 'offline'}`}
          />
          <span>
            {backendStatus.online
              ? backendStatus.authenticated
                ? 'API Conectada'
                : 'Não Autenticado'
              : 'API Desconectada'}
          </span>
        </div>
      </div>
    </aside>
  );
}
