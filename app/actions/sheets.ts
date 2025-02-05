'use server'
import { sheets } from "@/lib/googleSheets";
import { ApiResponse, DataInterface, SheetResponse, SheetRow, UpdateSheetParams } from "@/types/SheetTypes";
import { revalidatePath } from "next/cache";

const range = 'sheet1!A:Z'; // COLUMANS DONDE ESTAN LOS DATOS EN EL SHEET

export const GetSheetData = async (): Promise<SheetResponse | undefined> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no está definido`);

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];
        const filteredData: SheetRow[] = rows.slice(1).filter(row => row.some(cell => cell.trim() !== ''));

        if (filteredData.length === 0) throw new Error(`No se encontraron datos.`);

        const personasSinEnviar: DataInterface[] = [];
        const personasSinEmail: DataInterface[] = [];
        const personasEnviadas: DataInterface[] = [];
        const personasDesuscritas: DataInterface[] = [];

        filteredData.forEach(row => {
            const paddedRow = [...row, ...Array(Math.max(0, 18 - row.length)).fill("-")];

            const [
                id, enviado, desuscrito, desarrolladora, desarrolladora_numero, constructora, constructora_numero, 
                estudio_arquitectura, estudio_arquitectura_numero, inmobiliaria_comercializa, inmobiliaria_comercializa_numero,
                nombre, telefono, direccion, email, estado, tipo_de_obra, etapa_de_ejecucion, pagina_web, instagram_facebook,
                estados_de_obra, preparacion_terreno, excavacion_cimentacion, estructura_albanileria, instalaciones, 
                acabados_interiores_exteriores
            ] = paddedRow;

            const parseNumber = (value: string) => {
                const num = parseInt(value?.trim(), 10);
                return isNaN(num) ? 0 : num;
            };

            // Convertimos emails a array y filtramos los vacíos o "-"
            const emailArray = (email && typeof email === 'string')
                ? email.split(',').map(e => e.trim()).filter(e => e !== "" && e !== "-")
                : [];

            const persona: DataInterface = {
                id: parseNumber(id),
                enviado: parseNumber(enviado),
                desuscrito: parseNumber(desuscrito),
                nombre: nombre?.trim() || "-",
                telefono: telefono?.trim() || "-",
                direccion: direccion?.trim() || "-",
                email: emailArray,
                estado: estado?.trim() || "-",
                tipo_de_obra: tipo_de_obra?.trim() || "-",
                etapa_de_ejecucion: etapa_de_ejecucion?.trim() || "-",
                pagina_web: pagina_web?.trim() || "-",
                instagram_facebook: instagram_facebook?.trim() || "-",
                estados_de_obra: estados_de_obra?.trim() || "-",
                preparacion_terreno: preparacion_terreno?.trim() || "-",
                excavacion_cimentacion: excavacion_cimentacion?.trim() || "-",
                estructura_albanileria: estructura_albanileria?.trim() || "-",
                instalaciones: instalaciones?.trim() || "-",
                acabados_interiores_exteriores: acabados_interiores_exteriores?.trim() || "-",
                desarrolladora: desarrolladora?.trim() || "-",
                desarrolladora_numero: desarrolladora_numero?.trim() || "-",
                constructora: constructora?.trim() || "-",
                constructora_numero: constructora_numero?.trim() || "-",
                estudio_arquitectura: estudio_arquitectura?.trim() || "-",
                estudio_arquitectura_numero: estudio_arquitectura_numero?.trim() || "-",
                inmobiliaria_comercializa: inmobiliaria_comercializa?.trim() || "-",
                inmobiliaria_comercializa_numero: inmobiliaria_comercializa_numero?.trim() || "-",
            };

            if (persona.desuscrito === 1) {
                // Si la persona está desuscrita, la agregamos al array de desuscritos
                personasDesuscritas.push(persona);
            }

            if (emailArray.length === 0) {
                personasSinEmail.push({ ...persona, email: [] }); // Asignamos array vacío
            } else if (persona.enviado === 0 && persona.desuscrito === 0) {
                // Solo agregamos si "enviado" es 0 y no está desuscrito
                personasSinEnviar.push(persona);
            } 

            if (persona.enviado === 1 || (persona.enviado === 1 && persona.desuscrito === 1)) {
                // Si fue enviado o enviado y desuscrito, va a personasEnviadas
                personasEnviadas.push(persona);
            }
        });

        return { personasSinEnviar, personasSinEmail, personasEnviadas, personasDesuscritas };
    } catch (error: unknown) {
        console.error('Error catch: ', error);
        return undefined;
    }
};

export const UpdateSheetData = async ({ cardsToProcess }: UpdateSheetParams): Promise<ApiResponse> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no está definido`);

    try {
        // Obtener los datos actuales de la hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];
        if (rows.length === 0) throw new Error(`No se encontraron datos en la hoja.`);

        // Crear un mapa de IDs en formato string limpio
        const idSet = new Set(cardsToProcess.map(card => card.id.toString().trim()));

        // Actualizar las filas donde el ID coincida
        const updatedRows = rows.map(row => {
            if (!row[0]) return row; // Si la fila no tiene ID, la ignoramos
            const id = row[0].toString().trim();

            if (idSet.has(id)) {
                row[1] = "1"; // Cambiar la columna "enviado" a 1
            }
            return row;
        });

        // Enviar actualización a Google Sheets
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values: updatedRows },
        });

        revalidatePath('/');
        return { success: true, message: "Google Sheets actualizado correctamente" };
    } catch (error) {
        console.error('Error catch: ', error);
        return { success: false, message: "Error al actualizar Google Sheets" };
    }
};

export const updateDesuscrito = async (id: number): Promise<ApiResponse> => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error(`SPREADSHEET_ID no está definido`);

    try {
        // Obtener los datos actuales de la hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];
        if (rows.length === 0) throw new Error(`No se encontraron datos en la hoja.`);

        // Buscar el ID y actualizar la propiedad "desuscrito"
        const updatedRows = rows.map(row => {
            if (!row[0]) return row; // Si la fila no tiene ID, la ignoramos
            const rowId = parseInt(row[0].toString().trim(), 10); // Convertir ID de la fila a número

            // Si el ID coincide, actualizar la columna "desuscrito" (suponiendo que está en la columna 3)
            if (rowId === id) {
                row[2] = "1"; // Cambiar la columna "desuscrito" a 1
            }
            return row;
        });

        // Enviar actualización a Google Sheets
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values: updatedRows },
        });

        return { success: true, message: `Se actualizó el valor de desuscrito a 1 para el ID ${id}.` };
    } catch (error) {
        console.error('Error catch: ', error);
        return { success: false, message: "Error al actualizar desuscrito en Google Sheets" };
    }
};