import { Request, Response } from "express";
import { DeleteUserUseCase } from "../../../application/use-cases/user/DeleteUserUseCase";

export class DeleteUserController {
    constructor(private deleteUserUseCase: DeleteUserUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return response.sendError('Usuário não encontrado ou inexistente', 400);
            }

            await this.deleteUserUseCase.execute(id);

            return response.sendSuccess('Usuário deletado com sucesso', 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}