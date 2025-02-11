export type SheetRow = string[];
export type SheetData = SheetRow[];

export type ApiResponse = { success: boolean, message: string }

export interface DataInterface {
    id: number;
    enviado: number;
    desuscrito: number;
    nombre: string
    telefono: string;
    direccion: string,
    email: string[] | [];
    estado: string;
    tipo_de_obra: string;
    etapa_de_ejecucion: string;
    pagina_web: string;
    instagram_facebook: string;
    desarrolladora: string;
    desarrolladora_numero: string;
    constructora: string;
    constructora_numero: string;
    estudio_arquitectura: string;
    estudio_arquitectura_numero: string;
    inmobiliaria_comercializa: string;
    inmobiliaria_comercializa_numero: string;
    propietario: string
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