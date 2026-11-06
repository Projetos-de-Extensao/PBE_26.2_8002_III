// src/views/ProfissionaisView.jsx
import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Mail, Phone, Award, X } from 'lucide-react';
import { api } from '../api';

export default function ProfissionaisView({ profissionais, onReload }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('123456');
  const [telefone, setTelefone] = useState('');
  const [perfil, setPerfil] = useState('TREINADOR');
  const [especialidade, setEspecialidade] = useState('TREINO');
  const [registro, setRegistro] = useState('');

  const handleExcluir = async (id) => {
    if (!confirm('Deseja realmente remover este profissional?')) return;
    try {
      await api.deleteProfissional(id);
      setFeedback({ type: 'success', message: 'Profissional excluído com sucesso.' });
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nome,
      email,
      senha,
      telefone,
      perfil,
      ativo: true,
      registro_profissional: registro,
      especialidade,
    };

    try {
      setSubmitting(true);
      await api.createProfissional(payload);
      setFeedback({ type: 'success', message: 'Profissional cadastrado com sucesso!' });
      setModalAberto(false);
      setNome('');
      setEmail('');
      setTelefone('');
      setRegistro('');
      onReload();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getEspecialidadeBadge = (esp) => {
    switch (esp) {
      case 'TREINO':
        return 'badge-treino';
      case 'FISIOTERAPIA':
        return 'badge-fisioterapia';
      case 'PSICOLOGIA':
        return 'badge-psicologia';
      case 'NUTRICAO':
        return 'badge-nutricao';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--primary)" />
            <h3 className="card-title">Equipe Multidisciplinar ({profissionais.length})</h3>
          </div>
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            <Plus size={16} />
            Cadastrar Profissional
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {profissionais.length === 0 ? (
            <div className="empty-state">
              <UserCheck size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum profissional cadastrado</h4>
              <p className="empty-state-desc">
                Cadastre os treinadores, fisioterapeutas, nutricionistas e psicólogos esportivos.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Especialidade</th>
                    <th>Registro Profissional</th>
                    <th>Contatos</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {profissionais.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.nome}</strong>
                      </td>
                      <td>
                        <span className={`badge ${getEspecialidadeBadge(p.especialidade)}`}>
                          {p.especialidade}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={14} color="var(--text-muted)" />
                          <span>{p.registro_profissional}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} color="var(--text-muted)" />
                            <span>{p.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                            <Phone size={12} />
                            <span>{p.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.perfil}</span>
                      </td>
                      <td>
                        <span className={`badge ${p.ativo ? 'badge-realizado' : 'badge-cancelado'}`}>
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluir(p.id)}
                          title="Remover profissional"
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

      {/* Modal de Cadastro de Profissional */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Novo Profissional</h3>
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
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="ex: Dr. Rodrigo Lasmar"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Registro Profissional (CREF, CRM, etc.)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={registro}
                      onChange={(e) => setRegistro(e.target.value)}
                      placeholder="ex: CREF-012345-G/RJ"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Especialidade Esportiva</label>
                    <select
                      className="form-control"
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                      required
                    >
                      <option value="TREINO">Treino (Físico/Técnico)</option>
                      <option value="FISIOTERAPIA">Fisioterapia</option>
                      <option value="PSICOLOGIA">Psicologia Esportiva</option>
                      <option value="NUTRICAO">Nutrição</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Perfil</label>
                    <select
                      className="form-control"
                      value={perfil}
                      onChange={(e) => setPerfil(e.target.value)}
                      required
                    >
                      <option value="TREINADOR">Treinador</option>
                      <option value="PROFISSIONAL_SAUDE">Profissional de Saúde</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="profissional@gaap.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(21) 98888-8888"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Senha Inicial de Acesso</label>
                  <input
                    type="password"
                    className="form-control"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
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
                  {submitting ? 'Cadastrando...' : 'Salvar Profissional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
