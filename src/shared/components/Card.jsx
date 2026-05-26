export default function Card({ product }) {

    const { title, logo } = product;

    return (
        <div
            className="
                w-full
                text-text-inverse
                dark:bg-neutral-950/80
                backdrop-blur-[2px]
                shadow-lg
                rounded-2xl
                overflow-hidden
                hover:shadow-black
                transition-shadow duration-700
            "
        >

            <div
                className="p-5 space-y-3 "
            >
                {/* Título de la card */}
                <h2 className="text-h2 font-heading place-self-center">
                    {title}
                </h2>

                <div >
                    {logo}
                </div>
                
            </div>
        </div>
    )
}