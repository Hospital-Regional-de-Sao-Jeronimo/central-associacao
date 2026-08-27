export interface Associate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone?: string | null;
  birthDate: string;
  address: string;
  admissionDate: string;
  associationDate: string;
  cardNumber?: string | null;
  cardRetrieved: boolean;
  cardRetrievedAt?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type BenefitCategory =
  | 'ALIMENTACAO'
  | 'SAUDE'
  | 'LAZER'
  | 'EDUCACAO'
  | 'SERVICOS'
  | 'VAREJO'
  | 'OUTROS';

export interface PartnerBenefit {
  id: string;
  name: string;
  category: BenefitCategory;
  discountPercentage: string;
  description?: string | null;
  location: string;
  phone?: string | null;
  website?: string | null;
  imageUrl?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export const BENEFIT_CATEGORY_LABELS: Record<BenefitCategory, { label: string; color: string }> = {
  ALIMENTACAO: { label: 'Alimentação & Gastronomia', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  SAUDE: { label: 'Saúde & Bem-Estar', color: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300' },
  LAZER: { label: 'Lazer & Entretenimento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
  EDUCACAO: { label: 'Educação & Cursos', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
  SERVICOS: { label: 'Serviços Especializados', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
  VAREJO: { label: 'Varejo & Compras', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
  OUTROS: { label: 'Outros Benefícios', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
};

export interface LdapUserSearchResult {
  username: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  cpf: string;
  ativo: boolean;
  departamento: string | null;
  cargo: string | null;
  userPrincipalName: string | null;
  dn: string | null;
  grupos: string[];
}

export interface LdapUser {
  id: string;
  username: string;
  nomeCompleto: string;
  email: string;
  telefone?: string | null;
  cpf: string;
  departamento?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface RegisterLdapUserPayload {
  username: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  cpf: string;
  departamento?: string;
}

export interface BoardMember {
  role: string;
  associateId?: string | null;
  name?: string;
  subtext?: string;
  fallbackName?: string;
  fallbackSubtext?: string;
  associate?: Partial<Associate> | null;
}

export interface HistoryBlock {
  id: string;
  title: string;
  content1: string;
  content2?: string;
}

export interface HomeContent {
  id: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  foundationYear: string;
  foundationDate: string;
  yearsOfAction?: string;
  totalAssociates?: string;
  totalPartners?: string;
  historyBlocks: HistoryBlock[];
  boardBadge: string;
  boardTitle: string;
  boardSubtitle: string;
  boardMembers: BoardMember[];
  updatedAt: string;
}



