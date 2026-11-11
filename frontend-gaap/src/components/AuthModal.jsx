// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  api,
  getAuthCredentials,
  saveAuthCredentials,
  clearAuthCredentials,
} from '../api';

export default function AuthModal({ isOpen, onClose, onSaved }) {
  const current = getAuthCredentials();
  const [username, setUsername] = useState(current.user);
  const [name, setName] = useState('');
  const [password, setPassword] = useState(current.pass);
  const [statusMsg, setStatusMsg] = useState(null);
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await api.cadastrarResponsavel({
          nome: name,
          email: username,
          senha: password,
        });
      }
      saveAuthCredentials(username, password);
      onSaved();
      onClose();
    } catch (err) {
      setStatusMsg({ type: 'danger', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    clearAuthCredentials();
    setUsername('');
    setPassword('');
    setStatusMsg({ type: 'info', text: 'Credenciais removidas.' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} color="var(--primary)" />
            <h3 className="modal-title">
              {mode === 'register' ? 'Criar conta de responsável' : 'Acessar o GAAP'}
            </h3>
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
            <div className="alert-banner warning">
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div>
                {mode === 'register'
                  ? 'Cadastre sua conta para incluir seus alunos e agendar horários para eles.'
                  : 'Entre com seu e-mail e senha para consultar os horários e acessar seus alunos.'}
              </div>
            </div>

            {statusMsg && (
              <div className={`alert-banner ${statusMsg.type}`}>
                <CheckCircle2 size={18} />
                <div>{statusMsg.text}</div>
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setStatusMsg(null);
              }}
            >
              {mode === 'register'
                ? 'Já tenho uma conta'
                : 'Criar conta de responsável'}
            </button>
          </div>

          <div className="modal-footer">
            {mode === 'login' && (
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Limpar
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting
                ? 'Aguarde...'
                : mode === 'register'
                  ? 'Cadastrar e entrar'
                  : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
