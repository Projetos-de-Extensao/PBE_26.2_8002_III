// src/api.js
// Cliente de API para comunicação com o backend Django GAAP

const API_BASE = '/api';

export function getAuthCredentials() {
  const user = localStorage.getItem('gaap_auth_user') || 'admin';
  const pass = localStorage.getItem('gaap_auth_pass') || 'admin123';
  return { user, pass };
}

export function saveAuthCredentials(user, pass) {
  localStorage.setItem('gaap_auth_user', user);
  localStorage.setItem('gaap_auth_pass', pass);
}

export function clearAuthCredentials() {
  localStorage.removeItem('gaap_auth_user');
  localStorage.removeItem('gaap_auth_pass');
}

export function getAuthHeader() {
  const { user, pass } = getAuthCredentials();
  if (!user) return {};
  const encoded = btoa(`${user}:${pass}`);
  return {
    Authorization: `Basic ${encoded}`,
  };
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 204) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      let errorMsg = `Erro ${res.status}: `;
      if (typeof data === 'object') {
        const errors = [];
        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            errors.push(`${key}: ${value.join(' ')}`);
          } else if (typeof value === 'object') {
            errors.push(`${key}: ${JSON.stringify(value)}`);
          } else {
            errors.push(`${key}: ${value}`);
          }
        }
        errorMsg += errors.join(' | ') || res.statusText;
      } else {
        errorMsg += data || res.statusText;
      }
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineErr = new Error(
        'Não foi possível conectar ao backend GAAP. Verifique se o servidor Django está ativo em http://127.0.0.1:8000 (python manage.py runserver).'
      );
      offlineErr.status = 0;
      throw offlineErr;
    }
    throw err;
  }
}

// Métodos auxiliares
export const api = {
  // Verificação de saúde/conexão
  checkConnection: async () => {
    try {
      await apiRequest('/servicos/');
      return { online: true, authenticated: true };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return { online: true, authenticated: false, message: 'Credenciais inválidas' };
      }
      return { online: false, authenticated: false, message: err.message };
    }
  },

  // Agendamentos
  getAgendamentos: () => apiRequest('/agendamentos/'),
  createAgendamento: (dados) => apiRequest('/agendamentos/', { method: 'POST', body: JSON.stringify(dados) }),
  updateAgendamento: (id, dados) => apiRequest(`/agendamentos/${id}/`, { method: 'PATCH', body: JSON.stringify(dados) }),
  deleteAgendamento: (id) => apiRequest(`/agendamentos/${id}/`, { method: 'DELETE' }),

  // Alunos
  getAlunos: () => apiRequest('/alunos/'),
  createAluno: (dados) => apiRequest('/alunos/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteAluno: (id) => apiRequest(`/alunos/${id}/`, { method: 'DELETE' }),

  // Profissionais
  getProfissionais: () => apiRequest('/profissionais/'),
  createProfissional: (dados) => apiRequest('/profissionais/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteProfissional: (id) => apiRequest(`/profissionais/${id}/`, { method: 'DELETE' }),

  // Espaços
  getEspacos: () => apiRequest('/espacos/'),
  createEspaco: (dados) => apiRequest('/espacos/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteEspaco: (id) => apiRequest(`/espacos/${id}/`, { method: 'DELETE' }),

  // Serviços
  getServicos: () => apiRequest('/servicos/'),
  createServico: (dados) => apiRequest('/servicos/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteServico: (id) => apiRequest(`/servicos/${id}/`, { method: 'DELETE' }),

  // Bloqueios de Agenda
  getBloqueios: () => apiRequest('/bloqueios-agenda/'),
  createBloqueio: (dados) => apiRequest('/bloqueios-agenda/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteBloqueio: (id) => apiRequest(`/bloqueios-agenda/${id}/`, { method: 'DELETE' }),

  // Relatórios de Treino
  getRelatorios: () => apiRequest('/relatorios-treino/'),
  createRelatorio: (dados) => apiRequest('/relatorios-treino/', { method: 'POST', body: JSON.stringify(dados) }),
  deleteRelatorio: (id) => apiRequest(`/relatorios-treino/${id}/`, { method: 'DELETE' }),
};
