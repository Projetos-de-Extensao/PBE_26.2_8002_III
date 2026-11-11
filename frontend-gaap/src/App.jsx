// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { api, getAuthToken } from './api';

// Componentes estruturais
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AuthModal from './components/AuthModal';

// Telas
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AgendamentosView from './views/AgendamentosView';
import NovoAgendamentoModal from './views/NovoAgendamentoModal';
import RelatoriosView from './views/RelatoriosView';
import AlunosView from './views/AlunosView';
import ProfissionaisView from './views/ProfissionaisView';
import EspacosServicosView from './views/EspacosServicosView';
import BloqueiosView from './views/BloqueiosView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);
  const [modalNovoAgendamento, setModalNovoAgendamento] = useState(false);
  const [userProfile, setUserProfile] = useState({ is_staff: false, perfil: null });

  // Estados dos recursos da API GAAP
  const [agendamentos, setAgendamentos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);

  // Status de conexão com o backend Django
  const [backendStatus, setBackendStatus] = useState({
    online: true,
    authenticated: !!getAuthToken(),
  });
  const canSchedule = userProfile.is_staff || userProfile.perfil === 'RESPONSAVEL';

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const status = await api.checkConnection();
      setBackendStatus(status);

      if (status.online && status.authenticated) {
        const [
          agendamentosData,
          alunosData,
          profissionaisData,
          espacosData,
          servicosData,
          relatoriosData,
          bloqueiosData,
          userProfileData,
          responsaveisData,
        ] = await Promise.allSettled([
          api.getAgendamentos(),
          api.getAlunos(),
          api.getProfissionais(),
          api.getEspacos(),
          api.getServicos(),
          api.getRelatorios(),
          api.getBloqueios(),
          api.getCurrentUser(),
          api.getResponsaveis(),
        ]);

        if (userProfileData.status === 'fulfilled') {
          setUserProfile(userProfileData.value);
        }
        if (agendamentosData.status === 'fulfilled') setAgendamentos(agendamentosData.value || []);
        if (alunosData.status === 'fulfilled') setAlunos(alunosData.value || []);
        if (profissionaisData.status === 'fulfilled') setProfissionais(profissionaisData.value || []);
        if (espacosData.status === 'fulfilled') setEspacos(espacosData.value || []);
        if (servicosData.status === 'fulfilled') setServicos(servicosData.value || []);
        if (relatoriosData.status === 'fulfilled') setRelatorios(relatoriosData.value || []);
        if (bloqueiosData.status === 'fulfilled') setBloqueios(bloqueiosData.value || []);
        if (responsaveisData.status === 'fulfilled') setResponsaveis(responsaveisData.value || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Visão Geral & Dashboard';
      case 'agendamentos':
        return 'Grade de Agendamentos';
      case 'novo-agendamento':
        return 'Novo Agendamento';
      case 'relatorios':
        return 'Relatórios de Treino Pós-Sessão';
      case 'alunos':
        return 'Gestão de Alunos e Atletas';
      case 'profissionais':
        return 'Equipe Multidisciplinar';
      case 'espacos-servicos':
        return 'Espaços Físicos e Modalidades';
      case 'bloqueios':
        return 'Bloqueios de Agenda';
      default:
        return 'GAAP';
    }
  };

  const handleLogout = () => {
    api.logout();
    setUserProfile({ is_staff: false, perfil: null });
    setBackendStatus((prev) => ({ ...prev, authenticated: false }));
  };

  if (!backendStatus.authenticated) {
    return <LoginView onLoginSuccess={carregarDados} />;
  }

  return (
    <div className="app-container">
      {/* Barra Lateral */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'novo-agendamento') {
            setModalNovoAgendamento(true);
          } else {
            setActiveTab(tab);
          }
        }}
        backendStatus={backendStatus}
        userProfile={userProfile}
        onOpenAuth={() => setModalAuth(true)}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal */}
      <div className="main-wrapper">
        <TopBar
          title={getPageTitle()}
          onRefresh={carregarDados}
          onOpenAuth={() => setModalAuth(true)}
          onNovoAgendamento={canSchedule ? () => setModalNovoAgendamento(true) : undefined}
          onLogout={handleLogout}
          loading={loading}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <DashboardView
              agendamentos={agendamentos}
              alunos={alunos}
              profissionais={profissionais}
              espacos={espacos}
              servicos={servicos}
              relatorios={relatorios}
              backendStatus={backendStatus}
              onNovoAgendamento={canSchedule ? () => setModalNovoAgendamento(true) : undefined}
              onVerAgenda={() => setActiveTab('agendamentos')}
              onOpenAuth={() => setModalAuth(true)}
            />
          )}

          {activeTab === 'agendamentos' && (
            <AgendamentosView
              agendamentos={agendamentos}
              alunos={alunos}
              profissionais={profissionais}
              espacos={espacos}
              servicos={servicos}
              onNovoAgendamento={canSchedule ? () => setModalNovoAgendamento(true) : undefined}
              onAbrirRelatorio={() => setActiveTab('relatorios')}
              onReload={carregarDados}
              isStaff={userProfile.is_staff}
            />
          )}

          {userProfile.is_staff && activeTab === 'relatorios' && (
            <RelatoriosView
              relatorios={relatorios}
              agendamentos={agendamentos}
              onReload={carregarDados}
            />
          )}

          {activeTab === 'alunos' && (
            <AlunosView
              alunos={alunos}
              responsaveis={responsaveis}
              isResponsavel={userProfile.perfil === 'RESPONSAVEL'}
              onReload={carregarDados}
            />
          )}

          {userProfile.is_staff && activeTab === 'profissionais' && (
            <ProfissionaisView
              profissionais={profissionais}
              onReload={carregarDados}
            />
          )}

          {userProfile.is_staff && activeTab === 'espacos-servicos' && (
            <EspacosServicosView
              espacos={espacos}
              servicos={servicos}
              onReload={carregarDados}
            />
          )}

          {userProfile.is_staff && activeTab === 'bloqueios' && (
            <BloqueiosView
              bloqueios={bloqueios}
              profissionais={profissionais}
              espacos={espacos}
              onReload={carregarDados}
            />
          )}
        </main>
      </div>

      {/* Modal de Novo Agendamento */}
      <NovoAgendamentoModal
        isOpen={modalNovoAgendamento}
        onClose={() => setModalNovoAgendamento(false)}
        alunos={alunos}
        profissionais={profissionais}
        espacos={espacos}
        servicos={servicos}
        isStaff={userProfile.is_staff}
        onCreated={() => {
          carregarDados();
          setActiveTab('agendamentos');
        }}
      />

      {/* Modal de Configuração de Credenciais */}
      <AuthModal
        isOpen={modalAuth}
        onClose={() => setModalAuth(false)}
        onSaved={carregarDados}
      />
    </div>
  );
}
