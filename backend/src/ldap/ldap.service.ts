import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterLdapUserDto } from './dto/register-ldap-user.dto';

export function normalizeDepartmentName(raw?: string | null): string {
  if (!raw || !raw.trim()) return 'Hospital Regional São Jerônimo';

  let clean = raw.trim();
  if (clean.startsWith('Departamento: ')) {
    clean = clean.substring('Departamento: '.length).trim();
  }

  const lower = clean.toLowerCase();

  if (
    lower === 'ti' ||
    lower.includes('tecnologia') ||
    lower.includes('informacao') ||
    lower.includes('informática')
  ) {
    return 'TI / Tecnologia da Informação';
  }

  if (lower.includes('medico') || lower.includes('médico')) {
    return 'Médicos / Corpo Clínico';
  }

  if (lower.includes('enfermagem') || lower.includes('unidade.internacao')) {
    return 'Enfermagem';
  }

  if (lower.includes('farmacia') || lower.includes('farmácia')) {
    if (lower.includes('uti')) {
      return 'Farmácia UTI';
    }
    return 'Farmácia';
  }

  if (lower.includes('recepcao') || lower.includes('recepção')) {
    return 'Recepção';
  }

  if (lower.includes('faturamento')) {
    return 'Faturamento';
  }

  if (lower.includes('higienizacao') || lower.includes('higienização')) {
    return 'Higienização';
  }

  if (lower.includes('manutencao') || lower.includes('manutenção')) {
    return 'Manutenção';
  }

  if (lower.includes('nutricao') || lower.includes('nutrição')) {
    return 'Nutrição';
  }

  if (lower.includes('compras')) {
    return 'Compras';
  }

  if (lower.includes('laboratorio') || lower.includes('laboratório')) {
    return 'Laboratório';
  }

  if (lower.includes('bloco') || lower.includes('cirurgico') || lower.includes('cirúrgico')) {
    return 'Bloco Cirúrgico';
  }

  if (lower.includes('centro') && lower.includes('clinico')) {
    return 'Centro Clínico';
  }

  if (lower.includes('fisioterapia')) {
    return 'Fisioterapia';
  }

  if (lower.includes('recursos') || lower.includes('humanos') || lower.includes('setor.pessoal')) {
    return 'Recursos Humanos';
  }

  if (lower.includes('financeiro')) {
    return 'Financeiro';
  }

  if (lower.includes('contabilidade')) {
    return 'Contabilidade';
  }

  if (lower.includes('psicologia')) {
    return 'Psicologia';
  }

  if (lower.includes('social')) {
    return 'Serviço Social';
  }

  if (lower.includes('infeccao') || lower.includes('infecção')) {
    return 'Controle de Infecção';
  }

  if (lower.includes('arquivo')) {
    return 'Arquivo';
  }

  if (lower.includes('agencia') || lower.includes('transfusional')) {
    return 'Agência Transfusional';
  }

  if (lower.includes('sesmet') || lower.includes('seguranca') || lower.includes('segurança')) {
    return 'Segurança do Trabalho / SESMT';
  }

  if (lower.includes('administracao') || lower.includes('administração')) {
    return 'Administração';
  }

  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

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

@Injectable()
export class LdapService {
  constructor(private readonly prisma: PrismaService) {}

  private cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  // Mock de fallback para desenvolvimento offline se a API local não estiver acessível
  private mockLdapUsers: LdapUserSearchResult[] = [
    {
      username: 'mateus.lopes',
      nome_completo: 'Mateus Peres Lopes',
      email: 'mateus.lopes@hsjeronimo.com.br',
      telefone: '51995365718',
      cpf: '05144512038',
      ativo: true,
      departamento: 'TI',
      cargo: 'Desenvolvedor',
      userPrincipalName: 'mateus.lopes@hsjeronimo.com.br',
      dn: 'CN=Mateus Peres Lopes,OU=tecnologia.da.informacao.hrsj,OU=HRSJ,DC=redeafpergs,DC=local',
      grupos: ['g.scanner.hrsj', 'g.acesso.remoto', 'Administrators'],
    },
    {
      username: 'carlos.oliveira',
      nome_completo: 'Carlos Eduardo Oliveira',
      email: 'carlos.oliveira@hsjeronimo.com.br',
      telefone: '51987654321',
      cpf: '98765432100',
      ativo: true,
      departamento: 'Administração',
      cargo: 'Analista de Recursos Humanos',
      userPrincipalName: 'carlos.oliveira@hsjeronimo.com.br',
      dn: 'CN=Carlos Eduardo Oliveira,OU=rh.hrsj,OU=HRSJ,DC=redeafpergs,DC=local',
      grupos: ['g.rh.hrsj', 'g.acesso.remoto'],
    },
  ];

  extractDepartmentFromDn(dn?: string | null): string | null {
    if (!dn) return null;
    const parts = dn.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.toUpperCase().startsWith('OU=')) {
        const ouRaw = trimmed.substring(3);
        if (ouRaw.toUpperCase() !== 'HRSJ') {
          const ouClean = ouRaw.replace(/\.hrsj$/i, '').replace(/\./g, ' ');
          return ouClean.replace(/\b\w/g, (char) => char.toUpperCase());
        }
      }
    }
    return null;
  }

  async fetchAllLdapUsers(): Promise<LdapUserSearchResult[]> {
    const baseUrls = [
      process.env.LDAP_API_URL,
      'https://hub.hsjeronimo.com.br/api/v1/ldap/usuarios',
    ].filter(Boolean) as string[];

    const apiToken =
      process.env.LDAP_API_TOKEN ||
      process.env.APP_KEY_PROD ||
      'ak_producao_a53f41d8_0bac0a968051727b957efe649f2737bf30e58e25';

    const userMap = new Map<string, LdapUserSearchResult>();

    for (const baseUrl of baseUrls) {
      try {
        const searchTerms = ['a', 'e', 'i', 'o', 'u'];
        for (const term of searchTerms) {
          let page = 1;
          let totalPages = 1;

          while (page <= totalPages && page <= 50) {
            const url = `${baseUrl}?q=${encodeURIComponent(term)}&limite=100&pagina=${page}`;
            const response = await fetch(url, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${apiToken}`,
              },
            });

            if (!response.ok) break;

            const data = await response.json();
            let items: LdapUserSearchResult[] = [];

            if (Array.isArray(data)) {
              items = data;
            } else if (data && Array.isArray(data.data)) {
              items = data.data;
              totalPages = data.total_paginas || 1;
            }

            for (const item of items) {
              if (item && item.username && !userMap.has(item.username)) {
                userMap.set(item.username, item);
              }
            }

            page++;
          }
        }

        if (userMap.size > 0) {
          break;
        }
      } catch (err) {
        // Tenta próxima URL
      }
    }

    let fetchedUsers = Array.from(userMap.values());

    if (fetchedUsers.length === 0) {
      fetchedUsers = [...this.mockLdapUsers];
    }

    const activeUsers = fetchedUsers.filter((user) => Boolean(user.ativo) === true);

    return activeUsers.map((user) => {
      const rawDept = user.departamento || this.extractDepartmentFromDn(user.dn);
      return {
        ...user,
        departamento: normalizeDepartmentName(rawDept),
      };
    });
  }

  async searchLdap(query?: string): Promise<LdapUserSearchResult[]> {
    if (!query || !query.trim()) {
      return [];
    }

    const trimmedQuery = query.trim();
    const cleanQuery = this.cleanCpf(trimmedQuery);
    const lowerQuery = trimmedQuery.toLowerCase();

    // URLs possíveis da API Hub LDAP (contemplando Docker, localhost e IP do host)
    const baseUrls = [
      process.env.LDAP_API_URL,
      // 'http://172.17.0.1:8080/api/v1/ldap/usuarios',
      // 'http://host.docker.internal:8080/api/v1/ldap/usuarios',
      // 'http://localhost:8080/api/v1/ldap/usuarios',
    ].filter(Boolean) as string[];

    const apiToken =
      process.env.LDAP_API_TOKEN ||
      'ak_producao_8aae0065_testldapkey12345678901234567890';

    let fetchedUsers: LdapUserSearchResult[] = [];

    // Tentar consultar a API Hub
    for (const baseUrl of baseUrls) {
      try {
        const queryParamsList: string[] = [];

        // Se for um CPF limpo válido
        if (cleanQuery && cleanQuery.length >= 8) {
          queryParamsList.push(`cpf=${encodeURIComponent(cleanQuery)}`);
        }

        // Se for nome ou username
        queryParamsList.push(`q=${encodeURIComponent(trimmedQuery)}`);

        if (!trimmedQuery.includes(' ') && trimmedQuery.length > 2) {
          queryParamsList.push(`username=${encodeURIComponent(trimmedQuery)}`);
        }

        const collected: LdapUserSearchResult[] = [];

        for (const qParam of queryParamsList) {
          const url = `${baseUrl}?${qParam}`;
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${apiToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
              collected.push(...data);
            } else if (data && Array.isArray(data.data)) {
              collected.push(...data.data);
            } else if (data && typeof data === 'object' && data.username) {
              collected.push(data);
            }
          }
        }

        if (collected.length > 0) {
          // Remove duplicados por username
          const map = new Map<string, LdapUserSearchResult>();
          for (const u of collected) {
            if (u && u.username && !map.has(u.username)) {
              map.set(u.username, u);
            }
          }
          fetchedUsers = Array.from(map.values());
          break; // Conseguiu resultados da API Hub!
        }
      } catch (err) {
        // Tenta a próxima URL
      }
    }

    // Se a chamada HTTP não retornar resultados ou estiver offline, usa a busca local/mock
    if (fetchedUsers.length === 0) {
      fetchedUsers = this.mockLdapUsers.filter((user) => {
        const matchesName = user.nome_completo
          .toLowerCase()
          .includes(lowerQuery);
        const matchesUsername = user.username
          .toLowerCase()
          .includes(lowerQuery);
        const matchesEmail = user.email
          ? user.email.toLowerCase().includes(lowerQuery)
          : false;
        const matchesCpf = cleanQuery
          ? this.cleanCpf(user.cpf).includes(cleanQuery)
          : user.cpf.includes(lowerQuery);
        return matchesName || matchesUsername || matchesEmail || matchesCpf;
      });
    }

    // REGRA CRÍTICA: Somente usuários com ativo: true devem aparecer!
    return fetchedUsers
      .filter((user) => Boolean(user.ativo) === true)
      .map((user) => ({
        ...user,
        departamento: user.departamento || this.extractDepartmentFromDn(user.dn),
      }));
  }

  async registerUser(dto: RegisterLdapUserDto) {
    const cleanedCpf = this.cleanCpf(dto.cpf);

    const existingCpf = await this.prisma.ldapUser.findFirst({
      where: { cpf: cleanedCpf },
    });
    if (existingCpf) {
      if (existingCpf.deletedAt) {
        return this.prisma.ldapUser.update({
          where: { id: existingCpf.id },
          data: {
            username: dto.username,
            nomeCompleto: dto.nomeCompleto,
            email: dto.email,
            telefone: dto.telefone || null,
            departamento: dto.departamento || null,
            deletedAt: null,
          },
        });
      }
      throw new BadRequestException(
        'Usuário LDAP com este CPF já está cadastrado.',
      );
    }

    const existingUsername = await this.prisma.ldapUser.findFirst({
      where: { username: dto.username },
    });
    if (existingUsername) {
      if (existingUsername.deletedAt) {
        return this.prisma.ldapUser.update({
          where: { id: existingUsername.id },
          data: {
            nomeCompleto: dto.nomeCompleto,
            email: dto.email,
            telefone: dto.telefone || null,
            cpf: cleanedCpf,
            departamento: dto.departamento || null,
            deletedAt: null,
          },
        });
      }
      throw new BadRequestException(
        'Usuário LDAP com este username já está cadastrado.',
      );
    }

    const existingEmail = await this.prisma.ldapUser.findFirst({
      where: { email: dto.email },
    });
    if (existingEmail) {
      if (existingEmail.deletedAt) {
        return this.prisma.ldapUser.update({
          where: { id: existingEmail.id },
          data: {
            username: dto.username,
            nomeCompleto: dto.nomeCompleto,
            telefone: dto.telefone || null,
            cpf: cleanedCpf,
            departamento: dto.departamento || null,
            deletedAt: null,
          },
        });
      }
      throw new BadRequestException(
        'Usuário LDAP com este e-mail já está cadastrado.',
      );
    }

    return this.prisma.ldapUser.create({
      data: {
        username: dto.username,
        nomeCompleto: dto.nomeCompleto,
        email: dto.email,
        telefone: dto.telefone || null,
        cpf: cleanedCpf,
        departamento: dto.departamento || null,
      },
    });
  }

  async findAllRegistered(search?: string) {
    const where: any = {
      deletedAt: null,
    };

    if (search && search.trim()) {
      const cleanSearch = this.cleanCpf(search);
      const lowerSearch = search.trim();
      where.OR = [
        { nomeCompleto: { contains: lowerSearch, mode: 'insensitive' } },
        { username: { contains: lowerSearch, mode: 'insensitive' } },
        { email: { contains: lowerSearch, mode: 'insensitive' } },
        { departamento: { contains: lowerSearch, mode: 'insensitive' } },
        { cpf: { contains: cleanSearch || lowerSearch } },
      ];
    }

    return this.prisma.ldapUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeRegistered(id: string) {
    const user = await this.prisma.ldapUser.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuário LDAP cadastrado com ID "${id}" não foi encontrado.`,
      );
    }

    return this.prisma.ldapUser.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
