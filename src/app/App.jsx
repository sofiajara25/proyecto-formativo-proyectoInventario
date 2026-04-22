// import { CreateUserPage } from "@/features/users";
// import { CreateMaterialPage} from '@/features/consumable-material';
// import { CreateLoansPage } from "../features/loans"
// import { CreateHomePage } from "../features/home"
// import { CreateBrandsPage } from "../features/brands"
import { CreateReturnableMaterialPage } from "../features/returnable-material"

export default function App() {

    return (
        <div className="min-h text-center grid grid-cols-1 gap-4">
            
            {/* <CreateUserPage /> */}

            {/* <CreateMaterialPage /> */}

            {/* <CreateLoansPage/> */}

            {/* <CreateHomePage/> */}

            {/* <CreateBrandsPage/> */}

            <CreateReturnableMaterialPage/>
        </div>
    )
};