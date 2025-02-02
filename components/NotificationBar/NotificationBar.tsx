import { DataInterface, ProgressNotificationInterface } from "@/types/SheetTypes";
import { SpinIcon } from "../Icons/Icons";
import { useEffect, useRef } from "react";

export default function NotificationBar({
    isSend,
    progress,
    handleSendEmails,
    loading,
    selectedCards
}: {
    isSend: boolean,
    progress: ProgressNotificationInterface[],
    handleSendEmails: () => void,
    loading: boolean,
    selectedCards: DataInterface[]
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [progress]);

    return (
        <div className={`fixed z-30 top-28 ${isSend ? "right-0 w-2/6 " : "-right-1/2 w-0"} transition-all duration-300 bg-dark h-[calc(100vh-112px)] max-h-[calc(100vh-112px)] border-l-[1px] border-l-gray6 flex flex-col justify-between overflow-hidden`}>
            <div className="h-full max-h-full overflow-hidden">
                <div className="overflow-y-auto h-full max-h-[calc(100vh-112px)] pb-6 flex flex-col gap-3">
                    <div className="w-full px-6 sticky top-0 left-0 bg-dark pt-6">
                        <p className="font-geistSans text-sm border-b-[1px] border-b-gray6 pb-3">Estado de envio</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        {progress.map((message, index) => (
                            <div key={index} className="px-6 ">
                                <div className={`whitespace-normal break-words font-geistSans text-sm py-2 rounded-md ${message.type === "success"
                                    ? "text-green-600"
                                    : message.type === "error"
                                        ? "text-warning"
                                        : "text-muted"
                                    }`}>

                                    {message.type !== 'final' && <div className="flex gap-2">
                                        <div className="rounded-full bg-gray3 min-h-2 min-w-2 h-2 w-2 mt-1.5" />
                                        <p>
                                            {message.title.split(/(b:.*?:b)/g).map((part, i) =>
                                                part.startsWith("b:") && part.endsWith(":b") ? (
                                                    <span className="font-bold text-cotton"
                                                        key={i}>
                                                        {part.slice(2, -2)}
                                                    </span>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </p>
                                    </div>}
                                    {message.subtitle && (
                                        <div className="pt-1.5 flex items-center gap-2 my-8">
                                            <p className="text-sm text-muted w-full pb-3 border-b-[1px] border-b-gray6">{`${message.subtitle}`}</p>
                                        </div>
                                    )}
                                    {message.type === 'final' && <div className="pt-1.5 flex items-center gap-2 mb-8">
                                        <p className="text-sm text-green-600 w-full pb-3 border-b-[1px] border-b-gray6">{`${message.title}`}</p>
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} className="pt-14" />
                </div>
            </div>

            <div className="border-t-[1px] border-t-gray6 w-full px-6 py-6 z-40">
                <button
                    onClick={handleSendEmails}
                    disabled={loading || (selectedCards.length > 0 ? false : true)}
                    className="disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-light bg-light hover:bg-lightHover text-sm text-dark w-full font-medium font-geistSans h-10 px-3 whitespace-nowrap rounded-md flex justify-center items-center">
                    {loading ? <SpinIcon /> : 'Enviar correos'}
                </button>
            </div>
        </div>
    )
}