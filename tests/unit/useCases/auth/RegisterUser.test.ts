import dotenv from 'dotenv';
dotenv.config();

import { RegisterUseCase } from "/application/use-cases/auth/RegisterUseCase";
import { IUserRepository, User } from "/domain/models/entities/User";
import RegisterUserDTO from '/web/dtos/auth/RegisterUserDTO';

describe("Testando registro de usuário quando os dados forem corretos", () => {
    let registerUseCase: RegisterUseCase;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        // Mock do JWT_SECRET
        process.env.JWT_SECRET = "test-secret-key";
  
        // Cria um mock do UserRepository
        mockUserRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            list: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByCpf: jest.fn()
        } as jest.Mocked<IUserRepository>;
  
        // Instancia o RegisterUseCase com o repositório mockado
        registerUseCase = new RegisterUseCase(mockUserRepository);
    });

    afterEach(() => {
        // Limpa o mock do JWT_SECRET após cada teste
        delete process.env.JWT_SECRET;
        jest.clearAllMocks();
    });

    it("deve registrar um usuário com sucesso quando os dados são válidos", async () => {
        // Configura os mocks para retornar null (usuário não existe)
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.findByCpf.mockResolvedValue(null);

        // Configura o mock de create para retornar um usuário
        const createdUser = new User();
        createdUser.name = "Erik";
        createdUser.email = "erik@mail.com";
        createdUser.cpf = "794.979.510-78";
        mockUserRepository.create.mockResolvedValue(createdUser);

        const validUserData = new RegisterUserDTO(
            "Erik",
            "erik@mail.com",
            "794.979.510-78"
        );

        const result = await registerUseCase.execute(validUserData);

        expect(result).toBeDefined();
        expect(result.getName()).toBe("Erik");
        expect(result.getEmail()).toBe("erik@mail.com");
        expect(result.getCpf()).toBe("794.979.510-78");
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it("deve lançar erro quando cpf já existe", async () => {
        // Configura o mock para simular CPF já existente
        const existingUser = new User();
        existingUser.cpf = "794.979.510-78";
        mockUserRepository.findByCpf.mockResolvedValue(existingUser);
        mockUserRepository.findByEmail.mockResolvedValue(null);

        const validUserData = new RegisterUserDTO(
            "Erik",
            "erik@mail.com",
            "794.979.510-78"
        );

        await expect(registerUseCase.execute(validUserData))
            .rejects
            .toThrow("CPF já cadastrado");
        
        expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando email já existe", async () => {
        // Configura o mock para simular email já existente
        const existingUser = new User();
        existingUser.email = "erik@mail.com";
        mockUserRepository.findByEmail.mockResolvedValue(existingUser);
        mockUserRepository.findByCpf.mockResolvedValue(null);

        const validUserData = new RegisterUserDTO(
            "Erik",
            "erik@mail.com",
            "794.979.510-78"
        );

        await expect(registerUseCase.execute(validUserData))
            .rejects
            .toThrow("Email já cadastrado");
        
        expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando cpf é invalido", async () => {
        // Configura os mocks para retornar null (usuário não existe)
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.findByCpf.mockResolvedValue(null);

        const validUserData = new RegisterUserDTO(
            "Erik",
            "erik@mail.com",
            "123.456.789-10"
        );

        await expect(registerUseCase.execute(validUserData))
            .rejects
            .toThrow("CPF inválido");
        
        expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
});