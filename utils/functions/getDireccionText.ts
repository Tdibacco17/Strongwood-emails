/**
 * Retorna el texto de la dirección formateado.
 * Si isHtml es true, la parte de la dirección se envuelve en <strong></strong>.
 */
export default function getDireccionText(direccion: string, isHtml: boolean = true): string {
    // Si no existe o es "-", retornamos "su obra"
    if (!direccion || direccion === "-") {
        return "su obra";
    }

    if (isHtml) {
        return `su obra en <strong>${direccion}</strong>`;
    } else {
        return `su obra en ${direccion}`;
    }
}
