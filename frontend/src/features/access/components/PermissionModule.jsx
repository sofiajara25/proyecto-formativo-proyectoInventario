import { Checkbox, Button, IconButton } from "@/shared";
import { Pencil } from "lucide-react";

export default function PermissionModule({
  selectedGroupName,
  allPermissions,
  isEditing,
  permissionsDraft,
  setPermissionsDraft,
  onEdit,
  onCancel,
  onSave,
  entityType = "group", // 🔹 nuevo: "group" o "user"
}) {
  const hasPermission = (codename) =>
    permissionsDraft.some(
      (permission) => permission.permission_codename === codename
    );

  const handlePermissionChange = (permission, checked) => {
    if (!checked) {
      setPermissionsDraft((prev) =>
        prev.filter((item) => item.permission_id !== permission.permission_id)
      );
      return;
    }
    setPermissionsDraft((prev) => [...prev, permission]);
  };

  return (
    <section className="border rounded-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <p className="text-xs sm:text-sm text-neutral-500">
            {entityType === "group" ? "Grupo" : "Usuario"}
          </p>
          <h2 className="text-base sm:text-lg font-semibold">
            {selectedGroupName || "Seleccione un grupo o usuario"}
          </h2>
        </div>

        {!isEditing && selectedGroupName && (
          <IconButton ariaLabel="Editar permisos" onClick={onEdit}>
            <Pencil size={18} />
          </IconButton>
        )}
      </div>

      {/* Permisos */}
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b-2 pb-4 sm:pb-6">
          <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">
            Módulo Usuarios
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4">
            {allPermissions.map((permission) => (
              <Checkbox
                key={permission.permission_id}
                id={permission.permission_codename}
                name={permission.permission_codename}
                label={permission.permission_name}
                checked={hasPermission(permission.permission_codename)}
                disabled={!isEditing}
                onChange={(e) =>
                  handlePermissionChange(permission, e.target.checked)
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Acciones */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={onSave}>
            Guardar
          </Button>
        </div>
      )}
    </section>
  );
}
