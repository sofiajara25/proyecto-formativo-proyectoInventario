import { useState } from "react";
import { FileText } from "lucide-react";

const API_ORIGIN = "http://localhost:5000";
const toAbsoluteUrl = (item) => `${API_ORIGIN}/${item.replace(/^\/+/, "")}`;
const isPdf = (path) => /\.pdf$/i.test(path);
const isImage = (path) => /\.(png|jpe?g|webp|gif)$/i.test(path);
const getFileLabel = (path) => path.split("/").pop();

// Muestra un archivo adjunto (ej. ficha técnica) como una miniatura
// clicable. Al hacer click se abre en grande: PDFs se ven embebidos con
// <iframe>, imágenes con <img>, y cualquier otro tipo cae a un enlace para
// abrir/descargar en una pestaña nueva.
export default function FileViewer({ file, label = "Archivo", size = 96 }) {
  const [open, setOpen] = useState(false);

  if (!file) return null;

  const url = toAbsoluteUrl(file);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border rounded overflow-hidden cursor-zoom-in flex flex-col items-center justify-center bg-gray-100 text-[10px] px-1"
        style={{ width: size, height: size }}
      >
        {isImage(file) ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <FileText size={22} className="text-gray-500" />
            <span className="font-semibold mt-1">{isPdf(file) ? "PDF" : "Archivo"}</span>
            <span className="truncate w-full text-center">{getFileLabel(file)}</span>
          </>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div
            className="bg-white rounded w-full h-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-sm font-medium truncate">{getFileLabel(file)}</span>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm underline shrink-0 ml-2"
              >
                Abrir en pestaña nueva
              </a>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50">
              {isPdf(file) ? (
                <iframe src={url} title={label} className="w-full h-full" />
              ) : isImage(file) ? (
                <img src={url} alt={label} className="max-w-full max-h-full object-contain" />
              ) : (
                <p className="text-sm text-gray-600 p-6 text-center">
                  Este tipo de archivo no se puede previsualizar.{" "}
                  <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    Descargarlo
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
