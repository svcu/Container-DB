const fs = require("fs");
const express = require("express");
const app = express();


class DB{
    constructor(address, encrytpion, password){
        this.address = address;
        this.containers = [];
        this.encrytpion = encrytpion;
        this.password = password

        setInterval(()=>{
              
                this.containers.forEach((container) => {
                        
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    for(let i in db){
                        if(db[i]["expiration"] >= db[i]["time"]){
                            delete db[i];
                            fs.writeFileSync(this.address+container+".json", db);
                  }else {
                      db[i][time]++;
                  }
              }
                })

        }, 1000000);

        if(!fs.existsSync(this.address)){


            fs.mkdirSync(this.address);
            fs.writeFileSync(this.address + "db.json", "{}");


        }else if(!fs.existsSync(this.address + "db.json") && fs.existsSync(this.address)){


            fs.writeFileSync(this.address + "db.json", "{}");


        }


    


        if(fs.readFileSync(this.address + "db.json")){

            let data = fs.readFileSync(this.address + "db.json");
            let json = JSON.parse(data);
            for(let key in json){
                this.containers.push(key);
            }


        }
     
       
        this.server = app.listen(2310, ()=>{
            console.log("Server running")
        })


        this.socket = require("socket.io")(this.server, {cors: {origin: "*"}})


        this.socket.on("connect", (socket)=>{
            console.log("New client")

            socket.on("createContainer", (data)=>{

                if(this.containers.includes(data.name)){
                    this.socket.sockets.emit("createdContainer", "Container already exists");
                }else{
                    this.containers.push(data.name);


                    let db = JSON.parse(fs.readFileSync(this.address+"db.json"));
                    db[data.name] = {"type" : data.type, "data" : data.data};
                    fs.writeFileSync(this.address+"db.json", JSON.stringify(db));
                    fs.writeFileSync(this.address+data.name+".json", JSON.stringify(data.data));
    
                    this.socket.sockets.emit("createdContainer", {"container" : data.name})
                }


            })

            socket.on("addField", (data)=>{
                const container = data.container;
                const dataToUpdate = data.data;
                const field = data.field;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("added", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    if(!db.hasOwnProperty(field)){
                        //Add field
                        db[field] = dataToUpdate;
                        //Save changes to file
                        fs.writeFileSync(this.address+container+".json", JSON.stringify(db));
                   
                        this.socket.sockets.emit("added", {"container" : container, "field" : field, "data" : dataToUpdate})
                    }else{
                        this.socket.sockets.emit("added", "Field already exists")
                    }

                }
            })

            socket.on("getField", (data)=>{
                const container = data.container;
                const field = data.field;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("gotField", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    if(db.hasOwnProperty(field)){
                        this.socket.sockets.emit("gotField", {"container" : container, "field" : field, "data" : db[field]})
                    }else{
                        this.socket.sockets.emit("gotField", "Field does not exists")
                    }

                }
            })

            socket.on("getContainer", (data)=>{

                if(!this.containers.includes(data.container)){
                    this.socket.sockets.emit("gotContainer", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+data.container+".json"));
                    this.socket.sockets.emit("gotContainer", {"container" : data.container, "data" : db})
                }
            })

            socket.on("updateField", (data)=>{
                const container = data.container;
                const field = data.field;
                const property = data.property;
                const dataToUpdate = data.data;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("updatedField", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    if(db.hasOwnProperty(field)){
                        //Update field
                        db[field][property] = dataToUpdate;
                        //Save changes to file
                        fs.writeFileSync(this.address+container+".json", db);
                        this.socket.sockets.emit("updatedField", {"container" : container, "field" : field, "data" : dataToUpdate, "property" : property})
                    }else{
                        this.socket.sockets.emit("updatedField", "Field does not exists")
                    }

                }
            })

            socket.on("deleteField", (data)=>{
                const container = data.container;
                const field = data.field;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("deletedField", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));


                    if(db.hasOwnProperty(field)){
                        //Delete field
                        delete db[field];
                        //Save changes to file
                        fs.writeFileSync(this.address+container+".json", db);
                        this.socket.sockets.emit("deletedField", {"container" : container, "field" : field})
                    }else{
                        this.socket.sockets.emit("deletedField", "Field does not exists")
                    }

                }
            })

