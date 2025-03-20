import { IEmailSender } from '../../../src/domain/interfaces/IEmailSender';

export class MockEmailSender implements IEmailSender {
    private static instance: MockEmailSender;

    private constructor() {}

    public static getInstance(): MockEmailSender {
        if (!MockEmailSender.instance) {
            MockEmailSender.instance = new MockEmailSender();
        }
        return MockEmailSender.instance;
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        // Mock implementation - não faz nada
        return Promise.resolve();
    }

    async createPassword(to: string, name: string, email: string): Promise<void> {
        // Mock implementation - não faz nada
        return Promise.resolve();
    }
} 