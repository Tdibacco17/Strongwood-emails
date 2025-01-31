'use server'
import { sheets } from "@/lib/googleSheets";
import { revalidatePath } from "next/cache";

export type SheetRow = string[];
export type SheetData = SheetRow[];

export type ApiResponse = { success: boolean, message: string }

export interface DataInterface {
    id:number;
    enviado:number;
    desuscribir:number;
    nombre:string,
    telefono:number;
    direccion:string,
    email:string;
    estado:string;
    tipo_de_obra:string;
    etapa_de_ejecucion:string;
    pagina_web:string;
    instagram_facebook:string;
    estados_de_obra:string;
    preparacion_terreno:string;
    excavacion_cimentacion:string;
    estructura_albanileria:string;
    instalaciones:string;
    acabados_interiores_exteriores:string;
}

const range = 'sheet1!A:R';

export const GetSheetData = async (): Promise<DataInterface[] | undefined> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no esta definido`);

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

         const rows = response.data.values || [];
        // Excluimos la cabecera y filas vacías
        const filteredData: SheetRow[] = rows.slice(1).filter(row => row.some(cell => cell.trim() !== ''));

        if (filteredData.length === 0) throw new Error(`No se encontraron datos.`);

        const personas: DataInterface[] = filteredData.map(row => {
            // Completar la fila con "-" en caso de faltar columnas
            const paddedRow = row.length < 18 ? [...row, ...Array(18 - row.length).fill("-")] : row;

            const [
                id,
                enviado,
                desuscribir,
                nombre,
                telefono,
                direccion,
                email,
                estado,
                tipo_de_obra,
                etapa_de_ejecucion,
                pagina_web,
                instagram_facebook,
                estados_de_obra,
                preparacion_terreno,
                excavacion_cimentacion,
                estructura_albanileria,
                instalaciones,
                acabados_interiores_exteriores,
            ] = paddedRow;

            // Validamos que los campos obligatorios tengan valor; en caso de que sean "-" se puede considerar error o asignar otro valor
            if (!id || !nombre || !email || id === "-" || nombre === "-" || email === "-") {
                throw new Error(`Datos obligatorios faltantes en la fila: ${row}`);
            }

            return {
                id: parseInt(id.trim()) || 0,
                enviado: (enviado && enviado !== "-") ? parseInt(enviado.trim()) : 0,
                desuscribir: (desuscribir && desuscribir !== "-") ? parseInt(desuscribir.trim()) : 0,
                nombre: nombre.trim() || "-",
                telefono: (telefono && telefono !== "-") ? parseFloat(telefono.trim()) : 0,
                direccion: (direccion && direccion !== "-") ? direccion.trim() : "-",
                email: email.trim() || "-",
                estado: (estado && estado !== "-") ? estado.trim() : "-",
                tipo_de_obra: (tipo_de_obra && tipo_de_obra !== "-") ? tipo_de_obra.trim() : "-",
                etapa_de_ejecucion: (etapa_de_ejecucion && etapa_de_ejecucion !== "-") ? etapa_de_ejecucion.trim() : "-",
                pagina_web: (pagina_web && pagina_web !== "-") ? pagina_web.trim() : "-",
                instagram_facebook: (instagram_facebook && instagram_facebook !== "-") ? instagram_facebook.trim() : "-",
                estados_de_obra: (estados_de_obra && estados_de_obra !== "-") ? estados_de_obra.trim() : "-",
                preparacion_terreno: (preparacion_terreno && preparacion_terreno !== "-") ? preparacion_terreno.trim() : "-",
                excavacion_cimentacion: (excavacion_cimentacion && excavacion_cimentacion !== "-") ? excavacion_cimentacion.trim() : "-",
                estructura_albanileria: (estructura_albanileria && estructura_albanileria !== "-") ? estructura_albanileria.trim() : "-",
                instalaciones: (instalaciones && instalaciones !== "-") ? instalaciones.trim() : "-",
                acabados_interiores_exteriores: (acabados_interiores_exteriores && acabados_interiores_exteriores !== "-") ? acabados_interiores_exteriores.trim() : "-",
            }
        });
        
        return personas;
    } catch (error: any) {
        console.error('Error catch: ', error);
        return undefined
    }
}

export const updateEnviado = async (ID: string): Promise<ApiResponse> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no está definido`);

    try {
        // Obtener datos desde la hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];
        // Salteamos la primera fila de encabezados y buscamos el ID en la primera columna
        const userRow = rows.slice(1).find(row => row[0]?.toString().trim() === ID?.toString().trim());

        if (!userRow) {
            throw new Error(`No se encontró el ID ${ID}`);
        }

        if (userRow[1] === '1') {
            return { success: true, message: `El estado 'Enviado' ya está marcado como 1 para el ID ${ID}` };
        }

        const rowIndex = rows.findIndex(row => row[0]?.toString().trim() === ID?.toString().trim()) + 1;
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `sheet1!B${rowIndex}`, // Actualizado a columna B
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['1']], // Cambiar el valor a 1
            },
        });

        revalidatePath('/');
        return { success: true, message: `El estado de 'Enviado' se ha actualizado correctamente para el ID: ${ID}` };
    } catch (error: any) {
        console.error('[Error al actualizar el valor]: ', error);
        return { success: false, message: `[Error al actualizar el valor]: ${error.message}` };
    }
};
