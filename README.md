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

### **[./src/db]**
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

### **[./src/models]**

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

### **[./src/routers]**

En este directorio se encuentran definidos los *routers*, que son esenciales para dirigir las solicitudes entrantes a los controladores apropiados, dependiendo de la ruta y del tipo de solicitud HTTP que se realice. Los *routers* son los siguiente:

- **default.ts**

Este fichero contiene un *router* genérico que maneja todas las solicitudes a rutas no definidas en el resto de *routers* de la aplicación. Es fundamental para manejar errores de forma centralizada y proporcionar una respuesta coherente cuando se accede a una ruta no configurada en el sistema.

```
export const defaultRouter = express.Router();

defaultRouter.all('*', (_, res) => {
  res.status(501).send('Route not implemented');
});
```

- **customer_router.ts** y **provider_router.ts**

Las rutas para los clientes y los proveedores prácticamente iguales. Mientras que las rutas de clientes utilizan el NIF como identificador clave para realizar búsquedas, actualizaciones y eliminaciones, las rutas de proveedores utilizan el CIF, que es el equivalente para entidades comerciales o proveedores. Como los manejadores son prácticamente idénticos, en este apartado solo veremos los de los `customers`.

- `POST /customers`: Permite crear un nuevo cliente en la base de datos. Recibe los datos del cliente en el cuerpo de la solicitud (name, NIF, email, mobilePhone, address) y crea una nueva instancia del modelo Customer con estos datos. Luego, guarda este objeto en la base de datos. Si el guardado tiene éxito, responde con un estado 201 junto con los datos del cliente creado, en caso contrario, devuelve un estado 500 con un mensaje de error.

```
customerRouter.post('/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send(error);
    }
});
```

- `PATCH /customers`: Permite actualizar los datos de un cliente existente mediante el uso de su NIF, que se proporciona como un parámetro de consulta. Los campos a actualizar se envían en el cuerpo de la solicitud, y solo ciertos campos están permitidos para modificación (name, email, mobilePhone, address). Se busca el cliente utilizando **findOneAndUpdate** para actualizarlo con los nuevos datos. Si la operación tiene éxito, se devuelven los datos actualizados; si el NIF está ausente, se envía un error 400, y si no se encuentra el cliente, se devuelve un error 404. Un error 500 se emite si ocurre un fallo en la operación.

