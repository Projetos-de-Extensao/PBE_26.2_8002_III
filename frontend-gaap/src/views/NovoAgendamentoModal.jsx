// src/views/NovoAgendamentoModal.jsx
import React, { useState } from 'react';
import { X, CalendarPlus, AlertCircle, Clock, MapPin, Users } from 'lucide-react';
import { api } from '../api';

export default function NovoAgendamentoModal({
  isOpen,
  onClose,
  alunos,
  profissionais,
  espacos,
  servicos,
  onCreated,
}) {
  // Inicializa a data com amanhã às 09:00 no formato local (YYYY-MM-DDTHH:mm)
  const getInitialDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [inicioStr, setInicioStr] = useState(getInitialDateTime());
  const [fimStr, setFimStr] = useState('');
  const [servicoId, setServicoId] = useState(servicos[0]?.id || '');
  const [profissionalId, setProfissionalId] = useState(profissionais[0]?.id || '');
  const [espacoId, setEspacoId] = useState(espacos[0]?.id || '');
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  // Atualiza data fim automaticamente baseado na duração do serviço
  const calcularFim = (dataInicioIso, servId) => {
    if (!dataInicioIso) return;
    const serv = servicos.find((s) => s.id === Number(servId));
    const duracao = serv ? serv.duracao_minutos : 60;
    const d = new Date(dataInicioIso);
    d.setMinutes(d.getMinutes() + duracao);
    const tzOffset = d.getTimezoneOffset() * 60000;
    setFimStr(new Date(d.getTime() - tzOffset).toISOString().slice(0, 16));
  };

  const handleInicioChange = (e) => {
    const val = e.target.value;
    setInicioStr(val);
    calcularFim(val, servicoId);
  };

  const handleServicoChange = (e) => {
    const val = e.target.value;
    setServicoId(val);
    calcularFim(inicioStr, val);
  };

  const handleAlunoToggle = (id) => {
    setAlunosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const espacoSelecionado = espacos.find((e) => e.id === Number(espacoId));
  const capacidadeExcedida =
    espacoSelecionado && alunosSelecionados.length > espacoSelecionado.capacidade_maxima;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (alunosSelecionados.length === 0) {
      setErrorMsg('Selecione pelo menos um aluno/atleta para o agendamento.');
      return;
    }

    if (!servicoId || !profissionalId || !espacoId) {
      setErrorMsg('Selecione o serviço, profissional e espaço.');
      return;
    }

    if (capacidadeExcedida) {
      setErrorMsg(
        `A quantidade de atletas (${alunosSelecionados.length}) excede a capacidade máxima da sala (${espacoSelecionado.capacidade_maxima}).`
      );
      return;
    }

    // Monta formato ISO esperado pelo Django
    const dataInicioIso = new Date(inicioStr).toISOString();
    const dataFimIso = fimStr
      ? new Date(fimStr).toISOString()
      : new Date(new Date(inicioStr).getTime() + 60 * 60000).toISOString();

    const payload = {
      data_hora_inicio: dataInicioIso,
      data_hora_fim: dataFimIso,
      profissional: Number(profissionalId),
      espaco: Number(espacoId),
      servico: Number(servicoId),
      alunos: alunosSelecionados.map(Number),
    };

    try {
      setSubmitting(true);
      await api.createAgendamento(payload);
      onCreated();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarPlus size={20} color="var(--primary)" />
            <h3 className="modal-title">Novo Agendamento</h3>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ padding: '4px 8px', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div className="alert-banner danger">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>{errorMsg}</div>
              </div>
            )}

            <div className="form-grid">
              {/* Modalidade / Serviço */}
              <div className="form-group">
                <label className="form-label">Modalidade / Serviço</label>
                <select
                  className="form-control"
                  value={servicoId}
                  onChange={handleServicoChange}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} ({s.duracao_minutos} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Profissional Responsável */}
              <div className="form-group">
                <label className="form-label">Profissional Conduzindo</label>
                <select
                  className="form-control"
                  value={profissionalId}
                  onChange={(e) => setProfissionalId(e.target.value)}
                  required
                >
                  <option value="">Selecione o profissional</option>
                  {profissionais.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} — {p.especialidade} ({p.registro_profissional})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              {/* Espaço Físico */}
              <div className="form-group">
                <label className="form-label">Espaço / Sala</label>
                <select
                  className="form-control"
                  value={espacoId}
                  onChange={(e) => setEspacoId(e.target.value)}
                  required
                >
                  <option value="">Selecione o espaço</option>
                  {espacos.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nome} (Capacidade máx: {esp.capacidade_maxima})
                    </option>
                  ))}
                </select>
              </div>

              {/* Horário de Início */}
              <div className="form-group">
                <label className="form-label">Data e Horário de Início</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={inicioStr}
                  onChange={handleInicioChange}
                  required
                />
              </div>
            </div>

            {/* Horário de Fim calculado */}
            <div className="form-group">
              <label className="form-label">
                Término Estimado (calculado automaticamente pela duração do serviço)
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={fimStr}
                onChange={(e) => setFimStr(e.target.value)}
                required
              />
            </div>

            {/* Seleção de Alunos / Atletas */}
            <div className="form-group">
              <label className="form-label">
                Atletas Participantes ({alunosSelecionados.length} selecionado
                {alunosSelecionados.length !== 1 ? 's' : ''})
                {espacoSelecionado && (
                  <span
                    style={{
                      marginLeft: '8px',
                      color: capacidadeExcedida ? 'var(--danger)' : 'var(--text-muted)',
                      fontWeight: 'normal',
                    }}
                  >
                    (Lotação da sala: {espacoSelecionado.capacidade_maxima})
                  </span>
                )}
              </label>

              {alunos.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Nenhum aluno cadastrado no sistema.
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {alunos.map((al) => {
                    const isChecked = alunosSelecionados.includes(al.id);
                    return (
                      <label
                        key={al.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 6px',
                          background: isChecked ? '#eff6ff' : 'transparent',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAlunoToggle(al.id)}
                        />
                        <span>
                          <strong>{al.nome}</strong> (Matrícula: {al.matricula})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || capacidadeExcedida}
            >
              {submitting ? 'Salvando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
