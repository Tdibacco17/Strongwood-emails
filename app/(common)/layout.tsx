export default function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full grid grid-cols-1 h-svh min-h-svh">
            {children}
        </div>
    );
}
