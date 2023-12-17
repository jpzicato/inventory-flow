# Microservicio de autenticación

Este microservicio se encarga de la gestión de la autenticación de usuarios y de las funciones CRUD tanto de usuarios como de roles.

## Documentación

Este microservicio utiliza Swagger para proporcionar documentación interactiva de sus endpoints.

### Acceso a la documentación Swagger

La documentación Swagger se encuentra en la siguiente ubicación:

- [Documentación Swagger](http://localhost:HOST_AUTHENTICATION_PORT/docs)

Asegúrate de reemplazar `HOST_AUTHENTICATION_PORT` por el valor real de la variable de entorno utilizada por el microservicio de autenticación.

## Tecnologías utilizadas

Este microservicio hace uso de las siguientes tecnologías:

- **babel:** Transpilador de JavaScript para permitir el uso de características modernas de JavaScript.
- **bcryptjs:** Biblioteca para el hashing de contraseñas.
- **dotenv:** Carga de variables de entorno desde un archivo .env.
- **express:** Framework web para Node.js.
- **joi:** Validación de datos para los controllers.
- **jsonwebtoken:** Generación de tokens JWT para la autenticación.
- **mongoose:** ODM (Object Data Modeling) para trabajar con MongoDB.
- **mysql2:** Biblioteca MySQL para sequelize.
- **redis:** Sistema de almacenamiento en caché para mejorar el rendimiento de las consultas.
- **sequelize:** ORM para trabajar con bases de datos SQL.
- **swagger:** Documentación interactiva que facilita la comprensión y prueba de los endpoints del microservicio.
- **winston:** Biblioteca de registro de logs.

## Credenciales por Defecto

El microservicio de autenticación incluye dos credenciales por defecto.

### Cuentas de Usuario

El microservicio incluye las siguientes cuentas de usuario por defecto:

- **Administrador**

  - Nombre de usuario: administrator
  - Correo electrónico: administrator@email.com
  - Contraseña: Password1
  - Rol: administrator (ID: 1)

- **Lector**

  - Nombre de usuario: reader
  - Correo electrónico: reader@email.com
  - Contraseña: Password2
  - Rol: reader (ID: 2)

## Roles de Usuario por Defecto

El microservicio de autenticación incluye tres roles de usuario por defecto.

### Roles Disponibles

El microservicio incluye los siguientes roles de usuario por defecto:

- **Administrador**

  - ID de rol: 1
  - Nombre de rol: administrator
  - Permisos: Todas las rutas **GET**, **POST**, **PUT** y **DELETE** de los tres microservicios

- **Lector**

  - ID de rol: 2
  - Nombre de rol: reader
  - Permisos: Todas las rutas **GET** de los tres microservicios

- **Cliente**

  - ID de rol: 3
  - Nombre de rol: customer
  - Permisos:
    - En el microservicio de autenticación, este rol tiene permisos para las rutas **GET**, **PUT** y **DELETE** que hacen uso del `user_id` correspondiente al del usuario autenticado
    - En el microservicio de productos, este rol tiene permisos para todas la rutas **GET**
    - En el microservicio de pedidos, este rol tiene permisos para todas la rutas **GET**, **POST** y **PUT** que hacen uso del `user_id` correspondiente al del usuario autenticado y del `order_id` correspondiente a un pedido creado por el usuario autenticado

**Nota importante:** Todos los roles de usuario tienen permisos para las rutas /authentication del microservicio de autenticación.
