'use server'
import templateHtml from "@/utils/templateHtml";
import nodemailer from "nodemailer"

export const ContactFormAction = async (): Promise<{ success: boolean }> => {
    try {
        if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error("Faltan variables de entorno para la configuración de correo");
        }

        const contentHtml = templateHtml();

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verificamos la configuración del servidor de correo
        await transporter.verify();

        // Enviamos el correo
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME,
            subject: "Contacto - Pagína web",
            html: contentHtml,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.log(error)
        return { success: false };
    }
}