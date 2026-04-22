import { CreateUserPage } from "@/features/users";
// import { CreateMaterialPage} from '@/features/consumable-material';

export default function App() {

    return (
        <div className="min-h text-center grid grid-cols-1 gap-4">
            
            <CreateUserPage />

            {/* <CreateMaterialPage /> */}

        </div>
    )
};