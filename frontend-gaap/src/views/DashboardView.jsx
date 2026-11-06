// src/views/DashboardView.jsx
import React from 'react';
import {
  Calendar,
  Users,
  UserCheck,
  Building2,
  FileText,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

export default function DashboardView({
  agendamentos,
  alunos,
  profissionais,
  espacos,
  servicos,
  relatorios,
  backendStatus,
  onNovoAgendamento,
  onVerAgenda,
  onOpenAuth,
}) {
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

  const proximosAgendamentos = [...agendamentos]
    .sort((a, b) => new Date(a.data_hora_inicio) - new Date(b.data_hora_inicio))
    .slice(0, 5);

  const formatDataHora = (isoStr) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

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
      {!backendStatus.online && (
        <div className="alert-banner danger">
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>Backend Django Desconectado:</strong> Não foi possível acessar a API em <code>http://127.0.0.1:8000</code>.
            <div style={{ marginTop: '4px' }}>
              Para rodar o backend, abra um terminal na pasta <code>backend-gaap</code> e execute:
              <pre style={{ background: '#fef2f2', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>
python manage.py runserver
              </pre>
            </div>
          </div>
        </div>
      )}

      {backendStatus.online && !backendStatus.authenticated && (
        <div className="alert-banner warning">
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>Autenticação Necessária:</strong> A API está online mas recusou as credenciais atuais.
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: '12px' }}
              onClick={onOpenAuth}
            >
              Configurar Credenciais
            </button>
          </div>
        </div>
      )}

      {/* Grid de Métricas Principais */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-label">Agendamentos</div>
            <div className="stat-value">{agendamentos.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-label">Atletas / Alunos</div>
            <div className="stat-value">{alunos.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-label">Profissionais</div>
            <div className="stat-value">{profissionais.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Building2 size={24} />
          </div>
          <div>
            <div className="stat-label">Espaços / Salas</div>
            <div className="stat-value">{espacos.length}</div>
          </div>
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            <h3 className="card-title">Próximas Sessões Agendadas</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onVerAgenda}>
              Ver Toda a Agenda
            </button>
            <button className="btn btn-primary btn-sm" onClick={onNovoAgendamento}>
              <PlusCircle size={14} />
              Novo Agendamento
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: '0' }}>
          {proximosAgendamentos.length === 0 ? (
            <div className="empty-state">
              <Calendar size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">Nenhum agendamento encontrado</h4>
              <p className="empty-state-desc">
                Crie o primeiro agendamento integrando atletas, profissionais e espaços.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Modalidade</th>
                    <th>Profissional</th>
                    <th>Espaço</th>
                    <th>Atletas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {proximosAgendamentos.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="var(--text-muted)" />
                          <span>{formatDataHora(item.data_hora_inicio)}</span>
                        </div>
                      </td>
                      <td>
                        <strong>{getServicoNome(item.servico)}</strong>
                      </td>
                      <td>{getProfissionalNome(item.profissional)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{getEspacoNome(item.espaco)}</span>
                        </div>
                      </td>
                      <td>
                        {item.alunos && item.alunos.length > 0
                          ? `${item.alunos.length} participante(s)`
                          : 'Nenhum'}
                      </td>
                      <td>
                        <span className={`badge ${getBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Resumo de Recursos Integrados */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Modalidades Esportivas</h4>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {servicos.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhum serviço cadastrado na API.</div>
              ) : (
                servicos.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{s.nome}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {s.duracao_minutos} min
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Espaços e Capacidade</h4>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {espacos.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhum espaço cadastrado na API.</div>
              ) : (
                espacos.map((esp) => (
                  <div
                    key={esp.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{esp.nome}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{esp.localizacao}</div>
                    </div>
                    <span className="badge badge-agendado">
                      Capacidade: {esp.capacidade_maxima}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
