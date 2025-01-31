'use client'
import { useState } from "react";
import { DataInterface, updateEnviado } from "../actions/sheets";

export default function HomePageClient({ sheetsData }: { sheetsData: DataInterface[] | undefined }) {
    const [message, setMessage] = useState<string | null>(null);

    const handleUpdateEnviado = async (ID: string) => {
        const resultMessage = await updateEnviado(ID);
        setMessage(resultMessage.message);
    };

    if (!sheetsData) {
        return <p>No se pudieron cargar los datos.</p>;
    }

    return (
        <main className="h-full max-h-full w-full relative pb-3">
            <h1>Datos de la hoja de cálculo</h1>

            {message && <p>{message}</p>}

            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Nombre</th>
                        <th className="border p-2">Telefono</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Enviado</th>
                    </tr>
                </thead>
                <tbody>
                    {sheetsData.map((person) => (
                        <tr key={person.ID}>
                            <td className="border p-2">{person.ID}</td>
                            <td className="border p-2">{person.Nombre}</td>
                            <td className="border p-2">{person.Telefono}</td>
                            <td className="border p-2">{person.Email}</td>
                            <td className="border p-2">{person.Enviado}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleUpdateEnviado(person.ID)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Marcar como Enviado
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}