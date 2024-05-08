import "mocha";
import { Customer } from "../src/models/customer.js";
import request from "supertest";
import {app} from "../src/index.js";

describe("Test de customer Router", () => {
    beforeEach(async () => {
        await Customer.deleteMany({});
    });
    it("should create a new customer", async () => {
      await request(app).post("/customers").send({
      "name": "Rafa Nadal",
      "nif": "22222222W",
      "email": "rafa@gmail.com",
      "mobilePhone": 222222222,
      "address": "Calle Manacor"
      }).expect(201)
    })
    it("should create a new customer error", async () => {
        await request(app).post("/customers").send({
        "email": "rafa@gmail.com",
        "mobilePhone": 222222222,
        "address": "Calle Manacor"
        }).expect(500)
    })
    it("should update a customer", async () => {
        await request(app).post("/customers").send({
            "name": "RafaNadal",
            "nif": "22222224A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).patch("/customers?nif=22222224A").send({
            "name": "Rafa modificado"
        }).expect(200)
    })
    it("should update a customer error query", async () => {
        await request(app).post("/customers").send({
            "name": "Rafa1 ",
            "nif": "22222223A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
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
        const response=await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222229A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            }).expect(201)
        await request(app).patch("/customers/"+ String(response.body._id)).send({
            "name": "Rafa modificado"
        }).expect(200)
    })
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
            })
        await request(app).get("/customers?nif=22222230A").send({
        }).expect(200)
    })   
    it("should get a error 404 customer", async () =>{

        await request(app).get("/customers?nif=4").send({
        }).expect(404)
    })
    it("should get a customer", async () => {
        const response=await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222230A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).get("/customers/" + String(response.body._id)).send({
        }).expect(200)
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
            })
        await request(app).delete("/customers?nif=22222240A").send({
        }).expect(200)
    })
    it("should delete a customer with query error", async () => {
        await request(app).delete("/customers").send({
        }).expect(400)
    })
    it("should delete a customer with query error 404", async () => {
        await request(app).delete("/customers?nif=4").send({
        }).expect(404)
    })
    it("should get a customer", async () => {
        const response=await request(app).post("/customers").send({
            "name": "Rafa Nadal",
            "nif": "22222210A",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).delete("/customers/" + String(response.body._id)).send({
        }).expect(200)
    })  
    it("should get a error 500 customer", async () =>{

        await request(app).delete("/customers/4").send({
        }).expect(500)
    })
    it("should get a error 404 customer", async () =>{

        await request(app).delete("/customers/663ba1e428abaf1a19c71e15").send({
        }).expect(404)
    })
})
        