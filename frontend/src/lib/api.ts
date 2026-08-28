import type { Associate, BenefitCategory, PartnerBenefit, LdapUserSearchResult, LdapUser, RegisterLdapUserPayload, HomeContent } from '../types';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== 'http://localhost:3000') {
    return envUrl;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return '/central-associacao-api';
  }
  return envUrl || 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('hrsj_token');
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message || 'Erro inesperado no servidor';
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) => {
    return fetchJson<{ access_token: string; user: { id: string; name: string; email: string; role: string; hospital: string } }>(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
    );
  },

  // Associates
  getAssociates: (params?: { search?: string; active?: boolean; cardRetrieved?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.active !== undefined) query.append('active', String(params.active));
    if (params?.cardRetrieved !== undefined) query.append('cardRetrieved', String(params.cardRetrieved));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<Associate[]>(`${API_BASE_URL}/associates${queryString}`);
  },

  createAssociate: (data: Partial<Associate>) => {
    return fetchJson<Associate>(`${API_BASE_URL}/associates`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAssociate: (id: string, data: Partial<Associate>) => {
    return fetchJson<Associate>(`${API_BASE_URL}/associates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleCardRetrieved: (id: string, cardRetrieved?: boolean) => {
    return fetchJson<Associate>(`${API_BASE_URL}/associates/${id}/toggle-card`, {
      method: 'PATCH',
      body: JSON.stringify({ cardRetrieved }),
    });
  },

  deleteAssociate: (id: string) => {
    return fetchJson<Associate>(`${API_BASE_URL}/associates/${id}`, {
      method: 'DELETE',
    });
  },

  // Benefits
  getBenefits: (params?: { search?: string; category?: BenefitCategory; active?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.active !== undefined) query.append('active', String(params.active));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<PartnerBenefit[]>(`${API_BASE_URL}/benefits${queryString}`);
  },

  createBenefit: (data: Partial<PartnerBenefit>) => {
    return fetchJson<PartnerBenefit>(`${API_BASE_URL}/benefits`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBenefit: (id: string, data: Partial<PartnerBenefit>) => {
    return fetchJson<PartnerBenefit>(`${API_BASE_URL}/benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteBenefit: (id: string) => {
    return fetchJson<PartnerBenefit>(`${API_BASE_URL}/benefits/${id}`, {
      method: 'DELETE',
    });
  },

  // LDAP Integration
  searchLdap: (query: string) => {
    const searchParams = new URLSearchParams({ query });
    return fetchJson<LdapUserSearchResult[]>(`${API_BASE_URL}/ldap/search?${searchParams.toString()}`);
  },

  registerLdapUser: (data: RegisterLdapUserPayload) => {
    return fetchJson<LdapUser>(`${API_BASE_URL}/ldap/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getLdapUsers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchJson<LdapUser[]>(`${API_BASE_URL}/ldap/users${query}`);
  },

  deleteLdapUser: (id: string) => {
    return fetchJson<LdapUser>(`${API_BASE_URL}/ldap/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Home Content
  getHomeContent: () => {
    return fetchJson<HomeContent>(`${API_BASE_URL}/home-content`);
  },

  updateHomeContent: (data: Partial<HomeContent>) => {
    return fetchJson<HomeContent>(`${API_BASE_URL}/home-content`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};


