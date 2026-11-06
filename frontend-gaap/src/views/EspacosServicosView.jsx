// src/views/EspacosServicosView.jsx
import React, { useState } from 'react';
import { Building2, Plus, Trash2, Clock, MapPin, Users, Activity, X } from 'lucide-react';
import { api } from '../api';

export default function EspacosServicosView({ espacos, servicos, onReload }) {
  const [modalEspaco, setModalEspaco] = useState(false);
  const [modalServico, setModalServico] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form Espaço
  const [espNome, setEspNome] = useState('');
  const [espCapacidade, setEspCapacidade] = useState(10);
  const [espLocalizacao, setEspLocalizacao] = useState('');

  // Form Serviço
  const [servNome, setServNome] = useState('TREINO');
  const [servDuracao, setServDuracao] = useState(60);

  const handleExcluirEspaco = async (id) => {
    if (!confirm('Deseja excluir este espaço?')) return;
    try {
      await api.deleteEspaco(id);
      setFeedback({ type: 'success', message: 'Espaço removido com sucesso.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleExcluirServico = async (id) => {
    if (!confirm('Deseja excluir este serviço?')) return;
    try {
      await api.deleteServico(id);
      setFeedback({ type: 'success', message: 'Serviço removido com sucesso.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleSalvarEspaco = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createEspaco({
        nome: espNome,
        capacidade_maxima: Number(espCapacidade),
        localizacao: espLocalizacao,
        ativo: true,
      });
      setFeedback({ type: 'success', message: 'Espaço físico cadastrado com sucesso!' });
      setModalEspaco(false);
      setEspNome('');
      setEspLocalizacao('');
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSalvarServico = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createServico({
        nome: servNome,
        duracao_minutos: Number(servDuracao),
        ativo: true,
      });
      setFeedback({ type: 'success', message: 'Serviço configurado com sucesso!' });
      setModalServico(false);
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

      {/* Seção Espaços */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 className="card-title">Espaços e Salas de Atendimento ({espacos.length})</h3>
          </div>
          <button className="btn btn-primary" onClick={() => setModalEspaco(true)}>
            <Plus size={16} />
            Novo Espaço
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {espacos.length === 0 ? (
            <div className="empty-state">
              <Building2 size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum espaço físico cadastrado</h4>
              <p className="empty-state-desc">Cadastre salas, quadras, consultórios ou áreas de musculação.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome do Espaço</th>
                    <th>Localização / Bloco</th>
                    <th>Capacidade Máxima</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {espacos.map((esp) => (
                    <tr key={esp.id}>
                      <td>
                        <strong>#{esp.id}</strong>
                      </td>
                      <td>
                        <strong>{esp.nome}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{esp.localizacao}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={13} color="var(--text-muted)" />
                          <span>Até {esp.capacidade_maxima} atletas</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${esp.ativo ? 'badge-realizado' : 'badge-cancelado'}`}>
                          {esp.ativo ? 'Disponível' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluirEspaco(esp.id)}
                          title="Remover espaço"
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

      {/* Seção Serviços */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--primary)" />
            <h3 className="card-title">Modalidades e Serviços Esportivos ({servicos.length})</h3>
          </div>
          <button className="btn btn-primary" onClick={() => setModalServico(true)}>
            <Plus size={16} />
            Novo Serviço
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {servicos.length === 0 ? (
            <div className="empty-state">
              <Activity size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum serviço configurado</h4>
              <p className="empty-state-desc">Configure modalidades para determinar a duração padrão das sessões.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Modalidade</th>
                    <th>Duração Padrão</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>#{s.id}</strong>
                      </td>
                      <td>
                        <strong>{s.nome}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="var(--primary)" />
                          <span>{s.duracao_minutos} minutos</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${s.ativo ? 'badge-realizado' : 'badge-cancelado'}`}>
                          {s.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluirServico(s.id)}
                          title="Remover serviço"
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

      {/* Modal Criar Espaço */}
      {modalEspaco && (
        <div className="modal-overlay" onClick={() => setModalEspaco(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Novo Espaço Físico</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setModalEspaco(false)}
                style={{ padding: '4px 8px', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarEspaco}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome da Sala / Espaço</label>
                  <input
                    type="text"
                    className="form-control"
                    value={espNome}
                    onChange={(e) => setEspNome(e.target.value)}
                    placeholder="ex: Sala de Fisioterapia 1, Box de Treino Funcional"
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Capacidade Máxima (atletas)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={espCapacidade}
                      onChange={(e) => setEspCapacidade(e.target.value)}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Localização / Bloco</label>
                    <input
                      type="text"
                      className="form-control"
                      value={espLocalizacao}
                      onChange={(e) => setEspLocalizacao(e.target.value)}
                      placeholder="ex: Bloco B - 2º Andar"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalEspaco(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Espaço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar Serviço */}
      {modalServico && (
        <div className="modal-overlay" onClick={() => setModalServico(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Configurar Modalidade / Serviço</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setModalServico(false)}
                style={{ padding: '4px 8px', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarServico}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Modalidade</label>
                  <select
                    className="form-control"
                    value={servNome}
                    onChange={(e) => setServNome(e.target.value)}
                    required
                  >
                    <option value="TREINO">Treino (Físico/Técnico)</option>
                    <option value="FISIOTERAPIA">Fisioterapia</option>
                    <option value="PSICOLOGIA">Psicologia Esportiva</option>
                    <option value="NUTRICAO">Nutrição</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duração Estimada (minutos)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={servDuracao}
                    onChange={(e) => setServDuracao(e.target.value)}
                    min="15"
                    step="5"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalServico(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Configurando...' : 'Salvar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
