export default function templateText(id: number, greeting: string, direccion: string): string {
    return `
Estimados ${greeting},

Hemos visto que ${direccion} está avanzando y queremos ofrecerle nuestras soluciones en mobiliario a medida.
Nos especializamos en trabajar con desarrolladores, constructoras y estudios de arquitectura que buscan calidad, diseño y cumplimiento de plazos.

Tenemos experiencia en equipamiento de obra, tanto de cocinas, placares, equipamiento para SUMS y espacios comunes.

Brindamos también el servicio de diseño y producción de muebles para unidades modelo.
Consúltanos sin obligación, tenemos los mejores precios y plazos del mercado.

Y accede a un 10% de descuento exclusivo nombrando esta campaña (CONST2025).

Muchas gracias.

¿Prefiere que lo contactemos directamente? Responda a este correo o comuníquese con nosotros a través de los datos proporcionados a continuación.

---

Felipe Di Bacco  
Strongwood Furniture  
strongwoodventas@gmail.com  
+5491171196506
www.strongwood.com.ar  
https://www.instagram.com/strongwood_ar

---

Si no desea recibir más estos correos, haga clic aquí para darse de baja: https://www.strongwood.com.ar/unsubscribe?slug=${id}
    `;
}