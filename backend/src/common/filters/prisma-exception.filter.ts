import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = `Erro no banco de dados (${exception.code}).`;

    switch (exception.code) {
      case 'P1000': {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Falha de autenticação/conexão com o banco de dados (P1000). Verifique usuário, senha e DATABASE_URL no .env do servidor.';
        break;
      }
      case 'P1001': {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Servidor de banco de dados inacessível (P1001). Verifique se o PostgreSQL está rodando e a porta/host no .env.';
        break;
      }
      case 'P2002': {
        status = HttpStatus.BAD_REQUEST;
        const target = (exception.meta?.target as string[]) || [];
        const fieldName = target.join(', ');
        message = fieldName
          ? `Já existe um registro cadastrado com este(a) ${fieldName} no sistema.`
          : 'Já existe um registro cadastrado com estes dados únicos no banco de dados.';
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'O registro solicitado não foi encontrado no banco de dados.';
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Falha de restrição relacional no banco de dados (chave estrangeira inválida).';
        break;
      }
      default:
        message = `Erro de banco de dados (${exception.code}).`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: status === HttpStatus.BAD_REQUEST ? 'Bad Request' : 'Database Error',
      message,
    });
  }
}
