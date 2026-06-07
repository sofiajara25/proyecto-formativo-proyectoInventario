import { Outlet } from "react-router-dom"

import {CreateUserPage } from "@/features/users";

export default function MainLayout(){
    return(
        <div className="relative min-h-screen text-text-primary ">

        {/* <div
             className="absolute inset-0 -z-10 bg-cover bg-center"
             style = {{backgroundImage: `url(${heroBg})`}}
             /> */}

             <CreateUserPage/>
             
             </div>
    );
}