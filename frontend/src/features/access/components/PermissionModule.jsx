import { Checkbox, Select, Switch, Button, Input } from "@/shared";

export default function PermissionModule({ groupPermissions }) {
  const hasPermission = (codename) =>
    groupPermissions.some(
      (permission) => permission.permission_codename === codename,
    );

  return (
    <div className="space-y-6 
                style={{
                    background:
                        linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))
                }}">
      {/* Material devolutivo */}
      <section className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Material devolutivo</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            id="create_returnable_material"
            name="create_returnable_material"
            label="Crear material devolutivos"
            checked={hasPermission("create_returnable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="list_returnable_material"
            name="list_returnable_material"
            label="Listar material devolutivos"
            checked={hasPermission("list_returnable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="report_returnable_material"
            name="report_returnable_material"
            label="Reportar material devolutivos"
            checked={hasPermission("report_returnable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="view_returnable_material"
            name="view_returnable_material"
            label="Visualizar material devolutivos"
            checked={hasPermission("view_returnable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="modify_returnable_material"
            name="modify_returnable_material"
            label="Modificar material devolutivo"
            checked={hasPermission("modify_returnable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="state_returnable_material"
            name="state_returnable_material"
            label="Habilitar/Deshabilitar material devolutivos"
            checked={hasPermission("state_returnable_material")}
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Material de consumo */}
      <section className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Material de consumo</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            id="create_consumable_material"
            name="create_consumable_material"
            label="Crear material de consumo"
            checked={hasPermission("create_consumable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="list_consumable_material"
            name="list_consumable_material"
            label="Listar material de consumo"
            checked={hasPermission("list_consumable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="report_consumable_material"
            name="report_consumable_material"
            label="Reportar material de consumo"
            checked={hasPermission("report_consumable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="view_consumable_material"
            name="view_consumable_material"
            label="Visualizar material de consumo"
            checked={hasPermission("view_consumable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="modify_consumable_material"
            name="modify_consumable_material"
            label="Modificar material de consumo"
            checked={hasPermission("modify_consumable_material")}
            onChange={() => {}}
          />
          <Checkbox
            id="state_consumable_material"
            name="state_consumable_material"
            label="Habilitar/Deshabilitar material de consumo"
            checked={hasPermission("state_consumable_material")}
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Préstamos */}
      <section className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Préstamos</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            id="create_loan"
            name="create_loan"
            label="Crear prestamos"
            checked={hasPermission("create_loan")}
            onChange={() => {}}
          />
          <Checkbox
            id="list_loan"
            name="list_loan"
            label="Listar prestamos"
            checked={hasPermission("list_loan")}
            onChange={() => {}}
          />
          <Checkbox
            id="report_loan"
            name="report_loan"
            label="Reportar prestamos"
            checked={hasPermission("report_loan")}
            onChange={() => {}}
          />
          <Checkbox
            id="view_loan"
            name="view_loan"
            label="Visualizar prestamos"
            checked={hasPermission("view_loan")}
            onChange={() => {}}
          />
          <Checkbox
            id="modify_loan"
            name="modify_loan"
            label="Modificar prestamos"
            checked={hasPermission("modify_loan")}
            onChange={() => {}}
          />
          <Checkbox
            id="state_loan"
            name="state_loan"
            label="Habilitar/Deshabilitar prestamos"
            checked={hasPermission("state_loan")}
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Retornos */}
      <section className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Retornos</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            id="create_return"
            name="create_return"
            label="Crear retornos"
            checked={hasPermission("create_return")}
            onChange={() => {}}
          />
          <Checkbox
            id="list_return"
            name="list_return"
            label="Listar retornos"
            checked={hasPermission("list_return")}
            onChange={() => {}}
          />
          <Checkbox
            id="report_return"
            name="report_return"
            label="Reportar retornos"
            checked={hasPermission("report_return")}
            onChange={() => {}}
          />
          <Checkbox
            id="view_return"
            name="view_return"
            label="Visualizar retornos"
            checked={hasPermission("view_return")}
            onChange={() => {}}
          />
          <Checkbox
            id="modify_return"
            name="modify_return"
            label="Modificar retornos"
            checked={hasPermission("modify_return")}
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Marca */}
      <section className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Marca</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            id="create_brand"
            name="create_brand"
            label="Crear marca"
            checked={hasPermission("create_brand")}
            onChange={() => {}}
          />
          <Checkbox
            id="list_brand"
            name="list_brand"
            label="Listar marca"
            checked={hasPermission("list_brand")}
            onChange={() => {}}
          />
          <Checkbox
            id="report_brand"
            name="report_brand"
            label="Reportar marca"
            checked={hasPermission("report_brand")}
            onChange={() => {}}
          />
          <Checkbox
            id="view_brand"
            name="view_brand"
            label="Visualizar marca"
            checked={hasPermission("view_brand")}
            onChange={() => {}}
          />
          <Checkbox
            id="modify_brand"
            name="modify_brand"
            label="Modificar marca"
            checked={hasPermission("modify_brand")}
            onChange={() => {}}
          />
          <Checkbox
            id="state_brand"
            name="state_brand"
            label="Habilitar/Deshabilitar marca"
            checked={hasPermission("state_brand")}
            onChange={() => {}}
          />
        </div>
      </section>
    </div>
  );
}
