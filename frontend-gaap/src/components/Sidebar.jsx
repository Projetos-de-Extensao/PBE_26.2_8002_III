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
  LogOut,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  backendStatus,
  userProfile,
  onOpenAuth,
  onLogout,
}) {
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

  // Telas liberadas para cada perfil (a equipe vê todas)
  const telasPorPerfil = {
    RESPONSAVEL: ['dashboard', 'agendamentos', 'novo-agendamento', 'alunos'],
    TREINADOR: ['dashboard', 'agendamentos', 'relatorios', 'alunos', 'bloqueios'],
    PROFISSIONAL_SAUDE: ['dashboard', 'agendamentos', 'relatorios', 'alunos', 'bloqueios'],
    ALUNO: ['dashboard', 'agendamentos', 'relatorios', 'alunos'],
  };
  const rotulosPorPerfil = {
    RESPONSAVEL: { alunos: 'Meus Dependentes' },
    TREINADOR: { agendamentos: 'Minha Agenda', alunos: 'Meus Atletas', bloqueios: 'Bloquear Agenda' },
    PROFISSIONAL_SAUDE: { agendamentos: 'Minha Agenda', alunos: 'Meus Atletas', bloqueios: 'Bloquear Agenda' },
    ALUNO: { agendamentos: 'Meus Treinos', relatorios: 'Meus Relatórios', alunos: 'Meus Dados' },
  };
  const nomesDosPerfis = {
    ADMINISTRADOR: 'Administrador',
    RESPONSAVEL: 'Responsável',
    TREINADOR: 'Treinador',
    PROFISSIONAL_SAUDE: 'Profissional de Saúde',
    ALUNO: 'Aluno',
  };

  const visibleItems = menuItems
    .filter((item) => userProfile.is_staff || (telasPorPerfil[userProfile.perfil] || []).includes(item.id))
    .map((item) => ({ ...item, label: rotulosPorPerfil[userProfile.perfil]?.[item.id] || item.label }));

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
        {visibleItems.map((item) => {
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
        {userProfile.perfil && (
          <div className="sidebar-user" title={userProfile.email}>
            <strong>{userProfile.nome || userProfile.email}</strong>
            <span>{nomesDosPerfis[userProfile.perfil] || userProfile.perfil}</span>
          </div>
        )}

        <button
          className="nav-item"
          style={{ marginBottom: '4px' }}
          onClick={onOpenAuth}
        >
          <Settings size={18} />
          <span>Configurar Token</span>
        </button>

        {onLogout && (
          <button
            className="nav-item"
            style={{ marginBottom: '8px', color: '#f87171' }}
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        )}

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
