import { useState } from "react";
import AccessSiderbar from "../components/AccessSiderbar";
import PermissionModule from "../components/PermissionModule";
import { CircleArrowLeft } from "lucide-react";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);

  return (
    <div
      className="p-6 flex gap-10"
      style={{
        background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)",
      }}
    >
      
      <AccessSiderbar
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groupPermissions={groupPermissions}
        setGroupPermissions={setGroupPermissions}
      />
      

      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-6 text-white">Gestión de permisos</h1>

        <PermissionModule
          selectedGroup={selectedGroup}
          groupPermissions={groupPermissions}
        />
      </div>
    </div>
  );
}