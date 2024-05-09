# Práctica 13 - DSIkea: API REST con Node/Express

- **Grupo H**
  - Francisco Felipe Martín Vide
  - Emilio González Díaz
  - Laura Álvarez Zamora
- Desarrollo de Sistemas Informáticos
- Grado en Ingeniería Informática
- Universidad de La Laguna
- **Ejecución del programa:**
  - sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
  - npm run build
  - npm run dev

<p align="center">
    <a href='https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph?branch=main'>
        <img src='https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph/badge.svg?branch=main' alt='Coverage Status'/>
    </a>
    <a href = "https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph/actions/workflows/node.js.yml">
        <img alt="Github" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href = "https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph">
        <img alt = "Quality gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph&metric=alert_status">
    </a>
</p>

## Introducción y objetivos

En esta segunda práctica grupal, se nos ha pedido desarrollar un **API REST** haciendo uso de NodeJS y Express para poder llevar a cabo la correcta gestión de una tienda de muebles. Ésta aplicación deberá poder llevar a cabo operaciones de creación, lectura, modificación y borrado de tanto clientes, proveedores, muebles y transacciones.

Para poder llevar a cabo este proyecto, también será necesario que nos familiaricemos con las plataformas `MongoDB Atlas` para alojar la base de datos en la nube, y `Render`, para poder implementar la API en un entorno cloud.

Además, tendremos que seguir la meotodlogía `TDD` (**Test Driven Development**), lo que significa que también deberemos llevar a cabo un conjunto de pruebas unitarias para las diferentes funcionalidades del programa. 
Por último, también haremos uso de **Typedoc** para generar la documentación de nuestros métodos de forma "automática", además de otras herramientas como `c8` y `coveralls`, para llevar a cabo el cubrimiento de nuestro código y la visualización del mismo, y `Sonar Cloud` para comprobar la calidad y seguridad del código fuente desarrollado.

El enunciado de proyecto en el que se explican todos los requisitos que debe cumplir, lo podemos encontrar [aquí](https://ull-esit-inf-dsi-2324.github.io/prct13-DSIkea-api/).

## Desarrollo

## Conclusiones

El desarrollo de este proyecto nos ha servido para poner en práctica los conocimientos adquiridos hasta ahora en la asignatura, mayoritariamente los de la segunda parte. Hemos aprendido a usar diferentes herramientas como el Framework Express, para implementar la API REST, así como MongoDB y Mongoose para trabajar con la base de datos y modelarlos de forma sencilla. También, a través de los servicios MongoDB Atlas y Render, hemos conseguido llevar a cabo el despliegue de nuestra primera apliación, adquiriendo así algo de experiencia en la gestión y puesta en marcha de aplicaciones en entornos de producción "real".

Por último, nos gustaría agradecer al profesor por el esfuerzo puesto en la creación de los apuntes, pues la claridad y el detalle con que están redactados, facilitaron significativamente nuestro aprendizaje.

## Bibliografía

- [ChatGPT](https://chat.openai.com/)
- [Promise.all](https://www.freecodecamp.org/espanol/news/todo-lo-que-necesitas-saber-sobre-promise-all/)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Render](https://render.com/)
- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)