// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { api } from './api';

// Componentes estruturais
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AuthModal from './components/AuthModal';

// Telas
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

  // Estados dos recursos da API GAAP
  const [agendamentos, setAgendamentos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);

  // Status de conexão com o backend Django
  const [backendStatus, setBackendStatus] = useState({
    online: true,
    authenticated: true,
  });

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
        ] = await Promise.allSettled([
          api.getAgendamentos(),
          api.getAlunos(),
          api.getProfissionais(),
          api.getEspacos(),
          api.getServicos(),
          api.getRelatorios(),
          api.getBloqueios(),
        ]);

        if (agendamentosData.status === 'fulfilled') setAgendamentos(agendamentosData.value || []);
        if (alunosData.status === 'fulfilled') setAlunos(alunosData.value || []);
        if (profissionaisData.status === 'fulfilled') setProfissionais(profissionaisData.value || []);
        if (espacosData.status === 'fulfilled') setEspacos(espacosData.value || []);
        if (servicosData.status === 'fulfilled') setServicos(servicosData.value || []);
        if (relatoriosData.status === 'fulfilled') setRelatorios(relatoriosData.value || []);
        if (bloqueiosData.status === 'fulfilled') setBloqueios(bloqueiosData.value || []);
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
        onOpenAuth={() => setModalAuth(true)}
      />

      {/* Conteúdo Principal */}
      <div className="main-wrapper">
        <TopBar
          title={getPageTitle()}
          onRefresh={carregarDados}
          onOpenAuth={() => setModalAuth(true)}
          onNovoAgendamento={() => setModalNovoAgendamento(true)}
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
              onNovoAgendamento={() => setModalNovoAgendamento(true)}
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
              onNovoAgendamento={() => setModalNovoAgendamento(true)}
              onAbrirRelatorio={() => setActiveTab('relatorios')}
              onReload={carregarDados}
            />
          )}

          {activeTab === 'relatorios' && (
            <RelatoriosView
              relatorios={relatorios}
              agendamentos={agendamentos}
              onReload={carregarDados}
            />
          )}

          {activeTab === 'alunos' && (
            <AlunosView alunos={alunos} onReload={carregarDados} />
          )}

          {activeTab === 'profissionais' && (
            <ProfissionaisView
              profissionais={profissionais}
              onReload={carregarDados}
            />
          )}

          {activeTab === 'espacos-servicos' && (
            <EspacosServicosView
              espacos={espacos}
              servicos={servicos}
              onReload={carregarDados}
            />
          )}

          {activeTab === 'bloqueios' && (
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
