import type { Associate, BenefitCategory, PartnerBenefit } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
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
};
