import { EmailUseCase } from "/application/use-cases/email/EmailUseCase";
import { NodemailerEmailSender } from "/infrastructure/email/nodeMailerEmailSender";

export function sendEmailCreatePassword(email: string, name: string) {
    const emailSender = NodemailerEmailSender.getInstance();
    const emailUseCase = new EmailUseCase(emailSender);

    emailUseCase.sendEmailToCreatePassword(email, name, email);
}