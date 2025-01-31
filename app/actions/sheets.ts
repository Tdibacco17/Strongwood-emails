'use server'
import { sheets } from "@/lib/googleSheets";
import { revalidatePath } from "next/cache";

export type SheetRow = string[];
export type SheetData = SheetRow[];

export type ApiResponse = { success: boolean, message: string }

export interface DataInterface {
    ID: string;
    Nombre: string;
    Telefono: number;
    Email: string;
    Enviado: number;
    // id	enviado	desuscribir	nombre	telefono	direccion	email	estado	tipo_de_obra	etapa_de_ejecucion	pagina_web	instagram_facebook	estados_de_obra	preparacion_terreno	excavacion_cimentacion	estructura_albanileria	instalaciones	acabados_interiores_exteriores
}

const range = 'sheet1!A:E';

export const GetSheetData = async (): Promise<DataInterface[] | undefined> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no esta definido`);

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];
        const filteredData: SheetRow[] = rows.slice(1).filter(row => row.some(cell => cell.trim() !== ''));

        if (filteredData.length === 0) throw new Error(`No se encontraron datos.`);

        const personas: DataInterface[] = filteredData.map(row => {
            const [ID, Nombre, Telefono, Email, Enviado] = row;

            if (!ID || !Nombre || !Email) {
                throw new Error(`Datos faltantes en la fila: ${row}`);
            }

            return {
                ID: ID.trim(),
                Nombre: Nombre.trim(),
                Telefono: Telefono ? parseFloat(Telefono) : 0,
                Email: Email.trim(),
                Enviado: Enviado ? parseInt(Enviado) : 0,
            };
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

        if (userRow[4] === '1') {
            return { success: true, message: `El estado 'Enviado' ya está marcado como 1 para el ID ${ID}` };
        }

        const rowIndex = rows.findIndex(row => row[0]?.toString().trim() === ID?.toString().trim()) + 1;
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `sheet1!E${rowIndex}`,
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
