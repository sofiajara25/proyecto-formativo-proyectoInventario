/**
 * Componente Botón
 *
 * Botón reutilizable con variantes visuales y tamaños controlados, área interactiva mínima de 48px
 */

export default function Button({
  variant = "primary", // Define el estilo visual: "primary" (verde) | "secondary" (morado)
  size = "md",         // Define tamaño visual: "sm" | "md"
  type = "button",     // Tipos de botón (button, submit, reset)
  children,            // Contenido interno del botón (texto, ícono)
  ...props             // Propiedades adicionales (onClick, disabled, etc)
}) {
  const variants = {
    // Verde — color primario del proyecto
    primary: `
      text-small sm:text-medium lg:text-body
      text-white font-body rounded-lg
      transition-colors duration-150   bg-button-primary-bg hover:bg-button-primary-hover
    `,
    // Morado — color terciario del proyecto
    secondary: `
      text-small sm:text-medium lg:text-body
      text-white font-label rounded-lg
      transition-colors duration-150 bg-button-secondary-bg hover:bg-button-secondary-hover
    `,

    tertiary: `
      text-small sm:text-medium lg:text-body font-label rounded-lg 
      transition-colors duration-150 bg-button-tertiary-bg hover:bg-button-tertiary-hover gap-2
    `,
  };


  const sizes = {
    sm: `
      h-9 px-4
      before:absolute before:content-['']
      before:-inset-y-[6px] before:inset-x-0
    `,
    md: `
      h-10 px-4
      before:absolute before:content-['']
      before:-inset-y-[5px] before:inset-x-0
    `,
  };

  return (
    <button
      type={type}
      className={`
        relative
        inline-flex items-center justify-center
        rounded-lg
        transition-colors duration-150
        ${variants[variant]}
        ${sizes[size]}
      `}
      {...props}
    >
      {children}
    </button>
  );
}