import { useEffect, useState } from "react";
import { Navbar } from "@/shared";
import AccessSidebar from "../components/AccessSiderbar";
import PermissionModule from "../components/PermissionModule";
import { updateGroupPermissions } from "../services/groupService";
import { getAllPermissions, updateUserPermissions } from "../services/permissionService";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [permissionsDraft, setPermissionsDraft] = useState([]);
  const [entityType, setEntityType] = useState("group"); // "group" o "user"
  const [selectedUser, setSelectedUser] = useState("");


  useEffect(() => {
    setPermissionsDraft(groupPermissions);
  }, [groupPermissions, selectedUser]);

  useEffect(() => {
    getAllPermissions().then(setAllPermissions).catch(console.error);
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setPermissionsDraft(groupPermissions);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const permissionIds = permissionsDraft.map((p) => p.permission_id);

    if (entityType === "group") {
      await updateGroupPermissions(selectedGroup, permissionIds);
    } else if (entityType === "user") {
      await updateUserPermissions(selectedUser, permissionIds);
    }

    setGroupPermissions(permissionsDraft);
    setIsEditing(false);
  };


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 flex-1 p-3 sm:p-6">

        {/* Sidebar — ancho completo en móvil, fijo en desktop */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 w-full lg:w-[320px] xl:w-[350px] lg:shrink-0">
          <AccessSidebar
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            groupPermissions={groupPermissions}
            setGroupPermissions={setGroupPermissions}
            setSelectedGroupName={setSelectedGroupName}
            setEntityType={setEntityType}   // 🔹 nuevo
            setSelectedUser={setSelectedUser} // 🔹 nuevo
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            Gestión de permisos
          </h1>

          <PermissionModule
            selectedGroupName={selectedGroupName}
            allPermissions={allPermissions}
            isEditing={isEditing}
            permissionsDraft={permissionsDraft}
            setPermissionsDraft={setPermissionsDraft}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            entityType={entityType} // 🔹 nuevo
          />
        </div>

      </div>
    </div>
  );
}