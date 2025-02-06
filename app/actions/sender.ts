'use server'
import { DataInterface } from "@/types/SheetTypes";
import getDireccionText from "@/utils/functions/getDireccionText";
import getGreetingText from "@/utils/functions/getGreetingText";
import templateHtml from "@/utils/templateHtml";
import templateText from "@/utils/templateText";
import nodemailer from "nodemailer"

export const SendEmail = async ({ person }: { person: DataInterface }): Promise<{ success: boolean }> => {
  
    try {
        if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error("Faltan variables de entorno para la configuración de correo");
        }

        const greeting = getGreetingText(person);

        const contentHtml = templateHtml(person.id, greeting, getDireccionText(person.direccion, true));
        const contentText = templateText(person.id, greeting, getDireccionText(person.direccion, false));

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
            to: person.email,
            replyTo: process.env.EMAIL_USERNAME,
            subject: "Soluciones en mobiliario para obras",
            html: contentHtml,
            text: contentText,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.log(error)
        return { success: false };
    }
}
