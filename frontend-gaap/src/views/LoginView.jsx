// src/views/LoginView.jsx
import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Sparkles,
  Info,
  Award,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { api, getAuthCredentials } from '../api';

export default function LoginView({ onLoginSuccess }) {
  const current = getAuthCredentials();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState(current.user || '');
  const [password, setPassword] = useState(current.pass || '');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('responsavel'); // 'responsavel' | 'profissional'
  const [telefone, setTelefone] = useState('');
  const [registro, setRegistro] = useState('');
  const [especialidade, setEspecialidade] = useState('TREINO');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const isProfissional = mode === 'register' && accountType === 'profissional';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isProfissional) {
        // Profissional não entra direto: o administrador precisa aprovar o cadastro.
        await api.cadastrarProfissional({
          nome: name,
          email: username,
          senha: password,
          telefone,
          registro_profissional: registro,
          especialidade,
        });
        setSuccessMsg('Cadastro enviado! Você poderá entrar assim que o administrador aprovar.');
        setMode('login');
        setPassword('');
        return;
      }

      if (mode === 'register') {
        await api.cadastrarResponsavel({
          nome: name,
          email: username,
          senha: password,
        });
      }

      await api.login(username, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Erro de autenticação:', err);
      let msg = err.message || 'Falha ao autenticar no servidor.';
      if (err.data?.codigo === 'aguardando_aprovacao') {
        msg = err.data.non_field_errors[0];
      } else if (err.status === 400 && mode === 'login') {
        msg = 'Credenciais inválidas. Verifique seu usuário/e-mail e senha.';
      } else if (err.status === 0) {
        msg = 'Servidor Django inacessível. Certifique-se de que o backend está rodando na porta 8000.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePreFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="login-page">
      <div className="login-card-wrapper">
        <div className="login-brand">
          <div className="logo-badge large">G</div>
          <h1 className="login-title">GAAP</h1>
          <p className="login-subtitle">Gestão de Atletas de Alta Performance</p>
          <div className="login-features">
            <div className="login-feature-item">
              <ShieldCheck size={18} className="feature-icon" />
              <span>Autenticação Segura via Token DRF</span>
            </div>
            <div className="login-feature-item">
              <KeyRound size={18} className="feature-icon" />
              <span>Acesso a Treinos, Modalidades e Agendas</span>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`login-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errorMsg && (
              <div className="alert-banner danger">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="alert-banner success">
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Tipo de conta</label>
                <div className="account-type-toggle">
                  <button
                    type="button"
                    className={accountType === 'responsavel' ? 'active' : ''}
                    onClick={() => setAccountType('responsavel')}
                  >
                    Responsável
                    <small>Pai, mãe ou responsável legal do atleta</small>
                  </button>
                  <button
                    type="button"
                    className={accountType === 'profissional' ? 'active' : ''}
                    onClick={() => setAccountType('profissional')}
                  >
                    Profissional
                    <small>Treinador, fisio, nutri ou psicólogo</small>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <div className="input-icon-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-control with-icon"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {mode === 'register' ? 'E-mail' : 'Usuário ou E-mail'}
              </label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type={mode === 'register' ? 'email' : 'text'}
                  className="form-control with-icon"
                  placeholder={mode === 'register' ? 'seuemail@exemplo.com' : 'admin ou seu e-mail'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  className="form-control with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  minLength={mode === 'register' ? 8 : undefined}
                  required
                />
              </div>
            </div>

            {isProfissional && (
              <>
                <div className="form-group">
                  <label className="form-label">Especialidade</label>
                  <select
                    className="form-control"
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                  >
                    <option value="TREINO">Treinador</option>
                    <option value="FISIOTERAPIA">Fisioterapeuta</option>
                    <option value="NUTRICAO">Nutricionista</option>
                    <option value="PSICOLOGIA">Psicólogo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Registro profissional (CREF, CREFITO, CRN, CRP)</label>
                  <div className="input-icon-wrapper">
                    <Award size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-control with-icon"
                      placeholder="ex: CREF 012345-G/RJ"
                      value={registro}
                      onChange={(e) => setRegistro(e.target.value)}
                      maxLength={30}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp</label>
                  <div className="input-icon-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-control with-icon"
                      placeholder="(21) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit-btn"
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Enviando...'
                  : isProfissional
                    ? 'Enviar cadastro para aprovação'
                    : mode === 'register'
                      ? 'Criar Conta e Entrar'
                      : 'Acessar Sistema'}
              </span>
              {!loading && <ArrowRight size={18} />}
            </button>

            {mode === 'login' && (
              <div className="quick-access-box">
                <div className="quick-access-header">
                  <Sparkles size={14} />
                  <span>Acesso Rápido de Teste:</span>
                </div>
                <div className="quick-access-buttons">
                  <button
                    type="button"
                    className="quick-btn"
                    onClick={() => handlePreFill('admin', 'admin123')}
                  >
                    admin (Gestor)
                  </button>
                  <button
                    type="button"
                    className="quick-btn"
                    onClick={() => handlePreFill('PBGRUPO3', 'admin123')}
                  >
                    PBGRUPO3
                  </button>
                </div>
              </div>
            )}

            <div className="login-footer-hint">
              <Info size={14} />
              <span>
                Geração de Token REST em <code>/api/token/</code> com autenticação persistente.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
