// src/views/BloqueiosView.jsx
import React, { useState } from 'react';
import { Ban, Plus, Trash2, Clock, MapPin, User, X } from 'lucide-react';
import { api } from '../api';

export default function BloqueiosView({ bloqueios, profissionais, espacos, onReload }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form
  const [motivo, setMotivo] = useState('');
  const [inicioStr, setInicioStr] = useState('');
  const [fimStr, setFimStr] = useState('');
  const [tipoBloqueio, setTipoBloqueio] = useState('espaco'); // 'espaco' ou 'profissional'
  const [profissionalId, setProfissionalId] = useState('');
  const [espacoId, setEspacoId] = useState('');

  const formatDataHora = (isoStr) => {
    if (!isoStr) return '-';
    try {
      return new Date(isoStr).toLocaleString('pt-BR');
    } catch {
      return isoStr;
    }
  };

  const getProfissionalNome = (id) => {
    if (!id) return null;
    const p = profissionais.find((item) => item.id === id);
    return p ? p.nome : `#${id}`;
  };

  const getEspacoNome = (id) => {
    if (!id) return null;
    const e = espacos.find((item) => item.id === id);
    return e ? e.nome : `#${id}`;
  };

  const handleExcluir = async (id) => {
    if (!confirm('Deseja remover este bloqueio de agenda?')) return;
    try {
      await api.deleteBloqueio(id);
      setFeedback({ type: 'success', message: 'Bloqueio removido com sucesso.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo || !inicioStr || !fimStr) {
      setFeedback({ type: 'danger', message: 'Preencha o motivo e o período de início e fim.' });
      return;
    }

    const payload = {
      motivo,
      data_hora_inicio: new Date(inicioStr).toISOString(),
      data_hora_fim: new Date(fimStr).toISOString(),
      profissional: tipoBloqueio === 'profissional' && profissionalId ? Number(profissionalId) : null,
      espaco: tipoBloqueio === 'espaco' && espacoId ? Number(espacoId) : null,
    };

    if (!payload.profissional && !payload.espaco) {
      setFeedback({ type: 'danger', message: 'Informe pelo menos um espaço ou profissional para o bloqueio.' });
      return;
    }

    try {
      setSubmitting(true);
      await api.createBloqueio(payload);
      setFeedback({ type: 'success', message: 'Bloqueio de agenda registrado!' });
      setModalAberto(false);
      setMotivo('');
      setInicioStr('');
      setFimStr('');
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setSubmitting(false);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ban size={20} color="var(--primary)" />
            <h3 className="card-title">Bloqueios de Agenda e Indisponibilidade ({bloqueios.length})</h3>
          </div>
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            <Plus size={16} />
            Novo Bloqueio
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {bloqueios.length === 0 ? (
            <div className="empty-state">
              <Ban size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum bloqueio registrado</h4>
              <p className="empty-state-desc">
                Bloqueie períodos em que salas estiverem em manutenção ou profissionais ausentes.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Motivo</th>
                    <th>Alvo do Bloqueio</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bloqueios.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.motivo}</strong>
                      </td>
                      <td>
                        {b.espaco ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="var(--text-muted)" />
                            <span>Espaço: <strong>{getEspacoNome(b.espaco)}</strong></span>
                          </div>
                        ) : b.profissional ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={13} color="var(--text-muted)" />
                            <span>Profissional: <strong>{getProfissionalNome(b.profissional)}</strong></span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Geral</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <Clock size={12} color="var(--text-muted)" />
                          <span>{formatDataHora(b.data_hora_inicio)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <Clock size={12} color="var(--text-muted)" />
                          <span>{formatDataHora(b.data_hora_fim)}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluir(b.id)}
                          title="Remover bloqueio"
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

      {/* Modal Criar Bloqueio */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Registrar Bloqueio de Horário</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setModalAberto(false)}
                style={{ padding: '4px 8px', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Motivo do Bloqueio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="ex: Manutenção preventiva de aparelhos, Congresso esportivo..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">O que será bloqueado?</label>
                  <div style={{ display: 'flex', gap: '18px', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="tipoBloqueio"
                        value="espaco"
                        checked={tipoBloqueio === 'espaco'}
                        onChange={() => setTipoBloqueio('espaco')}
                      />
                      <span>Espaço / Sala Física</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="tipoBloqueio"
                        value="profissional"
                        checked={tipoBloqueio === 'profissional'}
                        onChange={() => setTipoBloqueio('profissional')}
                      />
                      <span>Profissional da Equipe</span>
                    </label>
                  </div>

                  {tipoBloqueio === 'espaco' ? (
                    <select
                      className="form-control"
                      value={espacoId}
                      onChange={(e) => setEspacoId(e.target.value)}
                      required
                    >
                      <option value="">Selecione o espaço</option>
                      {espacos.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nome} ({esp.localizacao})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="form-control"
                      value={profissionalId}
                      onChange={(e) => setProfissionalId(e.target.value)}
                      required
                    >
                      <option value="">Selecione o profissional</option>
                      {profissionais.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {p.especialidade}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Início da Indisponibilidade</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={inicioStr}
                      onChange={(e) => setInicioStr(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fim da Indisponibilidade</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={fimStr}
                      onChange={(e) => setFimStr(e.target.value)}
                      required
                    />
                  </div>
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
                  {submitting ? 'Registrando...' : 'Confirmar Bloqueio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
