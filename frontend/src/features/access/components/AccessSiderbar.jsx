import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Button, Input, Modal } from "@/shared";
import { createGroup, getGroups } from "../services/groupService";
import { getGroupsPermissions, getUserPermissions } from "../services/permissionService";
import { getUsers } from "../../users/services/userService";
import { groupSchema } from "../schemas/groupSchema";

export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setGroupPermissions,
  setSelectedGroupName,
  // onCreatePermissions,
  setEntityType,       // 🔹 nuevo
  setSelectedUser,
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    group_name: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userId, setUserId] = useState("");
  const [groups, setGroups] = useState([]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getGroups().then(setGroups).catch(console.error);
    getUsers().then(setUsers).catch(console.error); // 🔹 traer usuarios reales
  }, []);

  const groupOptions = groups
    .filter(group => group.group_id) // descarta los que no tengan id
    .map(group => ({
      value: String(group.group_id),
      label: group.group_name,
    }));

  const userOptions = users.map((user) => ({
    value: String(user.id),
    label: user.user_name,
  }));


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const result = groupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    try {
      const payload = result.data;
      const response = await createGroup(payload); // 🔹 enviar objeto con group_name
      console.log("Grupo creado:", response);
      alert("Grupo creado correctamente");
      navigate(-1);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
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
                    permission_id: p.permission_id,
                    permission_codename: p.permission_codename,
                    permission_name: p.permission_name,
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
        <h1 className="text-sm font-semibold"
          style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}>
          Crear Grupo
        </h1>
        <div className="w-full [&>div]:w-full [&>div>select]:w-full">
          <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <input
                id="group_name"
                name="group_name"
                type="text"
                placeholder="Ej: Administradores"
                value={formData.group_name}
                onChange={handleChange}
                className={`w-full border bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.group_name ? "border-red-400" : ""}`}
              />
              {errors.group_name && <p className="text-red-500 text-xs mt-1">{errors.group_name}</p>}
            </div>
            {/* Acciones */}
            <div className="flex justify-center pt-2 w-full">
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {label}
              </Button>
            </div>
          </form>
          <Modal
            isOpen={isModalOpen}
            title="Confirmar creación de grupo"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmText="Crear"
            cancelText="Cancelar"
          >
            <p>¿Seguro que deseas crear este grupo?</p>
          </Modal>
        </div>
      </div>

    </aside>
  );
}