// src/views/AgendamentosView.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  FileCheck,
} from 'lucide-react';
import { api } from '../api';

export default function AgendamentosView({
  agendamentos,
  alunos,
  profissionais,
  espacos,
  servicos,
  onNovoAgendamento,
  onAbrirRelatorio,
  onReload,
}) {
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const getProfissionalNome = (id) => {
    const prof = profissionais.find((p) => p.id === id);
    return prof ? prof.nome : `Profissional #${id}`;
  };

  const getEspacoNome = (id) => {
    const esp = espacos.find((e) => e.id === id);
    return esp ? esp.nome : `Espaço #${id}`;
  };

  const getServicoNome = (id) => {
    const s = servicos.find((item) => item.id === id);
    return s ? s.nome : `Serviço #${id}`;
  };

  const getAlunosNomes = (alunosIds) => {
    if (!alunosIds || alunosIds.length === 0) return 'Nenhum atleta vinculado';
    return alunosIds
      .map((id) => {
        const al = alunos.find((a) => a.id === id);
        return al ? al.nome : `#${id}`;
      })
      .join(', ');
  };

  const formatDataHora = (isoStr) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm('Deseja realmente marcar este agendamento como CANCELADO?')) return;
    try {
      setLoadingAction(id);
      await api.updateAgendamento(id, { status: 'CANCELADO' });
      setFeedback({ type: 'success', message: 'Agendamento cancelado com sucesso!' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRealizar = async (agendamento) => {
    try {
      setLoadingAction(agendamento.id);
      await api.updateAgendamento(agendamento.id, { status: 'REALIZADO' });
      setFeedback({ type: 'success', message: 'Agendamento marcado como realizado!' });
      onReload();
      // Opcionalmente abre o modal de relatório de treino
      if (onAbrirRelatorio) {
        onAbrirRelatorio(agendamento);
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza de que deseja excluir este agendamento permanentemente?')) return;
    try {
      setLoadingAction(id);
      await api.deleteAgendamento(id);
      setFeedback({ type: 'success', message: 'Agendamento excluído do sistema.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const listaFiltrada = agendamentos.filter((item) => {
    if (filtroStatus === 'TODOS') return true;
    return item.status === filtroStatus;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case 'AGENDADO':
        return 'badge-agendado';
      case 'REALIZADO':
        return 'badge-realizado';
      case 'CANCELADO':
        return 'badge-cancelado';
      case 'BLOQUEADO':
        return 'badge-bloqueado';
      default:
        return 'badge-agendado';
    }
  };

  return (
    <div>
      {feedback && (
        <div className={`alert-banner ${feedback.type}`}>
          <div>{feedback.message}</div>
          <button
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setFeedback(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 className="card-title">Grade de Agendamentos ({listaFiltrada.length})</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['TODOS', 'AGENDADO', 'REALIZADO', 'CANCELADO'].map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm ${
                    filtroStatus === status ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => setFiltroStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={onNovoAgendamento}>
            <Plus size={16} />
            Novo Agendamento
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {listaFiltrada.length === 0 ? (
            <div className="empty-state">
              <Calendar size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum agendamento para o filtro selecionado</h4>
              <p className="empty-state-desc">
                Altere o filtro ou crie um novo agendamento de treino ou consulta.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Início & Fim</th>
                    <th>Modalidade</th>
                    <th>Profissional</th>
                    <th>Espaço Físico</th>
                    <th>Atletas</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>#{item.id}</strong>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} color="var(--primary)" />
                            <strong>{formatDataHora(item.data_hora_inicio)}</strong>
                          </div>
                          <div style={{ color: 'var(--text-muted)', marginLeft: '17px' }}>
                            até {formatDataHora(item.data_hora_fim)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{getServicoNome(item.servico)}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={14} color="var(--text-muted)" />
                          <span>{getProfissionalNome(item.profissional)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--text-muted)" />
                          <span>{getEspacoNome(item.espaco)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} color="var(--text-muted)" />
                          <span title={getAlunosNomes(item.alunos)}>
                            {getAlunosNomes(item.alunos)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {item.status === 'AGENDADO' && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleRealizar(item)}
                                title="Marcar como realizado e abrir relatório pós-sessão"
                                disabled={loadingAction === item.id}
                              >
                                <FileCheck size={14} />
                                Concluir
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleCancelar(item.id)}
                                title="Cancelar agendamento"
                                disabled={loadingAction === item.id}
                              >
                                <XCircle size={14} color="var(--danger)" />
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleExcluir(item.id)}
                            title="Excluir do banco"
                            disabled={loadingAction === item.id}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
