# Inventory flow

Inventory flow es una aplicación de seguimiento de inventario basada en microservicios desarrollada en Node.js con el framework Express.js. Cada microservicio se enfoca en una funcionalidad específica, incluyendo la autenticación, la gestión de productos y la gestión de pedidos.

## Microservicios individuales

Cada uno de los microservicios que componen inventory flow tiene su propio README.md que proporciona información detallada sobre su funcionalidad, configuración y uso. A continuación, se detallan los microservicios disponibles:

- autenticación
- productos
- pedidos

Asegúrate de consultar los readme.md individuales de cada microservicio para obtener información específica sobre su funcionamiento.

## Espera de Servicios

Este proyecto utiliza [wait-for-it.sh](https://github.com/vishnubob/wait-for-it) para gestionar la espera de servicios externos antes de iniciarse. El script `wait-for-it.sh`, presente en cada uno de los microservicios, asegura que los servicios necesarios estén disponibles antes de que cada microservicio comience.

## Requisitos previos

Antes de poder ejecutar inventory flow, asegúrate de tener los siguientes requisitos previos instalados en tu sistema:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Uso

Para comenzar con inventory flow, sigue estos pasos:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/jpzicato/inventory-flow.git
   ```

2. Navega al directorio inventory-flow:

   ```bash
   cd inventory-flow
   ```

3. Crea un archivo .env basado en el archivo .env.example proporcionado y completa las variables de configuración necesarias.

4. Ejecuta la aplicación utilizando Docker Compose:

   ```bash
   docker-compose up
   ```

Este comando iniciará los contenedores de MySQL, MongoDB, Redis y los microservicios.

Una vez que la aplicación esté en funcionamiento, puedes acceder a los microservicios individuales a través de sus respectivos puertos y puntos finales.

Puedes interactuar con los microservicios haciendo solicitudes HTTP a sus respectivos puntos finales. Consulta la documentación de cada microservicio para obtener instrucciones detalladas de uso.

## Autenticación

Para realizar solicitudes en los microservicios de inventory flow, la autenticación mediante un token Bearer es requerida, excepto para las siguientes rutas: `sign-up`, `log-in`, `renew-access-token` y `log-out`. Sigue estos pasos para incluir tu token de autenticación en las solicitudes:

1. Obtén un token de autenticación mediante el proceso de inicio de sesión, registro o renovación del token de acceso. Este token debe tener el formato JWT (JSON Web Token).

2. Incluye el token de autenticación en la cabecera de tus solicitudes GraphQL utilizando el esquema Bearer. Aquí hay un ejemplo utilizando la herramienta cURL:

```bash
curl --location --request GET 'http://localhost:HOST_PRODUCTS_PORT/api/products' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer tu_token_aqui'
```

Asegúrate de reemplazar `HOST_PRODUCTS_PORT` y `tu_token_aqui` con sus valores reales.

## Detalles Adicionales

### Duración del Token

Los tokens de autenticación emitidos tienen una duración limitada. Esto se realiza mediante la variable de entorno `ACCESS_TOKEN_EXPIRATION`.

### Renovación de Token

Para mantener la sesión activa, puedes renovar tu token antes de que expire. Utiliza la operación `renew-access-token`, del microservicio de autenticación, para obtener un nuevo token.
