import "mocha";
import { Provider } from "../src/models/provider.js";
import request from "supertest";
import {app} from "../src/index.js";

describe("Test de provider Router", () => {
    beforeEach(async () => {
        await Provider.deleteMany({});
    });
    it("should create a new provider", async () => {
      await request(app).post("/providers").send({
      "name": "Rafa Nadal",
      "cif": "W22222222",
      "email": "rafa@gmail.com",
      "mobilePhone": 222222222,
      "address": "Calle Manacor"
      }).expect(201)
    })
    it("should create a new provider error", async () => {
        await request(app).post("/providers").send({
        "email": "rafa@gmail.com",
        "mobilePhone": 222222222,
        "address": "Calle Manacor"
        }).expect(500)
    })
    it("should update a provider", async () => {
        await request(app).post("/providers").send({
            "name": "RafaNadal",
            "cif": "W22222224",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).patch("/providers?cif=W22222224").send({
            "name": "Rafa modificado"
        }).expect(200)
    })
    it("should update a provider error query", async () => {
        await request(app).post("/providers").send({
            "name": "Rafa1 ",
            "cif": "W22222223",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).patch("/providers").send({
            "name": "Rafa modificado"
        }).expect(400)
    })
    it("should update a provider error 400 body", async () => {
        await request(app).patch("/providers/W22222223").send({
            "error": "Rafa modificado"
        }).expect(400)
    })
    it("should update a provider error 404", async () => {
        await request(app).patch("/providers?cif=W22222229").send({
            "name": "Rafa modificado"
        }).expect(404)
    })
    it("should update id a provider", async () => {
        const response=await request(app).post("/providers").send({
            "name": "Rafa Nadal",
            "cif": "W22222229",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            }).expect(201)
        await request(app).patch("/providers/"+ String(response.body._id)).send({
            "name": "Rafa modificado"
        }).expect(200)
    })
    it("should update id a provider error", async () => {
        await request(app).patch("/providers/1").send({
            "name": "Rafa modificado"
        }).expect(500)
    })
    it("should update id a provider error", async () => {
        await request(app).patch("/providers/663ba1e428abaf1a19c71e15").send({
            "name": "Rafa modificado"
        }).expect(404)
    })
    it("should get a provider", async () => {
        await request(app).post("/providers").send({
            "name": "Rafa Nadal",
            "cif": "W22222230",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).get("/providers?cif=W22222230").send({
        }).expect(200)
    })   
    it("should get a error 404 provider", async () =>{

        await request(app).get("/providers?cif=4").send({
        }).expect(404)
    })
    it("should get a provider", async () => {
        const response=await request(app).post("/providers").send({
            "name": "Rafa Nadal",
            "cif": "W22222230",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).get("/providers/" + String(response.body._id)).send({
        }).expect(200)
    })
    it("should get a error 500 provider", async () =>{

        await request(app).get("/providers/4").send({
        }).expect(500)
    })
    it("should get a error 404 provider", async () =>{

        await request(app).get("/providers/663ba1e428abaf1a19c71e15").send({
        }).expect(404)
    })
    it("should delete a provider with query", async () => {
        await request(app).post("/providers").send({
            "name": "Rafa Nadal",
            "cif": "W22222240",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).delete("/providers?cif=W22222240").send({
        }).expect(200)
    })
    it("should delete a provider with query error", async () => {
        await request(app).delete("/providers").send({
        }).expect(400)
    })
    it("should delete a provider with query error 404", async () => {
        await request(app).delete("/providers?cif=4").send({
        }).expect(404)
    })
    it("should get a provider", async () => {
        const response=await request(app).post("/providers").send({
            "name": "Rafa Nadal",
            "cif": "W22222210",
            "email": "rafa@gmail.com",
            "mobilePhone": 222222222,
            "address": "Calle Manacor"
            })
        await request(app).delete("/providers/" + String(response.body._id)).send({
        }).expect(200)
    })  
    it("should get a error 500 provider", async () =>{

        await request(app).delete("/providers/4").send({
        }).expect(500)
    })
    it("should get a error 404 provider", async () =>{

        await request(app).delete("/providers/663ba1e428abaf1a19c71e15").send({
        }).expect(404)
    })
})
        