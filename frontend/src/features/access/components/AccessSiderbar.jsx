import { useState, useEffect } from "react";
import { Select, Switch, Button, Input } from "@/shared";
import { getGroups } from "../services/groupService";
import { getGroupsPermissions } from "../services/permissionService";


export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setGroupPermissions,
}) {
  
  // Estado de los usuarios individuales
  const [userId, setUserId] = useState("");


  // Estado de los grupos
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    getGroups().then(setGroups).catch(console.error);
  }, []);


  const groupOptions = groups.map((group) => ({
    value: String(group.group_id),
    label: group.group_name,
  }));

  useEffect(() => {
    console.log("GROUP OPTIONS", groupOptions);
  }, [groupOptions]);


  const userOptions = [
    { value: "10", label: "Sebastián Arce" },
    { value: "11", label: "Sofía Valencia" },
    { value: "12", label: "José Marín" },
  ];


  return (
    <aside className="w-[350px] space-y-12 ">
      <section>
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
      </section>


      <section>
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
      </section>
    </aside>
  );
}
