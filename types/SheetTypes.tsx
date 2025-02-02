export type SheetRow = string[];
export type SheetData = SheetRow[];

export type ApiResponse = { success: boolean, message: string }

export interface DataInterface {
    id: number;
    enviado: number;
    desuscrito: number;
    nombre: string,
    telefono: string;
    direccion: string,
    email: string[] | [];
    estado: string;
    tipo_de_obra: string;
    etapa_de_ejecucion: string;
    pagina_web: string;
    instagram_facebook: string;
    estados_de_obra: string;
    preparacion_terreno: string;
    excavacion_cimentacion: string;
    estructura_albanileria: string;
    instalaciones: string;
    acabados_interiores_exteriores: string;
}

export type SheetResponse = {
    personasSinEnviar: DataInterface[];
    personasSinEmail: DataInterface[];
    personasEnviadas: DataInterface[];
    personasDesuscritas: DataInterface[];
};

export type UpdateSheetParams = {
    cardsToProcess: DataInterface[];
};

export type SelectedGroupTypeInterface = "sinEnviar" | "sinEmail" | "enviadas" | "desuscritas"

export interface ProgressNotificationInterface {
    title: string;
    subtitle?: string;
    type: ProgressTypeInterface
}

export type ProgressTypeInterface = 'success' | 'info' | 'error' | 'final'