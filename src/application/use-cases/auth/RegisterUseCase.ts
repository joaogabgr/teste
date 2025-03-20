import { sendEmailCreatePassword } from "/application/operations/email/sendEmailCreatePassword";
import { isValidCPF } from "/application/operations/isValidCPF";
import { transformUserToDTO } from "/application/operations/user/transformeUserToDTO";
import { IUserRepository } from "/domain/models/entities/User";
import RegisterUserDTO from "/web/dtos/auth/RegisterUserDTO";
import { ReadUserDTO } from "/web/dtos/user/ReadUserDTO";

export class RegisterUseCase {
    constructor(private userRepository: IUserRepository) {}
    
    async execute(userData: RegisterUserDTO): Promise<ReadUserDTO> {
        const userExists = await this.userRepository.findByEmail(userData.getEmail());
        const cpfExists = await this.userRepository.findByCpf(userData.getCpf());

        if (userExists) {
            throw new Error('Email já cadastrado');
        }

        if (isValidCPF(userData.getCpf()) === false) {
            throw new Error('CPF inválido');
        }

        if (cpfExists) {
            throw new Error('CPF já cadastrado');
        }

        const user = await this.userRepository.create({
            name: userData.getName(),
            email: userData.getEmail(),
            cpf: userData.getCpf(),
            role: 'user'
        });

        sendEmailCreatePassword(user.email, user.name)
        
        return transformUserToDTO(user);
    }
} 