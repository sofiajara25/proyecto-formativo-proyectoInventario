  import { Link } from "react-router-dom";

  export default function Card({ product }) {
    const { title, logo: Logo, path } = product;

    return (
      <Link to={path}>
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-[1.02]"
          style={{
            border: "2.5px solid transparent",
            padding: "32px 24px",
            minHeight: "240px",
            minWidth: "290px",
            transition: "border-color 0.2s, transform 0.15s",
            fontFamily: "var(--main-font)",
          }}
        >
          <div className="space-y-3 flex flex-col justify-center items-center text-center">
            {/* Título de la card */}
            <h2
              className="
                text-h2 font-heading text-black
                break-words whitespace-normal
                max-w-[220px]
              "
            >
              {title}
            </h2>

            {/* Renderiza el componente solo si existe */}
            {Logo && (
              <div className="flex items-center justify-center">
                <Logo size={40} className="text-black" />
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
