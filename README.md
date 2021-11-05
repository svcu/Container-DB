# Container-DB
Database with embedded sockets for real-time communication

Container DB allows you to have more controll over your data thanks to its Container system. It also allows you to see whats happening with your data in real-time.

# Containers
Containers are like boxes where Container-DB stores your data. You can have infinite boces inside a database. For example you can have three separate boxes of users with different names, one for animals, and ten for hotels.

#Install

```js
npm i container-db
```

# Storing data



```js
const CDB = require("container-db");

const cdb = new CDB ("WHERE YOU WANT YOUR DATABASE TO BE HOSTED IT NEEDS TO END WITH AN SLASH (/)")

//1- create a container to store your data
cbd.createContainer("NAME", "TYPE", "INITIAL DATA").then(res => console.log)

//2- add a field (object)

cdb.addField("NAME OF THE FIELD/OBJECT", "CONTAINER", "INITIAL DATA / OBJECT DATA").then(res => console.log)

//3- get the field added

cdb.getField("CONTAINER", "FIELD NAME").then(res => console.log)

//4- get the container

cbd.getContainer("CONTAINER").then(res => console.log)

//5- update a property of the field / object

cdb.updateField("CONTAINER", "FIELD NAME", "PROPERTY", "UPDATED DATA").then(res => console.log)

//6- delete the field

cdb.deleteField("CONTAINER", "FIELD").then(res => console.log)

//7- delete the container

cdb.deleteContainer("CONTAINER")



```

Antoher functions avaible:

## ```getAllContainers() ```
## ```findOne(container, property, value) ```
### Find an element in the container with the value specified in the property specified
## ```findAll(container, property, value) ```
## ```findOneAndUpdate(container, property, value, dataToUpdate) ```
## ```findOneAndDelete(container, property, value) ```
## ```findAllAndDelete(container, property, value) ```
## ```findAllAndUpdate(container, property, value, dataToUpdate)```
## ```push(container, field, arrayName, value)```
### Push the value into the array with the name arrayName that is in the object with the name field that is in the container named container
## ```pull(container, field, arrayName, value)```
## ```pullAll(container, field, arrayName)```
### Clear the array

# Listening to changes (Real-Time)

Cotainer-DB creates a socket in the localhost:2311 that boradcasts all the changes that the data suffers, to listen on this changes is easy

```js
const io = require("socket.io-client")("http://localhost:2311")

//Listen when a container is created
io.on("createdContainer", (data) => {
    //Returns Container already exists || {container : ""}
})

//Listen when an object/field is added to a container
io.on("added", (data) => {
    //Returns Container does not exists || Field already exists || {"container: "", "field" : "", "data" : ""}
})

//Listen when a field/object is updated
io.on("updatedField", (data) => {
    //Returns {errors} || {"container" : "", "field" : "", "data" : "", "property" : ""}
})

//Listen when a field/object is deleted
io.on("deletedField", (data)=>{
    //Returns {errors} || {"container" : "", "field" : ""}
})

//Listen when a container is deleted
io.on("deletedContainer", (data)=>{
    //Returns {errors} || {"container" : ""}
})

//Listen when findOneAndUpdate()
io.on("foundOneAndUpdated", (data)=>{
    //Returns {errors} || {"result" : "", "field" : "", "value" : ""}
})

/*Another find events:
    foundOneAndDeleted()
    foundAllAndUpdated()
    foundAllAndDeleted()
*/

//Listen when push()
io.on("pushed", (data)=>{
    //Returns {errors} || {"field" : "", "value" : "", "array" : ""}
})

/*Another events liked pushed
    pulled
    pulledAll
*/
```

# Donations

ETH : 0xB86BF6c0519e7167a1f446F666DcE72C501F9597


