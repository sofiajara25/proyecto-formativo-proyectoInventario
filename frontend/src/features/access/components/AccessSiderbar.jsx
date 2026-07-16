import { useState, useEffect } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { Select } from "@/shared";
import { createGroup, getGroups } from "../services/groupService";
import { getGroupsPermissions, getUserPermissions } from "../services/permissionService";
import { getUsers } from "../../users/services/userService";

export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setGroupPermissions,
  setSelectedGroupName,
  // onCreatePermissions,
  setEntityType,       // 🔹 nuevo
  setSelectedUser,
}) {

  const [userId, setUserId] = useState("");
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getGroups().then(setGroups).catch(console.error);
    getUsers().then(setUsers).catch(console.error); // 🔹 traer usuarios reales
  }, []);

  const userOptions = users.map((user) => ({
    value: String(user.user_id),
    label: user.user_name,
  }));

  const groupOptions = groups.map((group) => ({
    value: String(group.group_id),
    label: group.group_name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación simple
    if (!newGroupName.trim()) {
      setErrors({ newGroupName: "El nombre del grupo es obligatorio" });
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    try {
      const response = await createGroup(newGroupName);
      console.log("Grupo creado:", response);
      alert("Grupo creado correctamente");

      // 🔹 refrescar lista de grupos
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);

      // limpiar input
      setNewGroupName("");
    } catch (error) {
      console.error("Error creando grupo:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  let label;
  // 😂 lógica fuera del JSX
  if (isSubmitting) {
    label = "Creando...";
  } else {
    label = "Crear Material Devolutivo";
  }


  return (
    <aside className="w-full flex flex-col gap-6">

      {/* Card grupos */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}
        >
          Grupos usuarios
        </h2>
        <div className="w-full [&>div]:w-full [&>div>select]:w-full">
          <Select
            name="groupId"
            value={selectedGroup}
            onChange={async (e) => {
              const groupId = e.target.value;
              const selectedGroupData = groups.find(
                (group) => String(group.group_id) === groupId,
              );
              setSelectedGroup(groupId);
              setSelectedGroupName(selectedGroupData?.group_name ?? "");
              setUserId("");
              const permissions = await getGroupsPermissions(groupId);
              setGroupPermissions(permissions);
              setEntityType("group");
              setSelectedGroup(groupId);
            }}
            options={groupOptions}
          />
        </div>
      </div>

      {/* Card usuario individual */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}
        >
          Usuario individual
        </h2>
        <div className="w-full [&>div]:w-full [&>div>select]:w-full">
          {users.length > 0 && (
            <Select
              name="userId"
              value={userId}
              onChange={async (e) => {
                const id = e.target.value;
                setUserId(id);
                setSelectedGroup(""); // limpiar selección de grupo

                // 🔹 Traer permisos del usuario

                // 🔹 Traer permisos del usuario y normalizar estructura
                const permissions = await getUserPermissions(id);
                setGroupPermissions(
                  permissions.map(p => ({
                    permission_id: p.id,
                    permission_codename: p.codename,
                    permission_name: p.name,
                  }))
                );
                // 🔹 Mostrar nombre del usuario seleccionado
                setEntityType("user");
                setSelectedUser(id);
                const selectedUser = userOptions.find(u => u.value === id);
                if (selectedUser) {
                  setSelectedGroupName(`Usuario: ${selectedUser.label}`);
                }

              }}
              options={userOptions}
            />
          )}

        </div>
      </div>

      {/* Card crear permisos */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}
        >
          Crear Grupo
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            name="newGroupName"
            value={newGroupName}
            error={errors.newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Nombre del grupo"
            containerClassName="w-full"
          />
          <div className="w-full [&>button]:w-full">
            <Button
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {label}
            </Button>
          </div>
        </form>
      </div>

    </aside>
  );
}