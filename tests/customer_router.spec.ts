import "mocha";
import { Customer } from "../src/models/customer.js";
import { expect } from "chai";
import request from "supertest";
import {app} from "../src/index.js";

describe("Test de customer Router", () => {
    beforeEach(async () => {
        await Customer.deleteMany({});
    });
    let response:any;
    let responseget:any;
    let responsedelete:any;
    before(async()=>{
        await request(app).post("/customers").send({
            "name": "RafaNadal",
            "nif": "22222224A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
            await request(app).post("/customers").send({
                "name": "Rafa1 ",
                "nif": "22222223A",
                "email": "rafa@gmail.com",
                "mobilePhone": 222222222,
                "address": "Calle Manacor"
                })
            response=await request(app).post("/customers").send({
                    "name": "Rafa Nadal",
                    "nif": "22222229A",
                    "email": "rafa@gmail.com",
                    "mobilePhone": 222222222,
                    "address": "Calle Manacor"
                    })
                    await request(app).post("/customers").send({
                        "name": "Rafa Nadal",
                        "nif": "22222230A",
                        "email": "rafa@gmail.com",
                        "mobilePhone": 222222222,
                        "address": "Calle Manacor"
                        })
                    responseget=await request(app).post("/customers").send({
                            "name": "Rafa Nadal",
                            "nif": "22222230A",
                            "email": "rafa@gmail.com",
                            "mobilePhone": 222222222,
                            "address": "Calle Manacor"
                            })
                    await request(app).post("/customers").send({
                         "name": "Rafa Nadal",
                          "nif": "22222240A",
                          "email": "rafa@gmail.com",
                          "mobilePhone": 222222222,
                          "address": "Calle Manacor"
                         })
                         responsedelete=await request(app).post("/customers").send({
                            "name": "Rafa Nadal",
                            "nif": "22222210A",
                            "email": "rafa@gmail.com",
                            "mobilePhone": 222222222,
                            "address": "Calle Manacor"
                            })
    })
    it("should create a new customer", async () => {
      const res=await request(app).post("/customers").send({
      "name": "Rafa Nadal",
      "nif": "22222222W",
      "email": "rafa@gmail.com",
      "mobilePhone": 222222222,
      "address": "Calle Manacor"
      }).expect(201)
      const expectavie={
        "name": "Rafa Nadal",
        "nif": "22222222W",
        "email": "rafa@gmail.com",
        "mobilePhone": 222222222,
        "address": "Calle Manacor"       
      }
      expect(res.body).to.include(expectavie)
    })
    it("should create a new customer error", async () => {
        await request(app).post("/customers").send({
        "email": "rafa@gmail.com",
        "mobilePhone": 222222222,
        "address": "Calle Manacor"
        }).expect(500)
    })
    it("should update a customer", async () => {
        // Primero, crea el cliente asegurando que se crea correctamente.
        await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222224A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
        }).expect(201);
    
        // Luego, realiza la actualización y verifica el resultado.
        const res = await request(app).patch("/customers?nif=22222224A").send({
            "name": "Rafa modificado"
        }).expect(200);
    
        expect(res.body).to.include({
            name: "Rafa modificado",
            nif: "22222224A",
            email: "rafa@gmail.com",
            mobilePhone: 222222222,
            address: "Calle Manacor"
        });
    });
    
    it("should update a customer error query", async () => {
        await request(app).patch("/customers").send({
            "name": "Rafa modificado"
        }).expect(400)
    })
    it("should update a customer error 400 body", async () => {
        await request(app).patch("/customers/W22222223").send({
            "error": "Rafa modificado"
        }).expect(400)
    })
    it("should update a customer error 404", async () => {
        await request(app).patch("/customers?nif=22222229A").send({
            "name": "Rafa modificado"
        }).expect(404)
    })
    it("should update id a customer", async () => {
        const creationResponse = await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222229A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
        }).expect(201);
    
        const customerId = creationResponse.body._id;
        const res = await request(app).patch(`/customers/${customerId}`).send({
            "name": "Rafa modificado"
        }).expect(200);
    
        expect(res.body).to.include({
            name: "Rafa modificado"
        });
    });
    
    it("should update id a customer error", async () => {
        await request(app).patch("/customers/1").send({
            "name": "Rafa modificado"
        }).expect(500)
    })
    it("should update id a customer error", async () => {
        await request(app).patch("/customers/663ba1e428abaf1a19c71e15").send({
            "name": "Rafa modificado"
        }).expect(404)
    })
    it("should get a customer", async () => {
        await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222230A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
        }).expect(201);
    
        const res = await request(app).get("/customers?nif=22222230A").expect(200);
        expect(res.body).to.include({
            name: "Rafa Nadal",
            nif: "22222230A",
            email: "rafa@gmail.com",
            mobilePhone: 222222222,
            address: "Calle Manacor"
        });
    });
     
    it("should get a error 404 customer", async () =>{
        await request(app).get("/customers?nif=4").send({
        }).expect(404)
    })
    it("should get a error 500 customer", async () =>{
        await request(app).get("/customers/4").send({
        }).expect(500)
    })
    it("should get a error 404 customer", async () =>{
        await request(app).get("/customers/663ba1e428abaf1a19c71e15").send({
        }).expect(404)
    })
    it("should delete a customer with query", async () => {
        await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222240A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
        }).expect(201);
    
        await request(app).delete("/customers?nif=22222240A").expect(200);
    });
    it("should delete a customer with query error", async () => {
        await request(app).delete("/customers").send({
        }).expect(400)
    })
    it("should delete a customer with query error 404", async () => {
        await request(app).delete("/customers?nif=4").send({
        }).expect(404)
    })
    it("should delete a customer", async () => {
        const creationResponse = await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222210A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
        }).expect(201); 
    
        const customerId = creationResponse.body._id; 
        const res = await request(app).delete(`/customers/${customerId}`).expect(200);
    });
    it("should get a error 500 customer", async () =>{
        await request(app).delete("/customers/4").send({
        }).expect(500)
    })
    it("should get a error 404 customer", async () =>{
        await request(app).delete("/customers/663ba1e428abaf1a19c71e15").send({
        }).expect(404)
    })
 })
        