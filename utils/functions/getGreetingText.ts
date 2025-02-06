import { DataInterface } from "@/types/SheetTypes";

export default function getGreetingText(person: DataInterface): string {
    if (person.inmobiliaria_comercializa && person.inmobiliaria_comercializa !== "-") {
        return `Inmobiliaria: ${person.inmobiliaria_comercializa}`;
    }
    if (person.desarrolladora && person.desarrolladora !== "-") {
        return `Desarrolladora: ${person.desarrolladora}`;
    }
    if (person.estudio_arquitectura && person.estudio_arquitectura !== "-") {
        return `Estudio de Arquitectura: ${person.estudio_arquitectura}`;
    }
    if (person.constructora && person.constructora !== "-") {
        return `Constructora: ${person.constructora}`;
    }
    if (person.propietario && person.propietario !== "-") {
        return `Propietario: ${person.propietario}`;
    }
    return "";
}
