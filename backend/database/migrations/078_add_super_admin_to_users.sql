-- database/migrations/079_add_super_admin_to_users.sql
--
-- El "Super Administrador" es una bandera aparte de los permisos
-- normales: es la única persona que puede entrar a Grupos y Permisos
-- y decidir quién tiene qué permiso. No reemplaza ni se salta el
-- sistema de permisos del resto de módulos (ahí sigue sin atajos),
-- solo controla el acceso a la pantalla de administración de permisos.
ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN NOT NULL DEFAULT false;
