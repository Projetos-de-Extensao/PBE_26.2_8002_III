// src/views/RelatoriosView.jsx
import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Plus, Calendar, Clock, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function RelatoriosView({ relatorios, agendamentos, onReload }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState('');
  const [presenca, setPresenca] = useState(true);
  const [atividades, setAtividades] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const formatData = (isoStr) => {
    if (!isoStr) return '-';
    try {
      return new Date(isoStr).toLocaleString('pt-BR');
    } catch {
      return isoStr;
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Deseja excluir este relatório?')) return;
    try {
      await api.deleteRelatorio(id);
      setFeedback({ type: 'success', message: 'Relatório excluído.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agendamentoId) {
      setFeedback({ type: 'danger', message: 'Selecione o agendamento correspondente.' });
      return;
    }

    const payload = {
      agendamento: Number(agendamentoId),
      presenca: Boolean(presenca),
      atividades_realizadas: atividades,
      observacoes_tecnicas: observacoes,
      data_finalizacao: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      await api.createRelatorio(payload);
      setFeedback({ type: 'success', message: 'Relatório técnico registrado com sucesso!' });
      setModalAberto(false);
      setAtividades('');
      setObservacoes('');
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // IDs de agendamentos que já possuem relatório
  const agendamentosComRelatorio = new Set(relatorios.map((r) => r.agendamento));
  const agendamentosDisponiveis = agendamentos.filter((a) => !agendamentosComRelatorio.has(a.id));

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" />
            <h3 className="card-title">Relatórios Técnicos Pós-Sessão ({relatorios.length})</h3>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setModalAberto(true)}
            disabled={agendamentosDisponiveis.length === 0}
          >
            <Plus size={16} />
            Novo Relatório
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {relatorios.length === 0 ? (
            <div className="empty-state">
              <FileText size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum relatório técnico preenchido</h4>
              <p className="empty-state-desc">
                Após a realização dos treinos ou consultas, registre aqui a presença e o feedback técnico do atleta.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Agendamento</th>
                    <th>Presença</th>
                    <th>Atividades Conduzidas</th>
                    <th>Observações Técnicas</th>
                    <th>Finalizado em</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map((rel) => (
                    <tr key={rel.id}>
                      <td>
                        <strong>#{rel.id}</strong>
                      </td>
                      <td>
                        <span className="badge badge-agendado">
                          Agendamento #{rel.agendamento}
                        </span>
                      </td>
                      <td>
                        {rel.presenca ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: 'var(--success)',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            <CheckCircle2 size={16} /> Presente
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: 'var(--danger)',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            <XCircle size={16} /> Falta
                          </span>
                        )}
                      </td>
                      <td style={{ maxWidth: '280px' }}>{rel.atividades_realizadas}</td>
                      <td style={{ maxWidth: '280px', color: 'var(--text-muted)' }}>
                        {rel.observacoes_tecnicas || 'Sem observações'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                          <Clock size={12} color="var(--text-muted)" />
                          <span>{formatData(rel.data_finalizacao)}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluir(rel.id)}
                          title="Excluir relatório"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Preenchimento de Relatório */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Novo Relatório Técnico de Sessão</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setModalAberto(false)}
                style={{ padding: '4px 8px', border: 'none' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Agendamento Realizado</label>
                  <select
                    className="form-control"
                    value={agendamentoId}
                    onChange={(e) => setAgendamentoId(e.target.value)}
                    required
                  >
                    <option value="">Selecione o agendamento</option>
                    {agendamentosDisponiveis.map((a) => (
                      <option key={a.id} value={a.id}>
                        Agendamento #{a.id} — Início: {new Date(a.data_hora_inicio).toLocaleString('pt-BR')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Presença do Atleta</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="presenca"
                        checked={presenca === true}
                        onChange={() => setPresenca(true)}
                      />
                      <span>Presente</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="presenca"
                        checked={presenca === false}
                        onChange={() => setPresenca(false)}
                      />
                      <span>Ausente / Falta</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Atividades Realizadas</label>
                  <textarea
                    className="form-control"
                    value={atividades}
                    onChange={(e) => setAtividades(e.target.value)}
                    placeholder="Descreva as séries, cargas, exercícios, protocolo fisioterápico ou pauta trabalhada..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Observações Técnicas / Clínicas</label>
                  <textarea
                    className="form-control"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Feedback sobre resposta neuromuscular, dores, evolução ou recomendações para as próximas sessões..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Gravar Relatório'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
