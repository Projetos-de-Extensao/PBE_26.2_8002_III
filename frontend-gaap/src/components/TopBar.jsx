// src/components/TopBar.jsx
import React from 'react';
import { RefreshCw, KeyRound, Plus } from 'lucide-react';

export default function TopBar({ title, onRefresh, onOpenAuth, onNovoAgendamento, loading }) {
  return (
    <header className="top-bar">
      <h2 className="page-title">{title}</h2>

      <div className="top-actions">
        {onNovoAgendamento && (
          <button className="btn btn-primary" onClick={onNovoAgendamento}>
            <Plus size={16} />
            <span>Novo Agendamento</span>
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          title="Recarregar dados da API"
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Atualizar</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenAuth}
          title="Credenciais de Acesso (Basic Auth)"
        >
          <KeyRound size={15} />
          <span>Credenciais</span>
        </button>
      </div>
    </header>
  );
}
