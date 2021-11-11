
const DB = require("../DB/db.js")
const io = require("socket.io-client");
const express = require("express")
const app = express();

class Client{
    constructor(address){
        this.db = new DB(address);

        this.socket = io("http://localhost:2310");
        this.socket2 = io("http://localhost:2310");
    
        this.server = app.listen(2311, ()=>{
            console.log("Client Running")
        })
        this.socketServer = require("socket.io")(this.server, {cors:{origin: "*"}})

        this.socket2.on("added", (data)=>{
            this.socketServer.sockets.emit("added", data);
        })

        this.socket2.on("createdContainer", (data) => {
            this.socketServer.sockets.emit("createdContainer", data);
        })

        this.socket2.on("updatedField", (data)=>{
            this.socketServer.sockets.emit("updatedField", data);
        })

        this.socket2.on("deletedField", (data)=>{
            this.socketServer.sockets.emit("deletedField", data);
        })

        this.socket2.on("deletedContainer", (data)=>{
            this.socketServer.sockets.emit("deletedContainer", data);
        })

        this.socket2.on("foundOneAndUpdated", (data)=>{
            this.socketServer.sockets.emit("foundOneAndUpdated", data);
        })

        this.socket2.on("foundOneAndDeleted", (data)=>{
            this.socketServer.sockets.emit("foundOneAndDeleted", data);
        })

        this.socket2.on("foundOneAndUpdated", (data)=>{
            this.socketServer.sockets.emit("foundOneAndUpdated", data);
        })
        
        this.socket2.on("foundOneAllAndDeleted", (data)=>{
            this.socketServer.sockets.emit("foundAllAndDeleted", data);
        })

        this.socket2.on("pushed", (data)=>{
            this.socketServer.sockets.emit("pushed", data);
        })

        this.socket2.on("pulled", (data)=>{
            this.socketServer.sockets.emit("pulled", data);
        })

        this.socket2.on("pulledAll", (data)=>{
            this.socketServer.sockets.emit("pulledAll");
        })


    }

   createContainer(name, type, data){

    if(!data){
        data = {}
    }
     

        const opts = {
            name : name,
            type: type,
            data: data
        }


        return new Promise((resolve, reject) => {
            let timer;
    
            this.socket.emit("createContainer", opts)
    
            function responseHandler(message) {
                // resolve promise with the value we got
                resolve(message);
                clearTimeout(timer);
            }
    
            this.socket.once('createdContainer', responseHandler); 

            timer = setTimeout(() => {
                reject(new Error("timeout waiting for msg"));
                this.socket.removeListener('msg', responseHandler);
            }, 10000);
    
        });
    }

    addField(name, container, data){
        const opts = {
            field: name,
            container: container, 
            data: data
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("addField", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("added", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

      
    }

    getField(container, field){
        const opts = {
            field: field,
            container : container
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("getField", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("gotField", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })


    }

    getContainer(container){
        const opts = {
            container: container
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("getContainer", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("gotContainer", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })
        
    }

    updateField(container, field, property, dataToUpdate){
        const opts = {
            container: container,
            field: field,
            property: property,
            data: dataToUpdate
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("updateField", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("updatedField", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    deleteField(container, field){
        const opts = {
            container: container,
            field: field
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("deleteField", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("deletedField", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    deleteContainer(container){
        const opts = {
            container: container
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("deleteContainer", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("deletedContainer", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    getAllContainers(){

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("getContainers", "all")

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("gotContainers", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findOne(container, property, value){
        const opts = {
            container: container,
            field: property,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findOne", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundOne", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findAll(container, property, value){
        const opts = {
            container: container,
            field: property,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findAll", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundAll", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findOneAndUpdate(container, property, value, dataToUpdate){
        const opts = {
            container: container,
            field: property,
            value: value,
            data: dataToUpdate
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findOneAndUpdate", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundOneAndUpdated", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findOneAndDelete(container, property, value){
        const opts = {
            container: container,
            field: property,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findOneAndDelete", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundOneAndDeleted", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findAllAndDelete(container, property, value){
        const opts = {
            container: container,
            field: property,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findAllAndDelete", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundAllAndDeleted", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    findAllAndUpdate(container, property, value, dataToUpdate){
        const opts = {
            container: container,
            field: property,
            value: value,
            data: dataToUpdate
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("findAllAndUpdate", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("foundAllAndUpdated", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    push(container, field, arrayName, value){
        const opts = {
            container: container,
            field: field,
            arrayName: arrayName,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("push", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("pushed", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    pull(container, field, arrayName, value){
        const opts = {
            container: container,
            field: field,
            arrayName: arrayName,
            value: value
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("pull", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("pulled", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }

    pullAll(container, field, arrayName){
        const opts = {
            container: container,
            field: field,
            arrayName: arrayName
        }

        return new Promise((resolve, reject)=>{
            let timer;

            this.socket.emit("pullAll", opts)

            function handler(message){
                resolve(message)
                clearTimeout(timer)
            }

            this.socket.once("pulledAll", handler)

            timer = setTimeout(()=>{
                reject(new Error("timeout waiting for msg"))
                this.socket.removeListener("added", handler)
            }, 10000)
            
        })

    }



}

class ContainerManager{
    constructor(container, client){
        this.container = container;
        this.client = client;
    }

   async addField(name, data){
       const res = await this.client.addField(name, this.container, data);
       return res
    }

    async  getField(field){
        const res = await this.client.getField(this.container, field);
        return res
        
    }

    async   getContainer(){
        const res = await this.client.getContainer(this.container);
        return res
    }

    async   updateField(field, property, dataToUpdate){
        const res = await this.client.updateField(this.container, field, property, dataToUpdate);
        return res
    }

    async   deleteField(field){
        const res =  await this.client.deleteField(this.container, field);
        return res
    }

    async   findOne(property, value){
        const res =  await this.client.findOne(this.container, property, value);
        return res
    }

    async  findAll(property, value){
        const res =  await this.client.findAll(this.container, property, value);
        return res
    }

    async   findOneAndUpdate(property, value){
        const res =  await this.client.findOneAndUpdate(this.container, property, value);
        return res
    }

    async  findOneAndDelete(property, value){
        const res =  await this.client.findOneAndDelete(this.container, property, value)
        return res
    }

    async   findAllAndUpdate(property, value){
        const res =  await this.client.findAllAndUpdate(this.container, property, value);
        return res
    }

    async   findAllAndDelete(property, value){
        const res =  await this.client.findAllAndDelete(this.container, property, value)
        return res
    }

    async    push(field, arrayName, value){
        const res =  await this.client.push(this.container, field, arrayName, value);
        return res
    }

    async   pull(field, arrayName, value){
        const res = await this.client.pull(this.container, field, arrayName, value);
        return res
    }

   async pullAll(field, arrayName){
        const res = await this.client.pullAll(this.container, field, arrayName);
        return res
    }


}



module.exports = {Client, ContainerManager};