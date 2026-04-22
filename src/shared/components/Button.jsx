/**
 * Componente Botón
 *
 * Botón reutilizable con variantes visuales y tamaños controlados, área intectiva mínima de 48px
 */

export default function Button({
  variant = "primary", //Define el estilo visual
  size = "md", //Define tamaño visual
  type = "button", //Tipos de botón (button, submit, reset)
  children, //Contenido interno del botón(texto, ícono)
  ...props //Propiedades adicionales(onClick, disable, etc)
}) {
  const variants = {
    primary: "text-brand border text-h1 hover:bg-surface-muted hover:text-text-inverse",
    secondary:
      "bg-background border border-border text-text-primary hover:bg-surface-muted hover:text-text-inverse",
  };

  const sizes = {
    sm:`
        h-9 px-3
        before:absolute before:content['']
        before:-inset-y-[6px]  before:-inset-x-[0px]
    `,
    md:`
        h-10 px-4
        before:absolute before:content['']
        before:-inset-y-[5px]  before:-inset-x-[0px]
    `
  }

  return(

    <button 
        className= {`
            relative
            inline-flex items-center justify-center
            rounded-md
            transition-colors
            ${variants[variant]}
            ${sizes[size]}
            ${type}
            `}            
            {...props}            
            >
            {children}
    </button>
  )
}