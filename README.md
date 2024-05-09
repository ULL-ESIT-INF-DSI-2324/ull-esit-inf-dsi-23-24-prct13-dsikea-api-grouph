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
        <img alt="Github" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-grouph/actions/workflows/node.js.yml/badge.png">
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

En este apartado llevaremos a cabo la explicación del código desarrollado. Sin embargo, antes de pasar con el código como tal, queremos resaltar la importancia de las variables de entorno definidas en los ficheros dentro del directiorio `./config`. Estas variables son esenciales para diferenciar entre los entornos de producción y de pruebas, permitiendo una gestión más segura y eficiente de la configuración sin comprometer datos sensibles.

 - **dev.env**
 ```
 PORT=3000
 MONGODB_URL=mongodb://127.0.0.1:27017/dsikea-api
 ```

 - **test.env**
 ```
 PORT=3000
 MONGODB_URL=mongodb://127.0.0.1:27017/dsikea-api-test
 ```

A continuación, procederemos con todo el código desarrollado dentro de los directorios contenidos en `./src`.

- ### **[./src/db]**
 Dentro de este directorio, nos encontramos con el fichero `mongoose.ts`, el cual contiene el código necesario para establecer la conexión con el servidor de MongoDB. 
 
 ```
 try {
   await connect(process.env.MONGODB_URL!);
   console.log('Connection to MongoDB server established');
 } catch (error) {
    console.log(error);
 }
 ```

 Este fichero importa la función connect del módulo mongoose y utiliza una variable de entorno **process.env.MONGODB_URL** para acceder a la URL de conexión a la base de datos. 

Por otro lado, en el fichero `index.ts` nos encontramos con el núcleo de la configuración del servidor usando el framework Express. Este fichero es crucial ya que actúa como punto de entrada para la aplicación, donde se inicializa el servidor HTTP y se configuran las rutas y los middlewares necesarios para el funcionamiento de la aplicación.

```
export const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(customerRouter);
app.use(providerRouter);
app.use(furnitureRouter);
app.use(transactionRouter);
app.use(defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
```

El servidor se configura para escuchar en un puerto definido por una variable de entorno **PORT**, o el puerto 3000 como predeterminado. Al iniciar el servidor, se imprime un mensaje en la consola indicando que el servidor está operativo y escuchando peticiones en el puerto especificado.

- ### **[./src/models]**

En este directorio encontraremos las diferentes interfaces y modelos utilizados en la aplicación, cada uno correspondiente a las entidades de la base de datos como clientes, proveedores, muebles y transacciones. Cada modelo está definido utilizando Mongoose, lo que facilita la integración con MongoDB al proporcionar una estructura de datos clara.

- **customer.ts**

En este archivo, definimos `CustomerDocumentInterface` como una interfaz que extiende `Document` de Mongoose, lo que permite tipificar los documentos de la colección de clientes. Los campos incluidos en esta interfaz son:

- `name`: Nombre del cliente, requerido y sin espacios al inicio o al final.
- `nif`: Número de Identificación Fiscal, que debe ser único y seguir un formato específico (8 dígitos seguidos de una letra).
- `email`: Dirección de correo electrónico, requerida, que se convierte a minúsculas y se valida para asegurar que tiene un formato de correo válido.
- `mobilePhone`: Número de teléfono móvil opcional, que debe tener exactamente 9 dígitos.
- `address`: Dirección del cliente, requerida y sin espacios al inicio o al final.

El **customerSchema** aplica estas definiciones y añade validaciones específicas para asegurar que los datos ingresados cumplen con las políticas de nuestra aplicación. La instancia del modelo **Customer** se crea basándose en este esquema, permitiendo interactuar con la colección de clientes en la base de datos.

```
  export interface CustomerDocumentInterface extends Document {
    name: string,
    nif: string,
    email: string,
    mobilePhone?: number,
    address: string,
  }

  const customerSchema = new Schema<CustomerDocumentInterface>({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      nif: { 
          type: String, 
          required: true,
          unique: true, 
          trim: true,
          validate: {
            validator: function(value: string) {
              if (!/^[0-9]{8}[A-Z]$/i.test(value)) {
                throw new Error('NIF must have 8 digits followed by a letter and be exactly 9 characters long');
              }
              return true;
            }
          }
      },
      email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          validate(value: string) {
            if (!validator.default.isEmail(value)) {
              throw new Error('Email is invalid');
            }
          }
      },
      mobilePhone: {
          type: Number,
          required: false,
          validate(value: number) {
            if (value.toString().length !== 9) {
              throw new Error('Mobile phone must have 9 digits');
            }
          }
      },
      address: {
          type: String,
          required: true,
          trim: true,
      }
  });

  export const Customer = model<CustomerDocumentInterface>('Customer', customerSchema);
```

- **provider.ts**
 
 Similar al archivo de clientes, `ProviderDocumentInterface` define la estructura para los documentos de proveedores en la base de datos. Los campos son paralelos a los de clientes, con la diferencia principal en el campo **cif**, que es el número de identificación fiscal para proveedores y debe seguir el patrón de una letra seguida de 8 dígitos.

 El `providerSchema` incluye validaciones similares a las del esquema de clientes para garantizar la integridad de los datos. Por ejemplo, el **CIF** debe ser único y seguir el formato específico mencionado, y el **email** debe ser válido. Al igual que en el modelo de clientes, se crean instancias del modelo **Provider** basadas en este esquema para realizar operaciones de base de datos relacionadas con proveedores.

