import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno no banco de dados.';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.BAD_REQUEST;
        const target = (exception.meta?.target as string[]) || [];
        const fieldName = target.join(', ');
        message = fieldName
          ? `Já existe um registro com este(a) ${fieldName} no sistema.`
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
