#### Documentation

API Key = FK1297FX

![image](https://github.com/Eifhen/Clean-API/assets/49046521/3e687bb3-2e19-493d-aefc-45352b2a4bdb)
Test API para poner en práctica los principios de la Clean Arquitecture realizada con las siguientes tecnologías

- NodeJs/TypeScript
- Express JS
- Awilix 
- Awilix Express
- MongoDB 
- Mongoose
- AJV Schemas
- JWT JsonWebTokens


La API cuenta con los siguientes mantenimientos 

1)  Mantenimiento de usuarios
	- Listar usuarios, Agregar, Editar y Eliminar usuarios

2)  Mantenimiento de marcas 
	- Listar marcas, agregar, editar y eliminar marcas

3) Mantenimiento de ventas
	- Listar ventas, agregar, editar y eliminar ventas

4) Mantenimiento de detalle de venta
	- Listar detalle de venta, agregar, editar y eliminar detalle de venta


#### Otras características 

La API cuenta con funcionalidades para el manejo de errores los cuales se escriben en un fichero 
de texto para poder tener un registro de los mismos ( ver clase ErrorHandler y ErrorManager ) y el logeo de todas las operaciones que se realizan, la API también cuenta con repositorios genéricos, transacciones para las operaciones de escritura en mongodb, paginación de la data,
autenticación, manejo de variables de entorno y mucha más.

#### End Points


- Authentication 
	-  #POST /api/v1/authentication/sign-up/
		- Expected Object Structure
			```
			{
			  "FullName": "Gabriel Jiménez",
			  "Age": 44,
			  "Type": "Admin",
			  "Email": "gabriel@example.com",
			  "Password": "hola00"
			}
			```
	-  #POST    /api/v1/authentication/sign-in/
		- Expected Object Structure
			```
			{
			    "email": "gabriel@example.com",
			    "password": "hola00"
			}
			```
-  Users
	- GetAllUsers  #GET  /api/v1/users/    
	- GetByID  #GET /api/v1/users/:id
	- GetByQuery #GET /api/v1/users/query?FullName=Gabriel Jiménez
		- Expected Object Structure
			```
			{
			    "pageSize": 2,
			    "currentPage" : 1
			}
			```
	- Create #POST /api/v1/users
		- Expected Object Structure
			```
			{
			    "fullName": "Anna Jiménez",
			    "age": 22,
			    "registerDate": "2024-05-14T15:40:10.458Z",
			    "email": "anna44@gmail.com",
			    "password": "12345",
			    "type": "Client",
			    "ip_address": "0055"
			}
			```
	- Edit #PUT /api/v1/users
		- Expected Object Structure
		```
		{
		    "fullName": "Elizabeth Bathory",
		    "age": "24",
		    "registerDate": "2024-05-14T15:40:10.458Z",
		    "email": "bathory444@gmail.com",
		    "type": "Client",
		    "id": "6643d3c170a4dc41f4e367d8"
		}
		```
	- Delete #Delete /api/v1/users/:id
- Marcas ( Brands )
	- GetAll  #GET /api/v1/brands/
	- GetByID #GET /api/v1/brands/:id
	- GetByQuery #GET /api/v1/brands/query?Name=Verxexe
		- Expected Object Structure
			```
				{
				    "pageSize": 2,
				    "currentPage" : 1
				}
			```
	- Create #POST /api/v1/brands/ 
		- Expected Object Structure
			```
			{
			    "name": "VIXEN",
			    "country": "UK"
			}
			```
	- Edit #PUT /api/v1/brands/
		- Expected Object Structure
			```
			{
			    "name": "Presidente Light",
			    "country": "República Dominicana",
			    "id": "6629b9f94b34f76757d85e33"
			}
			```
	 - Delete #DELETE /api/v1/brands/:id
- Ventas ( Sales )
	- GetAll #GET /api/v1/sales/
	- GetByID #GET /api/v1/sales/:id
	- GetByQuery #GET /api/v1/sales/query?Total=45000
		- Expected Object Structure
			```
			{
			    "pageSize": 10,
			    "currentPage" : 1
			}
			```
	- Create #POST /api/v1/sales/
		- Expected Object Structure
		```
			{
			    "total": 45000,
			    "seller": "6643beb5847e41e4be5e1748",
			    "client":"6644b6615ce742bc49f45057",
			    "date":"2024-05-13T22:33:21.419Z"
			}
		```
	- Edit #PUT /api/v1/sales 
		- Expected Object Structure 
			```
			{
			    "id": "664dd8be1d692984e66e8f0b",
			    "total": 67000,
			    "client": "664295314a5ba43fe66ceb7b",
			    "seller": "6643bc963e4db022deda2119",
			    "date": "2024-05-13T22:33:21.419Z"
			}
			```
	- Delete #DELETE /api/v1/sales
- Detalle de venta ( Sales Detail )
	- Create  #POST /api/v1/sales-detail
		- Expected Object Structure 
			```
			{
			  "sale": "664dd8da1d692984e66e8f10",
			  "shoe": "66548042974b65490571f9f8",
			  "price": 5500
			}
			```
	- Edit #PUT /api/v1/sales-detail
		- Expected Object Structure 
			```
			{
			  "sale": "664dd8da1d692984e66e8f10",
			  "shoe": "66548042974b65490571f9f8",
			  "price": 5500,
			  "id": "665484e59b52bd7b9719b79b"
			}
			```
	- Delete #DELETE /api/v1/sales-detail/:id
	- GetAll #GET /api/v1/sales-detail
	- GetByID #GET /api/v1/sales-detail/:id
	- GetByQuery #GET /api/v1/sales-detail/query?Price=500
		- Expected Object Structure
			```
			{
			    "pageSize": 10,
			    "currentPage": 1
			}
			```


#### Otros End Points

- FileController
	-  GetLogs #GET api/v1/logs/:fileName
		- Este end point devolverá el contenido de un determinado archivo de log
	- GetAllLogFilesName #GET api/v1/logs
		- Este end point nos devolverá los nombres de los archivos de log que actualmente tenemos

