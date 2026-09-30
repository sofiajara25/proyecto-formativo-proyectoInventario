import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import Select from "./Select";
import Modal from "./Modal";
import Input from "./Input";
import { showAlert } from "../utils/alertBus";

// Select de una llave foránea (ej. Marca, Nombre de inventario) con un botón
// "+" al lado para crear una opción nueva sin salir del formulario. Al
// guardar, la opción nueva se agrega a la lista y queda seleccionada.
//
// - createOption(data): llama al backend y devuelve { value, label } de la
//   opción creada. "data" es lo que devolvió schema.safeParse.
// - onOptionCreated(option): el formulario agrega la opción a su lista.
// - schema + fieldKey: el mismo schema de Zod del CRUD de esa entidad
//   (ej. brandSchema con "marca"), para validar igual que su formulario.
// - canCreate: si el usuario no tiene el permiso de crear, no se muestra
//   el botón "+" (el backend igual lo rechazaría con 403).
export default function QuickCreateSelect({
    createOption,
    onOptionCreated,
    schema,
    fieldKey,
    canCreate = true,
    createTitle = "Crear nuevo",
    createLabel = "Nombre",
    createPlaceholder = "",
    ...selectProps
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const close = () => {
        if (isSaving) return;
        setIsOpen(false);
        setText("");
        setFieldError("");
    };

    const handleCreate = async () => {
        if (isSaving) return;

        const result = schema.safeParse({ [fieldKey]: text.trim() });
        if (!result.success) {
            setFieldError(result.error.issues[0]?.message ?? "Valor inválido");
            return;
        }

        setIsSaving(true);
        try {
            const option = await createOption(result.data);
            onOptionCreated?.(option);
            // Se selecciona la opción recién creada, con el mismo formato
            // de evento que usa Select ({ target: { name, value } }).
            selectProps.onChange?.({
                target: { name: selectProps.name, value: String(option.value) },
            });
            showAlert(`"${option.label}" creado correctamente`, { type: "success" });
            setIsOpen(false);
            setText("");
            setFieldError("");
        } catch (error) {
            setFieldError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const addButton = canCreate ? (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            title={createTitle}
            aria-label={createTitle}
            className="h-12 w-12 shrink-0 rounded-md border border-border bg-white text-text-primary flex items-center justify-center hover:border-focus-border hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-focus-ring"
        >
            <Plus size={18} />
        </button>
    ) : null;

    return (
        <>
            <Select {...selectProps} action={addButton} />

            {/* El modal se monta en <body> (portal) y no dentro del <form>
                del material: así, presionar Enter o un botón del modal no
                envía el formulario principal por accidente. */}
            {createPortal(
                <Modal
                    isOpen={isOpen}
                    title={createTitle}
                    onClose={close}
                    onConfirm={handleCreate}
                    confirmText={isSaving ? "Creando..." : "Crear"}
                    cancelText="Cancelar"
                >
                    <Input
                        label={createLabel}
                        value={text}
                        placeholder={createPlaceholder}
                        onChange={(e) => {
                            setText(e.target.value);
                            setFieldError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreate();
                            }
                        }}
                        error={fieldError}
                        autoFocus
                    />
                </Modal>,
                document.body
            )}
        </>
    );
}
