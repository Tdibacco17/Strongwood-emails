'use client'
import { useState } from "react";
import { SendEmail } from "../actions/sender";
import EmailTable from "@/components/EmailTable/EmailTable";
import NotificationBar from "@/components/NotificationBar/NotificationBar";
import HeaderButtons from "@/components/HeaderButtons/HeaderButtons";
import { signOut } from "next-auth/react";
import { DataInterface, ProgressNotificationInterface, SelectedGroupTypeInterface, SheetResponse } from "@/types/SheetTypes";
import { UpdateSheetData } from "../actions/sheets";

export default function HomePageClient({ sheetsData, isDevMode }: { sheetsData: SheetResponse | undefined, isDevMode: boolean }) {
    const [selectedGroup, setSelectedGroup] = useState<SelectedGroupTypeInterface>("sinEnviar");
    const [selectedCards, setSelectedCards] = useState<DataInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSend, setIsSend] = useState<boolean>(false);
    const [progress, setProgress] = useState<ProgressNotificationInterface[]>([]);

    const getFilteredData = () => {
        if (!sheetsData) return [];

        switch (selectedGroup) {
            case "sinEnviar":
                return sheetsData.personasSinEnviar;
            case "sinEmail":
                return sheetsData.personasSinEmail;
            case "enviadas":
                return sheetsData.personasEnviadas;
            case "desuscritas":
                return sheetsData.personasDesuscritas;
            default:
                return [];
        }
    };

    const handleSelectCard = (person: DataInterface) => {
        if (selectedGroup !== "sinEnviar") return;

        setSelectedCards((prevSelected) => {
            const isSelected = prevSelected.some((p) => p.id === person.id);

            if (isSelected) {
                // Si ya está seleccionado, lo quitamos
                return prevSelected.filter((p) => p.id !== person.id);
            } else {
                // Si no está seleccionado y hay menos de 10, lo agregamos
                if (prevSelected.length < 10) {
                    return [...prevSelected, person];
                } else {
                    return prevSelected; // No agrega más de 10
                }
            }
        });
    };

    const handleClearSelectedCards = () => {
        setSelectedCards([]);
    };

    const handleAutoSelectCards = () => {
        if (selectedGroup !== "sinEnviar" || !sheetsData) return;

        const maxSelection = 10;
        const alreadySelected = selectedCards.map((p) => p.id); // IDs ya seleccionados
        const remainingSlots = maxSelection - alreadySelected.length; // Espacios disponibles

        if (remainingSlots <= 0) return; // Si ya hay 10 seleccionados, no hacer nada

        const newSelections = sheetsData.personasSinEnviar
            .filter((p) => !alreadySelected.includes(p.id)) // Evita duplicados
            .slice(0, remainingSlots); // Selecciona solo los necesarios para completar 10

        setSelectedCards((prevSelected) => [...prevSelected, ...newSelections]);
    };

    const handleSendEmails = async () => {
        setLoading(true);
        if (selectedCards.length === 0) return;

        const cardsToProcess = [...selectedCards];
        const idsToUpdate: number[] = [];

        try {
            for (let i = 0; i < cardsToProcess.length; i++) {
                const card = cardsToProcess[i];

                // Si no tiene emails, saltamos esta tarjeta
                if (card.email.length === 0) continue;

                try {
                    setProgress(prevProgress => [
                        ...prevProgress,
                        { title: `Enviando ${card.email.length > 1 ? "correos" : "correo"} a: b:${card.email.join(', ')}:b`, type: 'info' }
                    ]);

                    if (!isDevMode) {
                        const result = await SendEmail({ person: card });

                        if (!result.success) {
                            setProgress(prevProgress => [
                                ...prevProgress,
                                { title: `Hubo un error al enviar ${card.email.length > 1 ? "los correos" : "el correo"}`, type: 'error' }
                            ]);
                        }
                    }

                    setProgress(prevProgress => [
                        ...prevProgress,
                        { title: `${card.email.length > 1 ? "Correos enviados" : "Correo enviado"} correctamente`, type: 'success' }
                    ]);

                    idsToUpdate.push(card.id);
                    // Log para confirmar que el correo fue enviado
                } catch (emailError: unknown) {
                    console.error(`Cath error:  `, emailError);
                    // alert(`Hubo un error al enviar los correos a ${card.email}`);
                    setProgress(prevProgress => [
                        ...prevProgress,
                        { title: `Hubo un error al enviar ${card.email.length > 1 ? "los correos" : "el correo"}`, type: 'error' }
                    ]);
                }

                // Log de éxito al pasar al siguiente grupo de correos
                setProgress(prevProgress => [
                    ...prevProgress,
                    {
                        title: `Todos los correos de la tarjeta b:${card.nombre}:b han sido enviados.`,
                        ...(i < cardsToProcess.length - 1 && {
                            subtitle: `Esperando 1 minuto antes de continuar...`
                        }),
                        type: 'info'
                    }
                ]);

                // Esperar un poco antes de pasar al siguiente grupo de correos (puedes ajustar este tiempo)
                if (i < cardsToProcess.length - 1) {
                    // console.log("Esperando 5 segundos antes de continuar...");
                    await new Promise(resolve => setTimeout(resolve, isDevMode ? 1000 : 60000)); // 60000 milisegundos = 1 minuto
                }
            }

            //  **Hacemos una única llamada para actualizar todos los IDs juntos**
            if (idsToUpdate.length > 0) {
                if (!isDevMode) {
                    const result = await UpdateSheetData({
                        cardsToProcess: cardsToProcess.filter(card => idsToUpdate.includes(card.id)),
                    });

                    if (!result.success) {
                        setProgress(prevProgress => [
                            ...prevProgress,
                            { title: `Hubo un error al actualizar ${idsToUpdate.length > 1 ? "los registros" : "el registro"} en Google Sheets`, type: 'error' }
                        ]);
                    }
                }

                setProgress(prevProgress => [
                    ...prevProgress,
                    { title: `Se actualizaron ${idsToUpdate.length} ${idsToUpdate.length > 1 ? `registros` : "registro"} en Google Sheets`, type: 'final' }
                ]);
            }
        } catch (error) {
            console.error("Error al enviar los correos:", error);
            setProgress(prevProgress => [
                ...prevProgress,
                { title: "Hubo un error general.", type: 'error' }
            ]);
        } finally {
            setLoading(false);
            setSelectedCards([]);
        }
    };

    return (
        <main className="flex flex-col w-full h-full relative">
            <div className="fixed top-0 left-0 w-full z-20 flex justify-center">
                <p className="text-xs hover:underline underline-offset-4 font-geistSans cursor-pointer py-2.5 px-3"
                    onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}>
                    Cerrar sesión
                </p>
            </div>
            <HeaderButtons
                {...{
                    selectedCards,
                    handleClearSelectedCards,
                    handleAutoSelectCards,
                    setSelectedGroup,
                    selectedGroup,
                    setIsSend,
                    isSend,
                    loading
                }}
            />
            <div className="h-full w-full overflow-hidden">
                <EmailTable
                    {...{
                        isSend,
                        selectedGroup,
                        handleSelectCard,
                        selectedCards,
                        getFilteredData
                    }}
                />
                <NotificationBar
                    {...{
                        isSend,
                        progress,
                        handleSendEmails,
                        loading,
                        selectedCards
                    }}
                />
            </div>
        </main>
    );
}
