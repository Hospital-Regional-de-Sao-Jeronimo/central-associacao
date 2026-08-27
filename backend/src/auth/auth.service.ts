import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Simulação ou validação de credenciais do gestor HRSJ
    if (email === 'admin@hrsj.sc.gov.br' && password === '123456') {
      return {
        access_token: 'fake-jwt-token-hrsj-admin-2026',
        user: {
          id: 'admin-01',
          name: 'Mateus Speress',
          email: 'admin@hrsj.sc.gov.br',
          role: 'ADMIN',
          hospital: 'Hospital Regional São Jerônimo',
        },
      };
    }

    // Permite também qualquer e-mail com senha padrão para facilidade de testes
    if (password === '123456' || password === 'admin123') {
      return {
        access_token: `token-hrsj-${Date.now()}`,
        user: {
          id: `user-${Date.now()}`,
          name: email.split('@')[0].toUpperCase(),
          email,
          role: 'ADMIN',
          hospital: 'Hospital Regional São Jerônimo',
        },
      };
    }

    throw new UnauthorizedException('E-mail ou senha incorretos. Tente admin@hrsj.sc.gov.br com a senha 123456');
  }
}
