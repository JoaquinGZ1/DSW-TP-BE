-- Script para configurar MySQL local para DSW-TP

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS dsw;

-- 2. Crear el usuario dsw (si no existe)
CREATE USER IF NOT EXISTS 'dsw'@'localhost' IDENTIFIED BY 'dsw';

-- 3. Otorgar todos los privilegios al usuario dsw sobre la base de datos dsw
GRANT ALL PRIVILEGES ON dsw.* TO 'dsw'@'localhost';

-- 4. Aplicar los cambios
FLUSH PRIVILEGES;

-- 5. Verificar que se creó correctamente
SELECT User, Host FROM mysql.user WHERE User='dsw';
SHOW GRANTS FOR 'dsw'@'localhost';

-- 6. Usar la base de datos
USE dsw;
