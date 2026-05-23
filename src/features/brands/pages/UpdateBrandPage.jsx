import { useParams } from "react-router-dom";
import BrandUpdateForm from "../components/BrandUpdateForm"

export default function UpdateBrandPage() {

    const { id } = useParams();
    return (
        <div>
            <BrandUpdateForm brandId={id}/>
        </div>
    )
}