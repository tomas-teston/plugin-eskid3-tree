# Plugin ESKID3 - Example Bars

> Visualización de tipo árbol para un plugin en Kibana.

---

## Introducción

Este proyecto es un ejemplo de plugin de visualización de barras para Kibana utilizando [D3.js](https://d3js.org/) como librera de visualización. Todo este proceso sigue el procedimiento descrito en en el proyecto [plugin-eskid3](https://github.com/tomas-teston/plugin-eskid3). 

Los detalles de implementación para crear un plugin y algunos otros aspectos importantes previos a poder crear este ejemplo se encuentran descritos en la siguiente dirección: [Wiki](https://github.com/tomas-teston/plugin-eskid3/wiki).

Este plugin utiliza la siguiente estructura de datos

* username = String 
* level: Number
* _type: traza 
* _index: game_level

## Cómo empezar

Para poder ejecutar este plugin en Kibana es necesario tener todo el entorno de desarrollo configurado: [Cómo confrigurar el entorno de desarrollo](https://github.com/tomas-teston/plugin-eskid3/wiki/Entorno-de-desarrollo).


## Comandos

Primero hay que situarse dentro de la carpeta donde se haya desarrollado el plugin y descargar las dependencias necesarias utilizando el siguiente comando de NPM (Node Package Manager): `npm install`

Una vez está configurado el entorno y hayamos bajado las dependencias necesarias puede realizar alguna de las siguientes acciones:

  - Lanzar Kibana incluyendo el plugin que hemos desarrollado: `npm start`

  - Puede pasar cualquier argumento como normalmente enviaría a `bin/kibana` poniendo después `--` al ejecutar `npm start`: `npm start -- --config kibana.yml`
  
  - Construir un archivo distribuible: `npm run build`

  - Ejecutar las pruebas de navegador en un navegador web real: `npm run test:browser`    

  - Lanzar el servidor de pruebas usando Mocha: `npm run test:server`

> Para saber mas información sobre estos comandos lanzar `npm run ${task} -- --help`.
