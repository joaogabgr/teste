import { Request, Response } from 'express';
import { ListUserUseCase } from '/application/use-cases/user/ListUserUseCase';

export class ListUserController {
    constructor(private listUserUseCase: ListUserUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const users = await this.listUserUseCase.execute();
            
            const usersWithoutPassword = users;

            return response.sendSuccess(usersWithoutPassword, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}