// import { useNavigate } from "react-router-dom";
import { Navbar, Card } from "@/shared";
import { lists } from "./data/lists";

export default function CreateHomePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <Navbar />
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2   /* desde pantallas pequeñas ya se ven 2 en 2 */
          gap-8
          mt-40
          sm:mx-24
          lg:mx-160
          md:mx-48px
          justify-items-center
          p-0
          m-0
        "
      >
        {lists.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
