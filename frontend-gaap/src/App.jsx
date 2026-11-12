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
  // Perfis de acesso devolvidos por /api/me/
  const isStaff = userProfile.is_staff;
  const isResponsavel = userProfile.perfil === 'RESPONSAVEL';
  const isProfissional = ['TREINADOR', 'PROFISSIONAL_SAUDE'].includes(userProfile.perfil);
  const isAluno = userProfile.perfil === 'ALUNO';
  const canSchedule = isStaff || isResponsavel;

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const status = await api.checkConnection();
      setBackendStatus(status);

      if (status.online && status.authenticated) {
        // Primeiro descobre quem está logado; o perfil decide o que buscar.
        let perfil = { is_staff: false, perfil: null };
        try {
          perfil = await api.getCurrentUser();
        } catch (err) {
          console.error('Erro ao carregar o perfil:', err);
        }
        setUserProfile(perfil);
        const isEquipe = Boolean(perfil.is_staff);
        const isProfissionalLogado = ['TREINADOR', 'PROFISSIONAL_SAUDE'].includes(perfil.perfil);
        const vazio = Promise.resolve([]);

        const [
          agendamentosData,
          alunosData,
          profissionaisData,
          espacosData,
          servicosData,
          relatoriosData,
          bloqueiosData,
          responsaveisData,
        ] = await Promise.allSettled([
          api.getAgendamentos(),
          api.getAlunos(),
          api.getProfissionais(),
          api.getEspacos(),
          api.getServicos(),
          perfil.perfil || isEquipe ? api.getRelatorios() : vazio,
          isEquipe || isProfissionalLogado ? api.getBloqueios() : vazio,
          isEquipe ? api.getResponsaveis() : vazio,
        ]);

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
        if (isProfissional) return 'Minha Agenda';
        if (isAluno) return 'Meus Treinos';
        return 'Grade de Agendamentos';
      case 'novo-agendamento':
        return 'Novo Agendamento';
      case 'relatorios':
        return isAluno ? 'Meus Relatórios de Treino' : 'Relatórios de Treino Pós-Sessão';
      case 'alunos':
        if (isResponsavel) return 'Meus Dependentes';
        if (isProfissional) return 'Meus Atletas';
        if (isAluno) return 'Meus Dados';
        return 'Gestão de Alunos e Atletas';
      case 'profissionais':
        return 'Equipe Multidisciplinar';
      case 'espacos-servicos':
        return 'Espaços Físicos e Modalidades';
      case 'bloqueios':
        return isProfissional ? 'Bloqueios da Minha Agenda' : 'Bloqueios de Agenda';
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
              onAbrirRelatorio={isProfissional || isStaff ? () => setActiveTab('relatorios') : undefined}
              onReload={carregarDados}
              isStaff={isStaff}
              canConcluir={isStaff || isProfissional}
            />
          )}

          {(isStaff || isProfissional || isAluno) && activeTab === 'relatorios' && (
            <RelatoriosView
              relatorios={relatorios}
              agendamentos={agendamentos}
              onReload={carregarDados}
              canWrite={isStaff || isProfissional}
              canDelete={isStaff}
            />
          )}

          {activeTab === 'alunos' && (
            <AlunosView
              alunos={alunos}
              responsaveis={responsaveis}
              isResponsavel={isResponsavel}
              canCadastrar={isStaff || isResponsavel}
              canExcluir={isStaff}
              titulo={
                isResponsavel ? 'Meus Dependentes'
                  : isProfissional ? 'Atletas que eu atendo'
                    : isAluno ? 'Meus Dados'
                      : 'Atletas e Alunos'
              }
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

          {(isStaff || isProfissional) && activeTab === 'bloqueios' && (
            <BloqueiosView
              bloqueios={bloqueios}
              profissionais={profissionais}
              espacos={espacos}
              onReload={carregarDados}
              proprioProfissional={isProfissional ? { id: userProfile.id, nome: userProfile.nome } : null}
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
