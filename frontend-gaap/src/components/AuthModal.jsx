// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getAuthCredentials, saveAuthCredentials, clearAuthCredentials } from '../api';

export default function AuthModal({ isOpen, onClose, onSaved }) {
  const current = getAuthCredentials();
  const [username, setUsername] = useState(current.user);
  const [password, setPassword] = useState(current.pass);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAuthCredentials(username, password);
    setStatusMsg({ type: 'success', text: 'Credenciais salvas com sucesso!' });
    setTimeout(() => {
      onSaved();
      onClose();
    }, 600);
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
            <h3 className="modal-title">Autenticação com a API GAAP</h3>
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
                <strong>Acesso Protegido:</strong> O backend GAAP exige autenticação (Basic Auth) para consultar e registrar dados. Use as credenciais de um superusuário ou usuário do Django.
              </div>
            </div>

            {statusMsg && (
              <div className={`alert-banner ${statusMsg.type}`}>
                <CheckCircle2 size={18} />
                <div>{statusMsg.text}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Usuário (Django)</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: admin"
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
                placeholder="ex: admin123"
                required
              />
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Dica:</strong> Para criar um superusuário no backend, abra o terminal no diretório <code>backend-gaap</code> e execute:
              <pre style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', marginTop: '6px' }}>
python manage.py createsuperuser
              </pre>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Limpar
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar e Conectar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
