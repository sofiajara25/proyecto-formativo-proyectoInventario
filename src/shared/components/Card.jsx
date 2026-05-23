import { Link } from "react-router-dom";

export default function Card({ product }) {

    const { title, logo: Logo, path } = product;

    return (
        <Link to={path}>

            <div
                className="
            flex flex-col justify-center items-center
                w-70
                h-70
                text-text-inverse
                bg-white
                backdrop-blur-[2px]
                shadow-lg
                rounded-2xl
                overflow-hidden
                hover:shadow-black
                transition-shadow duration-700
            "
            >

                <div
                    className="p-5 space-y-3 flex flex-col justify-center items-center"
                >
                    {/* Título de la card */}
                    <h2 className="text-h2 font-heading place-self-center text-black">
                        {title}
                    </h2>

                    {/* Renderiza el componente solo si existe */}
                    {Logo && (
                        <div>
                            <Logo size={40} color="black" /> {/* aquí sí se renderiza */}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}