- **furniture.ts**

 Primero, definimos la interfaz `FurnitureDocumentInterface`, que extiende la interfaz `Document` de Mongoose. Esta interfaz especifica los campos que cada documento de mobiliario debe contener:

 - `name`: Nombre del mueble, que es único y requerido.
 - `description`: Descripción detallada del mueble, también requerida.
 - `material`: Material del que está hecho el mueble, requerido.
 - `color`: Color del mueble, limitado a opciones específicas como 'rojo', 'azul', etc.
 - `price`: Precio del mueble, que debe ser mayor que 0 para asegurar datos comerciales válidos.
 - `type`: Tipo de mueble, como 'Silla', 'Mesa' o 'Armario'.
 - `stock`: Cantidad de inventario disponible, que no puede ser negativa para mantener la validez del mismo.

 Luego, definimos el `furnitureSchema`, que es una instancia del Schema de Mongoose, aplicando la interfaz `FurnitureDocumentInterface` para asegurar que todos los documentos de mobiliario en la base de datos se adhieran a las especificaciones de tipo y validación. El esquema:

 - Impone que el nombre sea único y esté libre de espacios innecesarios (trim).
 - Utiliza validaciones para asegurar que el precio y el stock sean lógicos.
 - Restringe los valores de color y type a conjuntos predefinidos.

```
export interface FurnitureDocumentInterface extends Document {
    name: string,
    description: string,
    material: string,
    color: 'rojo' | 'azul' | 'verde' | 'amarillo' | 'negro' | 'blanco' | 'marron',
    price: number,
    type: 'Silla' | 'Mesa' | 'Armario',
    stock: number,
}

export const furnitureSchema = new Schema<FurnitureDocumentInterface>({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    material: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        enum: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'marron'],
    },
    price: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value <= 0) {
                throw new Error('Price must be greater than 0');
            }
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['Silla', 'Mesa', 'Armario'],
    },
    stock: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0) {
                throw new Error('Stock must be greater than or equal to 0');
            }
        }
    }
});

export const Furniture = model<FurnitureDocumentInterface>('Furniture', furnitureSchema);
```

- **transaction.ts**

La interfaz `TransactionDocumentInterface` extiende la interfaz básica `Document` de Mongoose, proporcionando una estructura tipada para los documentos de transacciones. Los campos definidos en esta interfaz son:

- `customerNIF`: Número de Identificación Fiscal del cliente, opcional, requerido cuando la transacción es una venta.
- `providerCIF`: Código de Identificación Fiscal del proveedor, opcional, necesario cuando la transacción es una compra.
- `type`: Tipo de transacción, que puede ser 'SALE' (venta) o 'PURCHASE' (compra), es un campo requerido.
- `furnitureList`: Lista de muebles involucrados en la transacción, incluyendo un identificador de mueble y la cantidad. Cada mueble se referencia por su ID y debe tener al menos una unidad.
- `totalPrice`: Precio total de la transacción, que debe ser mayor que cero para asegurar su validez.
- `date`: Fecha de la transacción, que se registra automáticamente al crear el documento.

El `transactionSchema` aplica la interfaz `TransactionDocumentInterface` para definir las reglas de validación y estructura de los documentos de transacción en la base de datos:

- Los campos `customerNIF` y `providerCIF` incluyen validaciones para asegurar que sigan el formato correcto y requeridos dependiendo del tipo de transacción.
- El campo `type` restringe los valores a **'SALE'** o **'PURCHASE'**.
- `furnitureList` asegura que cada entrada de mueble tenga un identificador válido y una cantidad que sea un número entero y mayor o igual a uno.
- `totalPrice` y `date` también incluyen validaciones para garantizar que el precio sea positivo y que la fecha de transacción sea la actual al momento de crear el registro.

Finalmente, se crea el modelo `Transaction` basado en el `transactionSchema` definido. Este modelo facilita la interacción con la colección **'transactions'** en la base de datos.

```
export interface TransactionDocumentInterface extends Document {
    customerNIF?: string,
    providerCIF?: string,
    type: 'SALE' | 'PURCHASE',
    furnitureList: { furnitureId: FurnitureDocumentInterface | number; quantity: number} [],
    totalPrice: number,
    date: Date,
}

const transactionSchema = new Schema<TransactionDocumentInterface>({
    customerNIF: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          if (!/^[0-9]{8}[A-Z]$/i.test(value)) {
            throw new Error('NIF must have 8 digits followed by a letter and be exactly 9 characters long');
          }
          return true;
        }
      },
      required: function() {
          return this.type === 'SALE';
      }
    },
    providerCIF: {
        type: String,
        trim: true,
        validate: {
            validator: function(value: string) {
                if (!/^[A-Z][0-9]{8}$/i.test(value)) {
                    throw new Error('CIF must have 8 digits followed by a letter and be exactly 9 characters long');
                }
                return true;
            }
        },
        required: function() {
            return this.type === 'PURCHASE';
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['SALE', 'PURCHASE'],
    },
    furnitureList: [{
        furnitureId: {
            type: Types.ObjectId,
            ref: 'Furniture',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be an integer.'
            }
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
        validate(value: number) {
            if (value <= 0) {
                throw new Error('Total price must be greater than 0');
            }
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
},  { timestamps: false },
);

export const Transaction = model<TransactionDocumentInterface>('Transaction', transactionSchema);
```

- ### **[./src/routers]**



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