import { useEffect, useState } from "react";
import { consumableReportFields } from "../config/consumableReportFields";
import { generateConsumableReport } from "../services/generateConsumableReport";
import { Button, Input, Select, Checkbox } from "@/shared";

export default function ReportConfigModal({ isOpen, onClose }) {
  const [format, setFormat] = useState("pdf");
  const [scope, setScope] = useState("all");
  const [senaPlate, setSenaPlate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [inventoryNameId, setInventoryNameId] = useState("");
  const [inventoryNames, setInventoryNames] = useState([]);
  const [selectedFields, setSelectedFields] = useState(
    () => consumableReportFields.filter((f) => f.default)
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory-names")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((i) => ({ value: i.inventory_name_id, label: i.inventory_name }));
        setInventoryNames([{ value: "", label: "Selecciona un nombre de inventario" }, ...options]);
      })
      .catch((err) => console.error("Error cargando nombres de inventario:", err));
  }, []);

  if (!isOpen) return null;

  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((f) => f.key === field.key);
    if (exists) {
      setSelectedFields(selectedFields.filter((f) => f.key !== field.key));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleGenerateReport = async () => {
    await generateConsumableReport({ format, selectedFields, scope, senaPlate, filterStatus, inventoryNameId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: "rgba(0,0,0,0.5)" }}
         onClick={onClose}>
      <div className="bg-white rounded-2xl flex flex-col gap-6"
           style={{ padding: "36px", width: "520px", maxHeight: "90vh", overflowY: "auto" }}
           onClick={(e) => e.stopPropagation()}>
        
        <h2 className="text-lg font-bold text-gray-900">Generar reporte de materiales consumibles</h2>
        <p className="text-sm text-gray-500">Configura los parámetros del reporte</p>

        <Select
          label="Formato del reporte"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[{ label: "PDF", value: "pdf" }, { label: "Excel", value: "excel" }]}
        />

        <div>
          <p className="text-xs font-bold text-gray-700 uppercase">Campos del reporte</p>
          <div className="grid grid-cols-2 gap-2">
            {consumableReportFields.map((field) => {
              const checked = selectedFields.some((f) => f.key === field.key);
              return (
                <Checkbox
                  key={field.key}
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  checked={checked}
                  onChange={() => handleFieldToggle(field)}
                />
              );
            })}
          </div>
        </div>

        <Select
          label="Alcance del reporte"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={[
            { label: "Todos los materiales", value: "all" },
            { label: "Filtrar por placa SENA", value: "senaPlate" },
            { label: "Filtrar por nombre de inventario", value: "inventoryName" },
          ]}
        />

        {scope === "senaPlate" && (
          <Input
            label="Placa SENA"
            value={senaPlate}
            onChange={(e) => setSenaPlate(e.target.value)}
            placeholder="Ingrese la placa Sena"
          />
        )}

        {scope === "inventoryName" && (
          <Select
            label="Nombre de inventario"
            value={inventoryNameId}
            onChange={(e) => setInventoryNameId(e.target.value)}
            options={inventoryNames}
          />
        )}

        <Select
          label="Filtrar por estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { label: "Todos", value: "" },
            { label: "Activo", value: "true" },
            { label: "Inactivo", value: "false" },
          ]}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleGenerateReport}>Generar reporte</Button>
        </div>
      </div>
    </div>
  );
}
