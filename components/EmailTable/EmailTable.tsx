import { DataInterface, SelectedGroupTypeInterface } from "@/types/SheetTypes"

export default function EmailTable({
    isSend,
    selectedGroup,
    handleSelectCard,
    selectedCards,
    getFilteredData
}: {
    isSend: boolean,
    selectedGroup: SelectedGroupTypeInterface,
    handleSelectCard: (person: DataInterface) => void,
    selectedCards: DataInterface[],
    getFilteredData: () => DataInterface[]
}) {
    return (
        <div className={`px-8 h-full ${isSend ? "w-4/6 " : "w-full"} transition-[width] duration-300 relative`}>
            {getFilteredData().length > 0
                ? getFilteredData().map((person) => {
                    return (
                        <div key={person.id}
                            onClick={() => handleSelectCard(person)}
                            className={`px-2 py-6 flex flex-col gap-4 w-full border-b-[1px] border-gray6 ${selectedGroup === "sinEnviar" ? "cursor-pointer" : ""} ${selectedGroup === "sinEnviar" && selectedCards.some((p) => p.id === person.id) ? "bg-gray6Hover" : "hover:bg-gray6Hover"
                                }`}>
                            <div className="flex items-center gap-2 relative">
                                <p className="font-geistSans font-semibold text-base">{person.nombre}</p>
                                {selectedGroup === "sinEnviar" && selectedCards.some((p) => p.id === person.id) &&
                                    <span className="absolute -left-7 flex h-2 w-2 rounded-full bg-blue-600" />}
                            </div>
                            <div className="w-full flex flex-row justify-between gap-10">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col">
                                        <span className="font-geistSans text-muted text-sm">{person.direccion}</span>
                                        <span className="font-geistSans text-muted text-sm">{person.telefono}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full">
                                        {person.desuscrito !== 0 &&
                                            <div className="opacity-80 inline-flex items-center rounded-md px-3 py-1 text-xs font-geistSans font-medium bg-warning text-lihgt">
                                                Desuscrito
                                            </div>}
                                        {person.estado &&
                                            <div className="inline-flex items-center rounded-md px-3 py-1 text-xs font-geistSans font-medium bg-gray5 text-lihgt">
                                                {person.estado}
                                            </div>}
                                    </div>
                                </div>
                                {person.email.length > 0 &&
                                    <div className="flex flex-row gap-4">
                                        {person.email.map((email, index) => (
                                            <div key={index} className="font-geistSans font-semibold text-base">
                                                {email}
                                            </div>
                                        ))}
                                    </div>}
                            </div>
                        </div>
                    )
                })
                : null}
            {/* telon */}
            <div className={`absolute top-0 left-0 w-full h-full ${isSend ? "opacity-100 bg-black/70 pointer-events-auto" : "bg-transparent opacity-0 pointer-events-none"} pointer-events-none transition-all duration-150`} />
        </div>
    )
}