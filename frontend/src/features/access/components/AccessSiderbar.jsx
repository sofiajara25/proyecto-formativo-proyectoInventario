import { useState, useEffect } from "react";
import { Select, Button, Input } from "@/shared";
import { createGroup, getGroups } from "../services/groupService";
import { getGroupsPermissions } from "../services/permissionService";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setGroupPermissions,
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getGroups().then(setGroups).catch(console.error);
  }, []);

  const groupOptions = groups.map((group) => ({
    value: String(group.group_id),
    label: group.group_name,
  }));

  const userOptions = [
    { value: "10", label: "Sebastian Arce" },
    { value: "11", label: "Sofia Valencia" },
    { value: "12", label: "Jose Marin" },
  ];

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { groupId: selectedGroup };
      const response = await fetch("http://localhost:5000/api/access/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar grupo");
      const data = await response.json();
      console.log("Grupo actualizado:", data);
      alert("Grupo actualizado correctamente");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { userId };
      const response = await fetch("http://localhost:5000/api/access/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar usuario");
      const data = await response.json();
      console.log("Usuario actualizado:", data);
      alert("Usuario actualizado correctamente");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await createGroup({ groupName });
      const updatedGroups = await getGroups();

      setGroups(updatedGroups);
      setGroupName("");

      console.log("Grupo creado:", data);
      alert("Grupo creado correctamente");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="w-[350px] space-y-12">
      <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
        >
          <CircleArrowLeft size={36} color="#ffffff" />
        </button>

      <form
        className="bg-white text-black w-[360px] h-[200px] flex flex-col items-center justify-center rounded-2xl mt-[160px]"
        onSubmit={handleSubmitGroup}
      >
        
        <h2 className="text-lg font-semibold mb-6">Grupos usuarios</h2>
        

        <Select
          name="groupId"
          value={selectedGroup}
          onChange={async (e) => {
            const groupId = e.target.value;

            setSelectedGroup(groupId);
            setUserId("");

            const permissions = await getGroupsPermissions(groupId);
            setGroupPermissions(permissions);

            console.log("PERMISOS DEL GRUPO:", permissions);
          }}
          options={groupOptions}
        />

        <div className="flex justify-center gap-3 pt-2 w-full">
          <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>

      <form
        className="bg-white text-black w-[360px] h-[200px] flex flex-col items-center justify-center rounded-2xl"
        onSubmit={handleSubmitUser}
      >
        <h2 className="text-lg font-semibold mb-6">Usuario individual</h2>

        <Select
          name="userId"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setSelectedGroup("");
          }}
          options={userOptions}
        />

        <div className="flex justify-center gap-3 pt-2 w-full">
          <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>

      <form
        className="bg-white text-black w-[360px] h-[200px] flex flex-col items-center justify-center rounded-2xl"
        onSubmit={handleCreateGroup}
      >
        <h2 className="text-lg font-semibold mb-6">Crear Grupo</h2>

        <Input
          name="groupName"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setSelectedGroup("");
          }}
        />

        <div className="flex justify-center gap-3 pt-2 w-full">
          <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear grupo"}
          </Button>
        </div>
      </form>
    </aside>
  );
}
