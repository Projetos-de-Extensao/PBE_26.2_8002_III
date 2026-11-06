// src/views/AlunosView.jsx
import React, { useState } from 'react';
import { Users, Plus, Search, Trash2, HeartPulse, Phone, Mail, Calendar, X } from 'lucide-react';
import { api } from '../api';

export default function AlunosView({ alunos, onReload }) {
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Formulário de novo aluno
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('123456');
  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');
  const [dataNascimento, setDataNascimento] = useState('2000-01-01');
  const [observacoesMedicas, setObservacoesMedicas] = useState('');

  const alunosFiltrados = alunos.filter((al) => {
    const termo = busca.toLowerCase();
    return (
      al.nome?.toLowerCase().includes(termo) ||
      al.matricula?.toLowerCase().includes(termo) ||
      al.email?.toLowerCase().includes(termo)
    );
  });

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza de que deseja excluir este aluno?')) return;
    try {
      await api.deleteAluno(id);
      setFeedback({ type: 'success', message: 'Aluno removido com sucesso.' });
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
      perfil: 'ALUNO',
      ativo: true,
      matricula,
      data_nascimento: dataNascimento,
      observacoes_medicas: observacoesMedicas,
    };

    try {
      setSubmitting(true);
      await api.createAluno(payload);
      setFeedback({ type: 'success', message: 'Aluno/Atleta cadastrado com sucesso!' });
      setModalAberto(false);
      setNome('');
      setEmail('');
      setTelefone('');
      setMatricula('');
      setObservacoesMedicas('');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <h3 className="card-title">Atletas e Alunos ({alunos.length})</h3>
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nome ou matrícula..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', top: '10px' }}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            <Plus size={16} />
            Cadastrar Atleta
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {alunosFiltrados.length === 0 ? (
            <div className="empty-state">
              <Users size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum atleta encontrado</h4>
              <p className="empty-state-desc">Cadastre atletas para vincular aos agendamentos e treinos.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Nome do Atleta</th>
                    <th>Contatos</th>
                    <th>Nascimento</th>
                    <th>Observações Médicas</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.map((al) => (
                    <tr key={al.id}>
                      <td>
                        <strong>{al.matricula}</strong>
                      </td>
                      <td>
                        <strong>{al.nome}</strong>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} color="var(--text-muted)" />
                            <span>{al.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                            <Phone size={12} />
                            <span>{al.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <Calendar size={13} color="var(--text-muted)" />
                          <span>{al.data_nascimento}</span>
                        </div>
                      </td>
                      <td>
                        {al.observacoes_medicas ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#b45309',
                              fontSize: '0.82rem',
                              background: '#fef3c7',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            <HeartPulse size={12} />
                            <span>{al.observacoes_medicas}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Nenhuma restrição</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${al.ativo ? 'badge-realizado' : 'badge-cancelado'}`}>
                          {al.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluir(al.id)}
                          title="Excluir aluno"
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

      {/* Modal de Cadastro de Atleta */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Novo Atleta</h3>
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
                      placeholder="ex: Gabriel Medina"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Matrícula</label>
                    <input
                      type="text"
                      className="form-control"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      placeholder="ex: ATL-2026-001"
                      required
                    />
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
                      placeholder="atleta@gaap.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(21) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      required
                    />
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

                <div className="form-group">
                  <label className="form-label">Observações Médicas / Restrições Físicas</label>
                  <textarea
                    className="form-control"
                    value={observacoesMedicas}
                    onChange={(e) => setObservacoesMedicas(e.target.value)}
                    placeholder="Histórico de lesões (ex: LCA joelho esquerdo, tendinite patelar), alergias, restrições nutricionais..."
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
                  {submitting ? 'Cadastrando...' : 'Salvar Atleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
