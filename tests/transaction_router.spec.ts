import "mocha";
import { Transaction } from "../src/models/transaction.js";
import { Customer } from "../src/models/customer.js";
import { Furniture } from "../src/models/furniture.js";
import { Provider } from "../src/models/provider.js";
import { expect } from "chai";
import request from "supertest";
import {app} from "../src/index.js";


describe("Test de transaction Router", () => {
    beforeEach(async()=>{
        await Furniture.deleteMany();
        await Customer.deleteMany();
        await Provider.deleteMany();
        await Transaction.deleteMany();
     })
     it("should create a new transaction customer", async () => {
      await request(app).post("/customers").send({
       "name": "Francisco Felipe Martin",
       "nif": "44444444W",
       "email": "alu1111111111@ull.edu.es",
       "mobilePhone": 123456789,
       "address": "Camino El Pino"
      })
      const Armario=await request(app).post("/furnitures").send({
      "name": "Armario Normal",
      "description": "Silla un armario normal",
      "material": "Madera",
      "color": "negro",
      "price": 50,
      "type": "Armario",
       "stock": 10        
      })
      const res=await request(app).post("/transactions").send({
        "customerNIF": "44444444W",
        "type": "SALE",
        "furnitureList": [
        {
           "furnitureId": String(Armario.body._id),
            "quantity": 5
        }
        ] 
      }).expect(201)
      expect(res.body.customerNIF).to.equal('44444444W');
      expect(res.body.type).to.equal('SALE');
      expect(res.body.furnitureList.length).to.equal(1);
      expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
      expect(res.body.furnitureList[0].quantity).to.equal(5);
     })
    it("should create a new transaction provider",async()=>{
        await request(app).post("/providers").send({
            "name": "Francisco Felipe Martin",
            "cif": "W44444444",
            "email": "alu1111111111@ull.edu.es",
            "mobilePhone": 123456789,
            "address": "Camino El Pino"
           })
           const Armario=await request(app).post("/furnitures").send({
           "name": "Armario Normal 1",
           "description": "Silla un armario normal",
           "material": "Madera",
           "color": "negro",
           "price": 50,
           "type": "Armario",
            "stock": 10        
           })
           const res=await request(app).post("/transactions").send({
             "providerCIF": "W44444444",
             "type": "PURCHASE",
             "furnitureList": [
             {
                "furnitureId": String(Armario.body._id),
                 "quantity": 5
             }
             ] 
           }).expect(201)     
           expect(res.body.providerCIF).to.equal("W44444444");
           expect(res.body.type).to.equal("PURCHASE");
           expect(res.body.furnitureList.length).to.equal(1);
           expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
           expect(res.body.furnitureList[0].quantity).to.equal(5);   
    })
    it("should create a new transaction error 404 to customer", async () => {
        const res=await request(app).post("/transactions").send({
          "customerNIF": "44442444W",
          "type": "SALE",
          "furnitureList": [
          {
             "furnitureId": "44444444444444444",
              "quantity": 5
          }
          ] 
        }).expect(404)
        expect(res.body.error).to.be.equal('Customer not found')        
       })
       it("should create a new transaction error 404 provider", async () => {
        const res = await request(app).post("/transactions").send({
          "providerCIF": "W44442444",
          "type": "PURCHASE",
          "furnitureList": [
          {
             "furnitureId": "44444444444444444",
              "quantity": 5
          }
          ] 
        }).expect(404)
        expect(res.body.error).to.be.equal('Supplier not found')  
       })
       it("should create a new transaction error 404 provider",async()=>{
        await request(app).post("/providers").send({
            "name": "Francisco Felipe Martin",
            "cif": "W44444444",
            "email": "alu1111111111@ull.edu.es",
            "mobilePhone": 123456789,
            "address": "Camino El Pino"
           })
           const Armario=await request(app).post("/furnitures").send({
           "name": "Armario Normal 2",
           "description": "Silla un armario normal",
           "material": "Madera",
           "color": "negro",
           "price": 50,
           "type": "Armario",
            "stock": 10        
           })
           await request(app).post("/transactions").send({
             "providerCIF": "W44444444",
             "type": "ERROR",
             "furnitureList": [
             {
                "furnitureId": String(Armario.body._id),
                 "quantity": 5
             }
             ] 
           }).expect(400)        
    })
    it("shoul error create a new transaction provider Furniture list not provided",async()=>{
        await request(app).post("/providers").send({
            "name": "Francisco Felipe Martin",
            "cif": "W44444444",
            "email": "alu1111111111@ull.edu.es",
            "mobilePhone": 123456789,
            "address": "Camino El Pino"
           })
           const res=await request(app).post("/transactions").send({
             "providerCIF": "W44444444",
             "type": "PURCHASE",
             "furnitureList": [ ] 
           }).expect(400)   
           expect(res.body.error).to.be.equal('Furniture list must be provided')     
    })
    it("should create a new transaction error CIF no exists provider",async()=>{
        await request(app).post("/providers").send({
            "name": "Francisco Felipe Martin",
            "cif": "W44444444",
            "email": "alu1111111111@ull.edu.es",
            "mobilePhone": 123456789,
            "address": "Camino El Pino"
           })
           const Armario=await request(app).post("/furnitures").send({
           "name": "Armario Normal 3",
           "description": "Silla un armario normal",
           "material": "Madera",
           "color": "negro",
           "price": 50,
           "type": "Armario",
            "stock": 10        
           })
           const res=await request(app).post("/transactions").send({
             "type": "PURCHASE",
             "furnitureList": [
             {
                "furnitureId": String(Armario.body._id),
                 "quantity": 5
             }
             ] 
           }).expect(400)    
           expect(res.body.error).to.be.equal('Provider CIF is required for PURCHASE transactions')                   
    })  
    it("should create a new transaction error customer", async () => {
        await request(app).post("/customers").send({
         "name": "Francisco Felipe Martin",
         "nif": "74444444W",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        const res=await request(app).post("/transactions").send({
          "customerNIF": "74444444W",
          "type": "SALE",
          "furnitureList": [
          {
             "furnitureId": "6637c607664f4a696e78f880",
              "quantity": 5
          }
          ] 
        }).expect(404)
        expect(res.body.error).to.be.equal('Furniture not found')
       }) 
       it("should create a new transaction error customer", async () => {
        await request(app).post("/customers").send({
         "name": "Francisco Felipe Martin",
         "nif": "64444444W",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        await request(app).post("/transactions").send({
          "customerNIF": "64444444W",
          "type": "SALE",
          "furnitureList": [
          {
             "furnitureId": 7,
              "quantity": 5
          }
          ] 
        }).expect(500)
       }) 
       it("should get a transaction customer", async () => {
        await request(app).post("/customers").send({
         "name": "Francisco Felipe Martin",
         "nif": "54444444W",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        const Armario=await request(app).post("/furnitures").send({
            "name": "Armario Normal 4",
            "description": "Silla un armario normal",
            "material": "Madera",
            "color": "negro",
            "price": 50,
            "type": "Armario",
             "stock": 10        
        })
        const res=await request(app).post("/transactions").send({
            "customerNIF": "54444444W",
            "type": "SALE",
            "furnitureList": [
            {
               "furnitureId": String(Armario.body._id),
                "quantity": 5
            }
            ] 
          })
        await request(app).get("/transactions?nif=54444444W").send({

        }).expect(200)
        expect(res.body.customerNIF).to.equal("54444444W");
        expect(res.body.type).to.equal("SALE");
        expect(res.body.furnitureList.length).to.equal(1);
        expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
        expect(res.body.furnitureList[0].quantity).to.equal(5);  
       })
       it("should get a transaction provider", async () => {
        await request(app).post("/providers").send({
         "name": "Francisco Felipe Martin",
         "cif": "W14444444",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        const Armario=await request(app).post("/furnitures").send({
            "name": "Armario Normal 4",
            "description": "Silla un armario normal",
            "material": "Madera",
            "color": "negro",
            "price": 50,
            "type": "Armario",
             "stock": 10        
        })
        const res=await request(app).post("/transactions").send({
            "providerCIF": "W14444444",
            "type": "PURCHASE",
            "furnitureList": [
            {
               "furnitureId": String(Armario.body._id),
                "quantity": 5
            }
            ] 
          })
        await request(app).get("/transactions?cif=W14444444").send({

        }).expect(200)
        expect(res.body.providerCIF).to.equal("W14444444");
        expect(res.body.type).to.equal("PURCHASE");
        expect(res.body.furnitureList.length).to.equal(1);
        expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
        expect(res.body.furnitureList[0].quantity).to.equal(5); 
       })
       it("should get a transaction provider error", async () => {
        await request(app).post("/providers").send({
         "name": "Francisco Felipe Martin",
         "cif": "W11444444",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        await request(app).get("/transactions?cif=W11444444").send({

        }).expect(404)
       })
       it("should get a transaction provider error cif", async () => {
        await request(app).get("/transactions?cif=W00444444").send({

        }).expect(404)
       })
       it("should get a transaction provider error nif", async () => {
        await request(app).get("/transactions?nif=00444444W").send({

        }).expect(404)
       })   
       it("should update a  transaction customer", async () => {
        await request(app).post("/customers").send({
         "name": "Francisco Felipe Martin",
         "nif": "44444454W",
         "email": "alu1111111111@ull.edu.es",
         "mobilePhone": 123456789,
         "address": "Camino El Pino"
        })
        const Armario=await request(app).post("/furnitures").send({
        "name": "Armario Normal 4",
        "description": "Silla un armario normal",
        "material": "Madera",
        "color": "negro",
        "price": 50,
        "type": "Armario",
         "stock": 10        
        })
        const Armario2=await request(app).post("/furnitures").send({
          "name": "Armario Normal 5",
          "description": "Silla un armario normal",
          "material": "Madera",
          "color": "negro",
          "price": 100,
          "type": "Armario",
           "stock": 15        
          })
        const transaccion=await request(app).post("/transactions").send({
          "customerNIF": "44444454W",
          "type": "SALE",
          "furnitureList": [
          {
             "furnitureId": String(Armario.body._id),
              "quantity": 5
          }
          ] 
        })
        const res=await request(app).patch("/transactions/" + String(transaccion.body._id)).send({
          "furnitureList": [
            {
              "furnitureId": String(Armario.body._id),
               "quantity": 5
            },
            {
               "furnitureId": String(Armario2.body._id),
                "quantity": 4
            }
            ]           
         }).expect(200)
         expect(res.body.customerNIF).to.equal("44444454W");
         expect(res.body.type).to.equal("SALE");
         expect(res.body.furnitureList.length).to.equal(2);
         expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
         expect(res.body.furnitureList[0].quantity).to.equal(5);
         expect(res.body.furnitureList[1].furnitureId).to.be.equal(String(Armario2.body._id));
         expect(res.body.furnitureList[1].quantity).to.equal(4);
     });
     it("should update a  transaction provider",async()=>{
      await request(app).post("/providers").send({
          "name": "Francisco Felipe Martin",
          "cif": "W44444444",
          "email": "alu1111111111@ull.edu.es",
          "mobilePhone": 123456789,
          "address": "Camino El Pino"
         })
         const Armario=await request(app).post("/furnitures").send({
         "name": "Armario Normal 6",
         "description": "Silla un armario normal",
         "material": "Madera",
         "color": "negro",
         "price": 50,
         "type": "Armario",
          "stock": 10        
         })
         const Armario2=await request(app).post("/furnitures").send({
          "name": "Armario Normal 7",
          "description": "Silla un armario normal",
          "material": "Madera",
          "color": "negro",
          "price": 50,
          "type": "Armario",
           "stock": 10        
          })
         const transaccion=await request(app).post("/transactions").send({
           "providerCIF": "W44444444",
           "type": "PURCHASE",
           "furnitureList": [
           {
              "furnitureId": String(Armario.body._id),
               "quantity": 5
           }
           ] 
         })
         const res=await request(app).patch("/transactions/" + String(transaccion.body._id)).send({
          "furnitureList": [
            {
              "furnitureId": String(Armario.body._id),
               "quantity": 5
            },
            {
               "furnitureId": String(Armario2.body._id),
                "quantity": 4
            }
            ]           
         }).expect(200)   
         expect(res.body.providerCIF).to.equal("W44444444");
         expect(res.body.type).to.equal("PURCHASE");
         expect(res.body.furnitureList.length).to.equal(2);
         expect(res.body.furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
         expect(res.body.furnitureList[0].quantity).to.equal(5);
         expect(res.body.furnitureList[1].furnitureId).to.equal(String(Armario2.body._id));
         expect(res.body.furnitureList[1].quantity).to.equal(4);
         })    
         it("should error update a  transaction 500",async()=>{
            await request(app).patch("/transactions/4").send().expect(500)
          })
          it("should error update a  transaction 404",async()=>{
            await request(app).patch("/transactions/6637c5f5664d4a696e58f87e").send().expect(404)
          })                  
          it("should update a  transaction provider",async()=>{
            await request(app).post("/providers").send({
                "name": "Francisco Felipe Martin",
                "cif": "W44444444",
                "email": "alu1111111111@ull.edu.es",
                "mobilePhone": 123456789,
                "address": "Camino El Pino"
               })
               const Armario=await request(app).post("/furnitures").send({
               "name": "Armario Normal 7",
               "description": "Silla un armario normal",
               "material": "Madera",
               "color": "negro",
               "price": 50,
               "type": "Armario",
                "stock": 10        
               })
               const transaccion=await request(app).post("/transactions").send({
                 "providerCIF": "W44444444",
                 "type": "PURCHASE",
                 "furnitureList": [
                 {
                    "furnitureId": String(Armario.body._id),
                     "quantity": 5
                 }
                 ] 
               })
               await request(app).patch("/transactions/" + String(transaccion.body._id)).send({
                "furnitureList": [
                  {
                     "furnitureId": "6637c5f5664d4a696e58f87e",
                      "quantity": 4
                  }
                  ]           
               }).expect(500)   
      })  
    it('should delete a  transaction',async() =>{
      await request(app).post("/providers").send({
        "name": "Francisco Felipe Martin",
        "cif": "W44447444",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })
       const Armario=await request(app).post("/furnitures").send({
       "name": "Armario Normal 7",
       "description": "Silla un armario normal",
       "material": "Madera",
       "color": "negro",
       "price": 50,
       "type": "Armario",
        "stock": 10        
       })
       const transaccion=await request(app).post("/transactions").send({
         "providerCIF": "W44447444",
         "type": "PURCHASE",
         "furnitureList": [
         {
            "furnitureId": String(Armario.body._id),
             "quantity": 5
         }
         ] 
       }) 
       const res = await request(app).delete("/transactions/" + String(transaccion.body._id)).send().expect(200)    
       expect(res.body.message).to.equal('Transaction deleted and stock adjusted successfully.' );
    })
    it('should error 500 delete a  transaction',async() =>{
      const res=await request(app).delete("/transactions/4").expect(500)
      expect(res.body.message).to.equal('Error deleting transaction: Cast to ObjectId failed for value "4" (type string) at path "_id" for model "Transaction"' );
    }) 
    it('should error 404 delete a  transaction',async() =>{
      await request(app).delete("/transactions/6637c5f5664d4a696e58f87e").expect(404)
    })
    it('should error tranaction becuose not exits furtniture',async() =>{
      await request(app).post("/providers").send({
        "name": "Francisco Felipe Martin",
        "cif": "W44447744",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })
       const Armario=await request(app).post("/furnitures").send({
       "name": "Armario Normal8",
       "description": "Silla un armario normal",
       "material": "Madera",
       "color": "negro",
       "price": 50,
       "type": "Armario",
        "stock": 10        
       })
       const Armario2=await request(app).post("/furnitures").send({
        "name": "Armario Normal5",
        "description": "Silla un armario normal",
        "material": "Madera",
        "color": "negro",
        "price": 50,
        "type": "Armario",
         "stock": 15       
        })       
       const transaccion=await request(app).post("/transactions").send({
         "providerCIF": "W44447744",
         "type": "PURCHASE",
         "furnitureList": [
         {
            "furnitureId": String(Armario.body._id),
             "quantity": 5
         },
         {
          "furnitureId": String(Armario2.body._id),
          "quantity": 4          
         }
         ] 
       }) 
       await  request(app).delete("/furnitures/" +  String(Armario.body._id)).send();
       await request(app).delete("/transactions/" + String(transaccion.body._id)).send().expect(404)     
    })
    it('should error tranaction 400 not stock',async() =>{
      await request(app).post("/providers").send({
        "name": "Francisco Felipe Martin",
        "cif": "W44448744",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })
       await request(app).post("/customers").send({
        "name": "Francisco Felipe Martin",
        "nif": "94449944W",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })
       const Armario=await request(app).post("/furnitures").send({
        "name": "Armario Normal5",
        "description": "Silla un armario normal",
        "material": "Madera",
        "color": "negro",
        "price": 50,
        "type": "Armario",
         "stock": 1       
        })
        const transtaccion=await request(app).post("/transactions").send({
          "providerCIF": 'W44448744',
          "type": 'PURCHASE',
          "furnitureList": [
          {
             "furnitureId": String(Armario.body._id),
              "quantity": 5
          }
          ] 
        })
         await request(app).post("/transactions").send({
          "customerNIF": "94449944W",
          "type": 'SALE',
          "furnitureList": [
          {
             "furnitureId": String(Armario.body._id),
              "quantity": 3
          }
          ] 
        })
        await request(app).delete("/transactions/" + String(transtaccion.body._id)).send().expect(400)                           
    })
    it('should get query',async()=>{
      await request(app).post("/providers").send({
        "name": "Francisco Felipe Martin",
        "cif": "W44448754",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })
       const Armario=await request(app).post("/furnitures").send({
        "name": "Armario Normal5",
        "description": "Silla un armario normal",
        "material": "Madera",
        "color": "negro",
        "price": 50,
        "type": "Armario",
         "stock": 1       
        }) 
        await request(app).post("/transactions").send({
          "providerCIF": 'W44448754',
          "type": 'PURCHASE',
          "furnitureList": [
          {
             "furnitureId": String(Armario.body._id),
              "quantity": 5
          }
          ] 
        })
        const res=await request(app).get("/transactions?providerCIF=W44448754").send().expect(200)      
        expect(res.body[0].providerCIF).to.equal("W44448754");
        expect(res.body[0].type).to.equal("PURCHASE");
        expect(res.body[0].furnitureList.length).to.equal(1);
        expect(res.body[0].furnitureList[0].furnitureId).to.equal(String(Armario.body._id));
        expect(res.body[0].furnitureList[0].quantity).to.equal(5);       
    })
    it('should get query error cif',async()=>{
      const res=await request(app).get("/transactions?customerNIF=7").send().expect(404)  
      expect(res.body.message).to.be.equal('No customer found with NIF: 7')
    })
    it('should get query error nif',async()=>{
      const res=await request(app).get("/transactions?providerCIF=7").send().expect(404)  
      expect(res.body.message).to.be.equal('No provider found with CIF: 7')
    })
    it('should get query error tansaccion no found',async()=>{
      await request(app).post("/providers").send({
        "name": "Francisco Felipe Martin",
        "cif": "W04448754",
        "email": "alu1111111111@ull.edu.es",
        "mobilePhone": 123456789,
        "address": "Camino El Pino"
       })  
      const res=await request(app).get("/transactions?providerCIF=W04448754").send().expect(404)  
      expect(res.body.message).to.be.equal('No transactions found for the provided identifiers.')
    }) 
  // it('should get date',async() =>{
  //   await request(app).post("/providers").send({
  //     "name": "Francisco Felipe Martin",
  //     "cif": "W44448754",
  //     "email": "alu1111111111@ull.edu.es",
  //     "mobilePhone": 123456789,
  //     "address": "Camino El Pino"
  //    })
  //    const Armario=await request(app).post("/furnitures").send({
  //     "name": "Armario Normal5",
  //     "description": "Silla un armario normal",
  //     "material": "Madera",
  //     "color": "negro",
  //     "price": 50,
  //     "type": "Armario",
  //      "stock": 1       
  //     }) 
  //     await request(app).post("/transactions").send({
  //       "providerCIF": 'W44448754',
  //       "type": 'PURCHASE',
  //       "furnitureList": [
  //       {
  //          "furnitureId": String(Armario.body._id),
  //           "quantity": 5
  //       }
  //       ] 
  //     }) 
  //     await request(app).get("/transactions/by-date?startDate=2024-05-09&endDate=2024-05-11&type=PURCHASE").expect(200)


  // })   
  it('should error get date 500 internal server',async() =>{
    await request(app).post("/providers").send({
      "name": "Francisco Felipe Martin",
      "cif": "W44448754",
      "email": "alu1111111111@ull.edu.es",
      "mobilePhone": 123456789,
      "address": "Camino El Pino"
     })
     const Armario=await request(app).post("/furnitures").send({
      "name": "Armario Normal5",
      "description": "Silla un armario normal",
      "material": "Madera",
      "color": "negro",
      "price": 50,
      "type": "Armario",
       "stock": 1       
      }) 
      await request(app).post("/transactions").send({
        "providerCIF": 'W44448754',
        "type": 'PURCHASE',
        "furnitureList": [
          {
            "furnitureId": String(Armario.body._id),
            "quantity": 5
          }
        ] 
      }) 
      await request(app).get("/transactions/by-date?startDate=2024-05-09&endDate=20x4-05-11&type=PURCHASE").expect(500)
   
  })
  it('should error get date 404 not found',async() =>{
    await request(app).post("/providers").send({
      "name": "Francisco Felipe Martin",
      "cif": "W44448754",
      "email": "alu1111111111@ull.edu.es",
      "mobilePhone": 123456789,
      "address": "Camino El Pino"
     })
     const Armario=await request(app).post("/furnitures").send({
      "name": "Armario Normal5",
      "description": "Silla un armario normal",
      "material": "Madera",
      "color": "negro",
      "price": 50,
      "type": "Armario",
       "stock": 1       
      }) 
      await request(app).post("/transactions").send({
        "providerCIF": 'W44448754',
        "type": 'PURCHASE',
        "furnitureList": [
        {
           "furnitureId": String(Armario.body._id),
            "quantity": 5
        }
        ] 
      }) 
      const res=await request(app).get("/transactions/by-date?startDate=2024-05-10&endDate=2024-05-10&type=PURCHASE").expect(404)

      expect(res.body.error).to.be.equal('No transactions found')
  })
  it('should error get date 400 not query',async() =>{
    await request(app).post("/providers").send({
      "name": "Francisco Felipe Martin",
      "cif": "W44448754",
      "email": "alu1111111111@ull.edu.es",
      "mobilePhone": 123456789,
      "address": "Camino El Pino"
     })
     const Armario=await request(app).post("/furnitures").send({
      "name": "Armario Normal5",
      "description": "Silla un armario normal",
      "material": "Madera",
      "color": "negro",
      "price": 50,
      "type": "Armario",
       "stock": 1       
      }) 
      await request(app).post("/transactions").send({
        "providerCIF": 'W44448754',
        "type": 'PURCHASE',
        "furnitureList": [
        {
           "furnitureId": String(Armario.body._id),
            "quantity": 5
        }
        ] 
      }) 
      const res=await request(app).get("/transactions/by-date?endDate=2024-05-10&type=PURCHASE").expect(400)
      expect(res.body.error).to.be.equal('Both start date and end date must be provided')
  })
})
