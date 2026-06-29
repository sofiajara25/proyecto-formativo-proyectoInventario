import { Navbar } from "@/shared";

export default function PageLayout({ title, children }) {
    return (
        <div
            className="h-screen flex flex-col overflow-auto"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-4 py-4 gap-4 sm:px-6 sm:py-6 md:px-8 md:py-7 lg:px-10 lg:py-8">
                {title && (
                    <h1
                        style={{
                            color: "var(--color-white)",
                            fontSize: "var(--fs-md)",
                            fontWeight: "var(--font-weight-bold)",
                            margin: 0,
                        }}
                    >
                        {title}
                    </h1>
                )}

                {children}
            </div>
        </div>
    );
}