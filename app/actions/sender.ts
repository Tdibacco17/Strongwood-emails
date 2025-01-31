'use server'
import templateHtml from "@/utils/templateHtml";
import nodemailer from "nodemailer"

export const ContactFormAction = async (): Promise<{ success: boolean }> => {
    try {
        if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error("Faltan variables de entorno para la configuración de correo");
        }


        const contentHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Strongwood - Presentación</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="padding: 20px; text-align: center; background-color: #333333; color: #ffffff;">
                        <h2>Strongwood</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: left; color: #333333;">
                        <p>Estimado BAEK:</p>
                        <p>Mi nombre es <strong>Felipe Di Bacco</strong>, soy el dueño de <strong>Strong Wood</strong>, una empresa de amoblamientos a medida para edificios, ubicada en Villa Devoto.</p>
                        <p>Contamos con un equipo grande y experimentado, incluyendo una diseñadora de interiores, lo que nos permite llevar adelante proyectos de cualquier escala. Ofrecemos soluciones personalizadas de alta calidad, optimizando la funcionalidad y estética de los espacios.</p>
                        <p>Además, creemos que podemos ayudarles a mejorar el presupuesto de amoblamiento sin comprometer la calidad del trabajo.</p>
                        <p>Quedo a su disposición para coordinar una reunión o resolver cualquier consulta. Será un gusto poder colaborar con ustedes en este proyecto.</p>
                        <p>Saludos cordiales,</p>
                        <p><strong>Felipe Di Bacco</strong></p>
                        <p>Si ya no desea recibir nuestros correos, puede <a href="https://tudominio.com/desuscribirse" style="color: #007bff;">darse de baja aquí</a>.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `; 
        
        const contentText = `
        Estimado BAEK,

        Mi nombre es Felipe Di Bacco, soy el dueño de Strong Wood, una empresa de amoblamientos a medida para edificios, ubicada en Villa Devoto.

        Contamos con un equipo grande y experimentado, incluyendo una diseñadora de interiores, lo que nos permite llevar adelante proyectos de cualquier escala. Ofrecemos soluciones personalizadas de alta calidad, optimizando la funcionalidad y estética de los espacios.

        Creemos que podemos ayudarles a mejorar el presupuesto de amoblamiento sin comprometer la calidad del trabajo.

        Quedo a su disposición para coordinar una reunión o resolver cualquier consulta. Será un gusto poder colaborar con ustedes en este proyecto.

        Saludos cordiales,
        Felipe Di Bacco

        Si ya no desea recibir nuestros correos, puede darse de baja aquí: https://tudominio.com/desuscribirse
        `;
        
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
            replyTo: process.env.EMAIL_USERNAME,
            subject: "Propuesta de amoblamiento - Strongwood", // "Soluciones de amoblamiento - Strongwood"
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
