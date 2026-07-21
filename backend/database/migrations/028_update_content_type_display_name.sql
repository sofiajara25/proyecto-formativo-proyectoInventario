-- database/migrations/update_content_type_display_name.sql
-- Correcion: nombres amigables para la interfaz

--Coreccion: nombres amigables para la interfaz

UPDATE content_type
SET display_name =
    CASE app_label 
        WHEN 'users' THEN 'Usuarios'
        WHEN 'groups' THEN 'Grupos'
        WHEN 'tasks' THEN 'Tareas'
        WHEN 'access' THEN 'Permisos'
        WHEN 'brands' THEN 'Marcas'
        WHEN 'consumable_materials' THEN 'Materiales Consumibles'
        WHEN 'loans' THEN 'Prestamos'
        WHEN 'returnable_materials' THEN 'Materiales Retornables'
        WHEN 'returns' THEN 'Retornos'

END;