const API_URL = "http://localhost:4000/api/groups";

export async function getGroupsPermissions(group_id) {
    const response = await fetch(`${API_URL}/${group_id}/permissions`);

    if(!response.ok) {
        throw new Error("Error  obteniendo grupos");
    }

    return response.json()
    
}