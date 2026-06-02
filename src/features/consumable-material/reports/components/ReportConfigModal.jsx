import { useState } from "react";
import { consumableReportFields } from "../config/consumableReportFields";
import { generateConsumableReport } from "../services/generateConsumableReport";
import { Button, Input, Select, Checkbox } from "@/shared";

export default function ReportConfigModal({ isOpen, onClose }) {

    const [format, setFormat] = useState("pdf");

    const [scope, setScope] = useState("all");

    const [senaPlate, setSenaPlate] = useState("");

    const [selectedFields, setSelectedFields] = useState(
        () => consumableReportFields.filter((f) => f.default),
    );

    if (!isOpen) return null;

    const handleFieldToggle = (field) => {
        const exists = selectedFields.find((f) => f.key === field.key);
        if (exists) {
            setSelectedFields(selectedFields.filter((f) => f.key !== field.key));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleGenerateReport = () => {
        generateConsumableReport({ format, selectedFields, scope, senaPlate });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl flex flex-col gap-6"
                style={{ padding: "36px", width: "520px", maxHeight: "90vh", overflowY: "auto", fontFamily: "var(--main-font)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h2 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-gray-900)", margin: 0 }}>
                        Generar reporte de materiales consumibles
                    </h2>
                    <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-gray-500)", margin: 0 }}>
                        Configura los parámetros del reporte
                    </p>
                </div>

                {/* Formato */}
                <Select
                    label="Formato del reporte"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    options={[
                        { label: "PDF", value: "pdf" },
                        { label: "Excel", value: "excel" },
                    ]}
                />

                {/* Campos */}
                <div className="flex flex-col gap-3">
                    <p style={{ fontSize: "var(--fs-xxxs)", fontWeight: "var(--font-weight-bold)", color: "var(--color-gray-700)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                        Campos del reporte
                    </p>
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


                {/* Alcance */}
                <div className="mb-4">
                    <Select
                        label="Alcance del reporte"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        options={[
                            { label: "Todos los materiales", value: "all" },
                            { label: "Filtrar por placa SENA", value: "senaPlate" },
                        ]}
                    />
                </div>

                {/* Campo condicional para filtro por placa SENA */}
                {scope === "senaPlate" && (
                    <div className="mb-4">
                        <Input
                            label="Placa SENA"
                            value={senaPlate}
                            onChange={(e) => setSenaPlate(e.target.value)}
                            placeholder="Ingrese la placa Sena"
                        />
                    </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleGenerateReport}
                    >
                        Generar reporte
                    </Button>
                </div>

            </div>
        </div>
    );
}