            socket.on("deleteContainer", (data)=>{
                const container = data.container;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("deletedContainer", "Container does not exists")
                }else{
                    //Delete container
                    let db = JSON.parse(fs.readFileSync(this.address+db+".json"))

                    delete db[container];

                    fs.unlinkSync(this.address+container+".json");
                    this.containers.splice(this.containers.indexOf(container), 1);
                    this.socket.sockets.emit("deletedContainer", {"container" : container})
                }
            })

            socket.on("getContainers", ()=>{
                this.socket.sockets.emit("gotContainers", this.containers);    
            })

            socket.on("findOne", (data)=>{
                //Find one element that has the value data.value in the property data.value in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundOne", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = {};
                    for(let i in db){
                        if(db[i][field] == value){
                            result=db[i];
                        }
                    }

                    this.socket.sockets.emit("foundOne", {"result" : result})
                }
            })
            
            socket.on("findAll", (data)=>{ 
                //Find all elements that have the value data.value in the property data.value in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundAll", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = [];
                    for(let i in db){
                        if(db[i][field] == value){
                            result.push(db[i]);
                        }
                    }

                    this.socket.sockets.emit("foundAll", {"result" : result})
                }
            })

            socket.on("findOneAndUpdate", (data)=>{
                //Find one element that has the value data.value in the property data.value in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;
                const dataToUpdate = data.data;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundOneAndUpdated", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = {};
                    for(let i in db){
                        if(db[i][field] == value){
                            result=db[i];
                            db[i][field] = dataToUpdate;
                            fs.writeFileSync(this.address+container+".json", db);

                            break;
                        }
                    }

                    this.socket.sockets.emit("foundOneAndUpdated", {"result" : result, "field" : field, "value" : value})
                }

            })

            socket.on("findOneAndDelete", (data)=>{
                //Find one element that has the value data.value in the property data.value in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundOneAndDeleted", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = {};
                    for(let i in db){
                        if(db[i][field] == value){
                            result=db[i];
                            delete db[i];
                            fs.writeFileSync(this.address+container+".json", db);

                            break;
                        }
                    }

                    this.socket.sockets.emit("foundOneAndDeleted", {"result" : result, "field": field})
                }

            })

            socket.on("findAllAndUpdate", (data)=>{
                //Find all elements that have the value data.value in the property data.value in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;
                const dataToUpdate = data.data;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundAllAndUpdated", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = [];
                    for(let i in db){
                        if(db[i][field] == value){
                            result.push(db[i]);
                            db[i][field] = dataToUpdate;
                            fs.writeFileSync(this.address+container+".json", db);
                        }
                    }

                    this.socket.sockets.emit("foundAllAndUpdated", {"result" : result, "field" : field, "value" : "value"})
                }

            })

            socket.on("findAllAndDelete", (data)=>{
                //Find all elements that have the value data.value in the property data.property in the container named data.container 
                const container = data.container;
                const field = data.field;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("foundAllAndDeleted", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    let result = [];
                    for(let i in db){
                        if(db[i][field] == value){
                            result.push(db[i]);
                            delete db[i];
                            fs.writeFileSync(this.address+container+".json", db);
                        }
                    }

                    this.socket.sockets.emit("foundAllAndDeleted", {"result" : result, "field" : field, "value" :  value})
                }

            })

            socket.on("push", (data)=>{
                const container = data.container;
                const field = data.field;
                const arrayName = data.arrayName;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("pushed", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    db[field][arrayName].push(value);
                    fs.writeFileSync(this.address+container+".json", db);

                    this.socket.sockets.emit("pushed", {"field" : field, "value" : value, "array" : arrayName})
                }

            })

            socket.on("pull", (data)=>{
                const container = data.container;
                const field = data.field;
                const arrayName = data.arrayName;
                const value = data.value;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("pulled", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    db[field][arrayName].pull(value);
                    fs.writeFileSync(this.address+container+".json", db);

                    this.socket.sockets.emit("pulled", {"field" : field, "value" : value, "array" : arrayName})
                }

            })

            socket.on("pullAll", (data)=>{
                const container = data.container;
                const field = data.field;
                const arrayName = data.arrayName;

                if(!this.containers.includes(container)){
                    this.socket.sockets.emit("pulledAll", "Container does not exists")
                }else{
                    //Get content of container
                    let db = JSON.parse(fs.readFileSync(this.address+container+".json"));

                    db[field][arrayName] = [];
                    fs.writeFileSync(this.address+container+".json", db);

                    this.socket.sockets.emit("pulledAll", {"field" : field, "array" : arrayName})
                }

            })
        
        

        })

    }

    
}




module.exports = DB;