```
customerRouter.patch('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    const allowedUpdates = ['name', 'email', 'mobilePhone', 'address'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const customer = await Customer.findOneAndUpdate({ nif: req.query.nif }, req.body, { new: true, runValidators: true });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `PATCH /customers/:id`: Actualiza un cliente basado en su ID de MongoDB, pasado como parámetro de ruta. Similar a la ruta anterior, verifica que solo se actualicen los campos permitidos y luego utiliza **findByIdAndUpdate** para modificar el documento. Responde con los datos del cliente actualizado o con un error 400 si los campos son inválidos, 404 si no se encuentra al cliente, o 500 en caso de otros errores.

```
customerRouter.patch('/customers/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'mobilePhone', 'address'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `GET /customers`: Recupera datos de un cliente utilizando su NIF como parámetro de consulta. Se utiliza **findOne** para buscar el cliente y devolver sus datos. Si falta el NIF en la solicitud, se responde con un error 400, mientras que un error 404 se devuelve si no se encuentra un cliente con el NIF dado. Los errores en la búsqueda se manejan con un estado 500.

```
customerRouter.get('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    try {
        const customer = await Customer.findOne({ nif: req.query.nif });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    
```

- `GET /customers/:id`: Obtiene los datos de un cliente usando su ID de MongoDB. Utiliza **findById** para buscar al cliente, devolviendo sus datos en caso de éxito, o un error 404 si no se encuentra el cliente, y un error 500 en caso de problemas durante la operación.

```
customerRouter.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `DELETE /customers` y `DELETER /customers/:id`: Permiten eliminar un cliente usando su NIF o ID de MongoDB respectivamente. En ambos casos, se busca el cliente usando **findOneAndDelete** o **findByIdAndDelete**. Si el cliente se encuentra y se elimina con éxito, se devuelve un estado 200 con los datos del cliente eliminado. Se devuelve un estado 400 si falta el NIF o el ID, un error 404 si no se encuentra el cliente, y un error 500 en caso de fallos durante la operación.

```
customerRouter.delete('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    try {
        const customer = await Customer.findOneAndDelete({ nif: req.query.nif });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

customerRouter.delete('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- **furniture_router.ts**

- `POST /furnitures`: Permite crear un nuevo mueble en la base de datos. Recibe los datos del mueble en el cuerpo de la solicitud (name, description, material, color, price, type, stock) y crea una nueva instancia del modelo Furniture con estos datos. Luego, guarda este objeto en la base de datos. Si el guardado tiene éxito, responde con un estado 201 junto con los datos del mueble creado, en caso contrario, devuelve un estado 500 con un mensaje de error.

```
furnitureRouter.post('/furnitures', async (req, res) => {
    try {
        const furniture = new Furniture(req.body);
        await furniture.save();
        res.status(201).send(furniture);
    } catch (error) {
        res.status(500).send(error);
    }
});
```

- `PATCH /furnitures`: Permite la actualización de múltiples muebles basándose en los filtros aplicados a través de los parámetros de consulta. La ruta valida que los campos actualizados estén dentro de los permitidos (name, description, material, color, price, type, stock) y, si se encuentran coincidencias, actualiza los artículos correspondientes. La respuesta incluirá un mensaje con el número de artículos actualizados o un estado 404 si ningún artículo coincide con los filtros, y un estado 500 si ocurre algún error en el proceso.

```
furnitureRouter.patch('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    if (Object.keys(filter).length === 0) {
        return res.status(400).send({ message: 'At least one query parameter is required for filtering' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'material', 'color', 'price', 'type', 'stock'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update' });
    }

    try {
        const updated = await Furniture.updateMany(filter, req.body, { new: true, runValidators: true });
        if (updated.modifiedCount === 0) {
            return res.status(404).send({ error: 'Furniture not found' });
        }
        return res.status(200).send({
            message: `${updated.modifiedCount} furniture(s) updated`
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `PATCH /furnitures/:id`: Esta ruta actualiza un único mueble identificado por su ID de MongoDB. Acepta cambios en los mismos campos permitidos en la actualización general y utiliza el método **findByIdAndUpdate**. Si la actualización es exitosa, devuelve el mueble actualizado; si el mueble no se encuentra, retorna un estado 404; y si surge algún error durante la actualización, se emite un estado 500.

```
furnitureRouter.patch('/furnitures/:id', async (req, res) => {
    const allowedUpdates = ['name', 'description', 'material', 'color', 'price', 'type', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.status(200).send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `GET /furnitures`: Recupera todos los muebles que coincidan con los filtros especificados en los parámetros de consulta. Si se encuentran muebles, los devuelve; si no hay coincidencias, devuelve un estado 404. Problemas durante la recuperación de los datos resultan en un estado 500.

```
furnitureRouter.get('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    try {
        const furnitures = await Furniture.find(filter);
        if(furnitures.length === 0) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furnitures);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `GET /furnitures/:id`: Obtiene los detalles de un mueble específico mediante **findById**, utilizando su ID de MongoDB. Si el mueble se encuentra, se devuelven sus detalles; de lo contrario, se responde con un estado 404. Cualquier error en la recuperación del mueble provoca un estado 500.

```
furnitureRouter.get('/furnitures/:id', async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.id);
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `DELETE /furnitures`: Permite eliminar muebles basándose en filtros especificados en los parámetros de consulta. Esta ruta verifica primero si los filtros están correctamente especificados y, si procede, elimina los muebles que coincidan mediante **deleteMany**. Devuelve un mensaje indicando la cantidad de muebles eliminados o un estado 404 si no se encuentra ningún mueble. Un error durante el proceso resulta en un estado 500.

```
furnitureRouter.delete('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    if (Object.keys(filter).length === 0) {
        return res.status(400).send({ message: 'At least one query parameter is required for filtering' });
    }

    try {
        const deleted = await Furniture.deleteMany(filter);
        if(deleted.deletedCount === 0) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send({
            message: `${deleted.deletedCount} furniture(s) deleted`
        }).status(200);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- `DELETE /furnitures/:id`: Elimina un mueble específico identificado por su ID de MongoDB a través de **findByIdAndDelte**. Si la eliminación es exitosa, devuelve los detalles del mueble eliminado; si no se encuentra el mueble, retorna un estado 404; y si ocurre un error durante la eliminación, se reporta con un estado 500.

```
furnitureRouter.delete('/furnitures/:id', async (req, res) => {
    try {
        const furniture = await Furniture.findByIdAndDelete(req.params.id);
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});
```

- **transaction_router.ts**

En primer lugar, tenemos las funciones `findCustomer` y `findProvider`, las cuales se encargan de verificar la existencia y la validez de clientes y proveedores dentro de la aplicación:

```
async function findCustomer(nif: string): Promise<CustomerDocumentInterface | null> {
    return Customer.findOne({ nif: nif }).exec();
}

async function findProvider(cif: string): Promise<ProviderDocumentInterface | null> {
    return Provider.findOne({ cif: cif }).exec();
}
```

A continuación, los diferentes manejadores:

- `POST /transactions`: Esta ruta crea nuevas transacciones, ya sean de tipo "SALE" o "PURCHASE". Para iniciar una transacción, se requiere un **type** válido, una **furnitureList** con sus respectivos muebles y cantidades y, dependiendo del tipo de transacción, un NIF de cliente o un CIF de proveedor. La ruta primero verifica la validez del tipo de transacción y la presencia de la lista de muebles. Posteriormente, dependiendo del tipo, busca al cliente o al proveedor utilizando las funciones **findCustomer** o **findProvider**. Tras verificar la existencia y disponibilidad de los muebles, ajusta el inventario y calcula el precio total. Si todos los pasos se completan exitosamente, la transacción se guarda y se devuelve al cliente; si ocurre un error en cualquiera de estos pasos, se maneja adecuadamente, devolviendo mensajes de error específicos.

```
transactionRouter.post('/transactions', async (req, res) => {
    const { type, customerNIF, providerCIF, furnitureList } = req.body;

    if (type !== 'SALE' && type !== 'PURCHASE') {
        return res.status(400).send({ error: 'Invalid transaction type' });
    }
    if (!furnitureList || furnitureList.length === 0) {
        return res.status(400).send({ error: 'Furniture list must be provided' });
    }

    try {
        let party = null;
        if (type === 'SALE') {
            if (!customerNIF) {
                return res.status(400).send({ error: 'Customer NIF is required for SALE transactions' });
            }
            party = await findCustomer(customerNIF);
            if (!party) {
                return res.status(404).send({ error: 'Customer not found' });
            }
        } else if (type === 'PURCHASE') {
            if (!providerCIF) {
                return res.status(400).send({ error: 'Provider CIF is required for PURCHASE transactions' });
            }
            party = await findProvider(providerCIF);
            if (!party) {
                return res.status(404).send({ error: 'Supplier not found' });
            }
        }

        let totalPrice = 0;
        for (const item of furnitureList) {
            const furniture = await Furniture.findById(item.furnitureId);
            if (!furniture) {
                return res.status(404).send({ error: 'Furniture not found' });
            }

            if ((type === 'SALE' && furniture.stock < item.quantity) || 
                (type === 'PURCHASE' && item.quantity < 0)) {
                return res.status(400).send({ error: 'Insufficient stock for sale or invalid quantity for purchase' });
            }

            furniture.stock += (type === 'PURCHASE' ? item.quantity : (-item.quantity));
            await furniture.save();
            totalPrice += furniture.price * item.quantity;
        }

        const transaction = new Transaction({
            customerNIF: type === 'SALE' ? customerNIF : undefined,
            providerCIF: type === 'PURCHASE' ? providerCIF : undefined,
            type,
            furnitureList,
            totalPrice,
            date: new Date()
        });

        await transaction.save();
        return res.status(201).send(transaction);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
```

- `GET /transactions`: Esta ruta recupera transacciones basándose en filtros específicos como el NIF del cliente o el CIF del proveedor. Verifica la existencia de estos identificadores y, de ser correctos, procede a filtrar y devolver todas las transacciones que coincidan. Si no se encuentran transacciones que cumplan con los criterios establecidos, se devuelve un mensaje de error.

```
transactionRouter.get('/transactions', async (req, res) => {
    const { customerNIF, providerCIF } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    try {
        if (customerNIF) {
            const customerExists = await Customer.exists({ nif: customerNIF });
            if (!customerExists) {
                return res.status(404).send({ message: `No customer found with NIF: ${customerNIF}` });
            }
        }

        if (providerCIF) {
            const providerExists = await Provider.exists({ cif: providerCIF });
            if (!providerExists) {
                return res.status(404).send({ message: `No provider found with CIF: ${providerCIF}` });
            }
        }

        if (customerNIF) {
            filter.customerNIF = customerNIF;
        }
        if (providerCIF) {
            filter.providerCIF = providerCIF;
        }

        const transactions = await Transaction.find(filter);
        if (transactions.length === 0) {
            return res.status(404).send({ message: 'No transactions found for the provided identifiers.' });
        }
        return res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
```

- `GET /transactions/by-date`: Similar a la ruta anterior, esta variante permite filtrar transacciones dentro de un rango de fechas específico, además de por tipo de transacción. Valida la presencia de ambas fechas y el tipo, luego busca y devuelve todas las transacciones que cumplan con estos parámetros. 

```
transactionRouter.get('/transactions/by-date', async (req, res) => {
    const { startDate, endDate, type } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (type) {
        filter.type = type;
    }
    if(startDate && endDate) {
        filter.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    } else if (startDate || endDate) {
        return res.status(400).send({ error: 'Both start date and end date must be provided' });
    }

    try {
        const transactions = await Transaction.find(filter);
        if (transactions.length === 0) {
            return res.status(404).send({ error: 'No transactions found' });
        }
        return res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
```

- `GET /transactions/:id`: Obtiene los datos de una transacción usando su ID de MongoDB. Utiliza **findById** para buscar la transacción, devolviendo sus datos en caso de éxito, o un error 404 si no se encuentra la transacción, y un error 500 en caso de problemas durante la operación.

```
transactionRouter.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).send({ 
                error: 'Transaction not found' 
            });
        }
        return res.send(transaction);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
```

- `PATCH /transactions/:id`: Permite la actualización de una transacción específica mediante su ID de MongoDB. Primero, se verifica si la transacción existe utilizando el ID proporcionado. Si no se encuentra, se responde con un estado HTTP 404. Luego se examina la lista de muebles actualizada proporcionada en el cuerpo de la solicitud y se asegura que los muebles existan y que las cantidades sean adecuadas para el tipo de transacción (venta o compra). Para cada mueble implicado, se ajusta el stock. Para ventas, el stock se reduce; para compras, se incrementa.
El precio total de la transacción se recalcula basándose en los precios actuales de los muebles y las nuevas cantidades. 
Por último, los detalles de la transacción actualizados, incluyendo la lista de muebles y el precio total, se guardan nuevamente en la base de datos. Si todo el proceso es exitoso, se envía la transacción actualizada al cliente. En caso de errores durante la actualización, como problemas de validación o errores en el acceso a la base de datos, se manejan mediante códigos de estado apropiados y mensajes de error claros.

```
transactionRouter.patch('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { furnitureList } = req.body;

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found.');
        }

        let newTotalPrice = 0;

        if (transaction.furnitureList && transaction.furnitureList.length > 0) {
            await Promise.all(transaction.furnitureList.map(async (item) => {
                const furniture = await Furniture.findById(item.furnitureId);
                if (furniture) {
                    const stockAdjustment = transaction.type === 'PURCHASE' ? -item.quantity : item.quantity;
                    furniture.stock += stockAdjustment;
                    await furniture.save();
                }
            }));
        }

        if (furnitureList && furnitureList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await Promise.all(furnitureList.map(async (newItem: { furnitureId: any; quantity: number; }) => {
                const furniture = await Furniture.findById(newItem.furnitureId);
                if (furniture) {
                    const stockAdjustment = transaction.type === 'PURCHASE' ? newItem.quantity : -newItem.quantity;
                    furniture.stock += stockAdjustment;
                    await furniture.save();
                    newTotalPrice += newItem.quantity * furniture.price;
                } else {
                    throw new Error(`Furniture not found for ID: ${newItem.furnitureId}`);
                }
            }));
        }

        transaction.furnitureList = furnitureList;
        transaction.totalPrice = newTotalPrice; 
        await transaction.save();

        return res.send(transaction);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
```

- `DELETE /transactions/:id`: Inicialmente, se intenta encontrar la transacción específica utilizando el ID proporcionado en la solicitud (req.params.id) mediante el método **findById**. Una vez encontrada la transacción, el sistema revisa cada artículo listado en transaction.furnitureList. Para cada artículo, busca el mueble correspondiente en la base de datos utilizando su ID. Si algún mueble no se encuentra, devuelve un error 404 indicando que el mueble específico no fue encontrado, en cambio, si el mueble existe, calcula el nuevo nivel de stock que resultaría después de revertir la transacción. Si la transacción fue una compra, se reduce el stock, si fue una venta, se incrementa.
Si el ajuste de stock resulta en un número negativo, lo que indicaría una cantidad inexistente, se devuelve un error 400 indicando insuficiencia de stock para revertir la transacción.
Después de ajustar el inventario de todos los artículos involucrados sin problemas, la transacción se elimina de la base de datos utilizando **findByIdAndDelete**. Si todos los pasos anteriores se completan con éxito, se envía una respuesta con estado 200, indicando que la transacción fue eliminada correctamente y que el stock fue ajustado adecuadamente, en caso contrario, se captura este error y se devuelve un estado 500 con un mensaje explicativo.

```
transactionRouter.delete('/transactions/:id', async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        return res.status(404).send('Transaction not found');
      }
  
      for (const item of transaction.furnitureList) {
        const furniture = await Furniture.findById(item.furnitureId);
        if (!furniture) {
          return res.status(404).send({ message: 'Furniture not found for ID: ' + item.furnitureId });
        }

        const newStockLevel = transaction.type === 'PURCHASE' ? furniture.stock - item.quantity : furniture.stock + item.quantity;

        if (newStockLevel < 0) {
          return res.status(400).send({
            message: `Insufficient stock to reverse the transaction for furniture ID: ${item.furnitureId}. Available stock: ${furniture.stock}, trying to subtract: ${item.quantity}`
          });
        }
  
        furniture.stock = newStockLevel;
        await furniture.save();
      }

      await Transaction.findByIdAndDelete(req.params.id);
      return res.status(200).send({ message: 'Transaction deleted and stock adjusted successfully.' });
    } catch (error) {
        return res.status(500).send({ message: 'Error deleting transaction: ' + error.message });
    }
});
```

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
