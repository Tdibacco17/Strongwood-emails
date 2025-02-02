import { DataInterface, SelectedGroupTypeInterface } from "@/types/SheetTypes"

export default function HeaderButtons({
    selectedCards,
    handleClearSelectedCards,
    handleAutoSelectCards,
    setSelectedGroup,
    selectedGroup,
    setIsSend,
    isSend,
    loading
}: {
    selectedCards: DataInterface[],
    handleClearSelectedCards: () => void,
    handleAutoSelectCards: () => void,
    setSelectedGroup: (e: SelectedGroupTypeInterface) => void,
    selectedGroup: SelectedGroupTypeInterface,
    setIsSend: (e: boolean) => void,
    isSend: boolean,
    loading: boolean
}) {
    return (
        <div className="h-28 max-h-28 min-h-28 grid grid-cols-7 items-end border-b-[1px] border-gray6 bg-dark sticky top-0 left-0 z-10 pb-6 pt-10 px-6 w-full">
            <div className="col-span-2 flex flex-row gap-4 items-center h-10">
                <p className="text-xl font-bold font-geistSans">Email Inbox</p>
                {selectedCards.length > 0 && selectedGroup === "sinEnviar" &&
                    <p onClick={handleClearSelectedCards}
                        className="hover:underline underline-offset-4 text-sm font-geistSans cursor-pointer rounded-lg font-light">
                        Limpiar selección
                    </p>}
            </div>
            <div className="col-span-5 flex flex-row justify-between gap-10">
                {/* Sender */}
                <div className="flex flex-row items-center h-10 gap-4">
                    <button
                        disabled={selectedCards.length === 10}
                        onClick={handleAutoSelectCards}
                        className="disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-light bg-light hover:bg-lightHover text-sm text-dark font-medium font-geistSans py-1 px-3 whitespace-nowrap rounded-md">
                        Seleccionar 10 tarjetas
                    </button>
                    <p className="font-geistSans text-sm font-light">Selecciones:
                        <span className="pl-2">
                            {selectedCards.length > 0 && selectedCards.length}
                        </span>
                    </p>
                </div>
                <div className="flex flex-row gap-4 h-10">
                    {/* Cambio de tarjetas */}
                    <div className="bg-gray5 grid grid-cols-4 rounded-lg p-1">
                        <button
                            onClick={() => setSelectedGroup("sinEnviar")}
                            className={`text-sm font-medium font-geistSans py-1 px-3 whitespace-nowrap rounded-md ${selectedGroup === "sinEnviar" ? "bg-dark" : "bg-transparent text-muted"}`}>
                            Sin Enviar
                        </button>
                        <button
                            onClick={() => setSelectedGroup("enviadas")}
                            className={`text-sm font-medium font-geistSans py-1 px-3 whitespace-nowrap rounded-md ${selectedGroup === "enviadas" ? "bg-dark" : "bg-transparent text-muted"}`}>
                            Enviados
                        </button>
                        <button
                            onClick={() => setSelectedGroup("sinEmail")}
                            className={`text-sm font-medium font-geistSans py-1 px-3 whitespace-nowrap rounded-md ${selectedGroup === "sinEmail" ? "bg-dark" : "bg-transparent text-muted"}`}>
                            Sin Email
                        </button>
                        <button
                            onClick={() => setSelectedGroup("desuscritas")}
                            className={`text-sm font-medium font-geistSans py-1 px-3 whitespace-nowrap rounded-md ${selectedGroup === "desuscritas" ? "bg-dark" : "bg-transparent text-muted"}`}>
                            Desuscritar
                        </button>
                    </div>
                    <button
                        onClick={() => setIsSend(!isSend)}
                        className="disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-light bg-light hover:bg-lightHover text-sm text-dark w-28 font-medium font-geistSans flex justify-center items-center py-1 px-3 whitespace-nowrap rounded-md">
                        {isSend
                            ? 'Cerrar' : loading ? 'Ver estado' : 'Enviar emails'}
                    </button>
                </div>
            </div>
        </div>
    )
}