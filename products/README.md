# Microservicio de productos

Este microservicio se encarga de la gestión de productos, incluyendo la creación, lectura, actualización y eliminación de productos, así como la gestión de categorías.

## Documentación

Este microservicio utiliza Swagger para proporcionar documentación interactiva de sus endpoints.

### Acceso a la documentación Swagger

La documentación Swagger se encuentra en la siguiente ubicación:

- [Documentación Swagger](http://localhost:HOST_PRODUCTS_PORT/docs)

Asegúrate de reemplazar `HOST_PRODUCTS_PORT` por el valor real de la variable de entorno utilizada por el microservicio de productos.

## Tecnologías utilizadas

Este microservicio hace uso de las siguientes tecnologías:

- **axios:** Cliente HTTP para realizar solicitudes a otros microservicios.
- **babel:** Transpilador de JavaScript para permitir el uso de características modernas de JavaScript.
- **dotenv:** Carga de variables de entorno desde un archivo .env.
- **express:** Framework web para Node.js.
- **joi:** Validación de datos para los controllers.
- **mongoose:** ODM (Object Data Modeling) para trabajar con MongoDB.
- **redis:** Sistema de almacenamiento en caché para mejorar el rendimiento de las consultas.
- **swagger:** Documentación interactiva que facilita la comprensión y prueba de los endpoints del microservicio.
- **winston:** Biblioteca de registro de logs.
