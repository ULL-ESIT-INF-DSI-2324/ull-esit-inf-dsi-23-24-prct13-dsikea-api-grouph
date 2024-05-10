import "mocha";
import { Furniture } from "../src/models/furniture.js";
import request from "supertest";
import { expect } from "chai";
import {app} from "../src/index.js";


describe('Test de furniture Router',() =>{
    beforeEach(async()=>{
       await Furniture.deleteMany();
    })
    it('debería añadir un nuevo mueble',async()=>{
       const res= await request(app).post('/furnitures').send({
       "name": "Silla de Escritorio",
       "description": "Silla para estudiar por muchas horas",
       "material": "Plastico",
       "color": "negro",
       "price": 50,
       "type": "Silla",
       "stock": 10
       }).expect(201)
       const expectavie={
        "name": "Silla de Escritorio",
        "description": "Silla para estudiar por muchas horas",
        "material": "Plastico",
        "color": "negro",
        "price": 50,
        "type": "Silla",
        "stock": 10
        }
      expect(res.body).to.include(expectavie) 
    })
    it('debería dar error al añadir mueble',async()=>{
        await request(app).post('/furnitures').send({
        "description": "Silla para estudiar por muchas horas",
        "material": "Plastico",
        "color": "negro",
        "price": 50,
        "type": "Silla",
        "stock": 10
        }).expect(500)
     })
     it('debería dar error con un precio negativo',async()=>{
        await request(app).post('/furnitures').send({
        "name": "Silla de Escritorio",
        "description": "Silla para estudiar por muchas horas",
        "material": "Plastico",
        "color": "negro",
        "price": -1,
        "type": "Silla",
        "stock": 10
        }).expect(500)
     })
    //  it('debería modifcar el mueble',async()=>{
    //     await request(app).post('/furnitures').send({
    //         "name": "Mesa de Escritorio",
    //         "description": "Mesa para estudiar por muchas horas",
    //         "material": "Plastico",
    //         "color": "negro",
    //         "price": 50,
    //         "type": "Silla",
    //         "stock": 10
    //         })
                
    //     const res=await request(app).patch('/furnitures?color=negro').send({
    //       "color":"blanco"
    //     }).expect(200)
    //       expect(res.body).to.deep.equal({ message: '1 furniture(s) updated' }) 
    //  })
     it('debería dar error por un mal parametros por modifcar el mueble',async()=>{
        await request(app).post('/furnitures').send({
            "name": "Mesa de Cristal",
            "description": "Mesa de cristal para estudiar por muchas horas",
            "material": "Cristal",
            "color": "negro",
            "price": 50,
            "type": "Silla",
            "stock": 10
            })
            await request(app).patch('/furnitures?error=negro').send({
                "color":"blanco"
              }).expect(400)                
     })
     it('debería dar error a la hora de  modifcar el mueble',async()=>{
        await request(app).post('/furnitures').send({
            "name": "Mesa de pruebs",
            "description": "Mesa de prueba",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Silla",
            "stock": 10
            })
                
        await request(app).patch('/furnitures?color=negro').send({
          "error":"blanco"
        }).expect(400)
     })     
     it('debería dar error a  por no encontrar el mueble',async()=>{
        await request(app).patch('/furnitures?color=verde').send({
            "color":"blanco"
          }).expect(404)        
     })
     it('debería modificar el mueble por id',async()=>{
        const response = await request(app).post('/furnitures').send({
            "name": "Mesa test",
            "description": "Mesa de test",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Silla",
            "stock": 10
            })
        const res=await request(app).patch('/furnitures/' + String(response.body._id)).send({
            "color":"blanco"
        }).expect(200)  
        const expectavie={
            "name": "Mesa test",
            "description": "Mesa de test",
            "material": "Plastico",
            "color": "blanco",
            "price": 50,
            "type": "Silla",
            "stock": 10
            }
          expect(res.body).to.include(expectavie)    
     })
     it('deberia dar error por atualizar un id  inexistente',async()=>{

        await request(app).patch('/furnitures/0').send({
            "color":"blanco"
        }).expect(500)             
     })
     it('deberia dar error por atualizar por un error',async()=>{

        await request(app).patch('/furnitures/0').send({
            "error":"blanco"
        }).expect(400)             
     })    
     it('deberia devolver el  muebles por id',async()=>{
        const response = await request(app).post('/furnitures').send({
            "name": "Mesa",
            "description": "Mesa",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Silla",
            "stock": 10
            })
        const res=await request(app).get('/furnitures/'+ String(response.body._id)).send({
        }).expect(200)
        const expectavie={
            "name": "Mesa",
            "description": "Mesa",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Silla",
            "stock": 10
            }
          expect(res.body).to.include(expectavie) 
     })
     it('deberia devolver error  el  muebles por 404',async()=>{
        await request(app).get('/furnitures/663ba1e428abaf1a19c71e15').send({
        }).expect(404)
     })
     it('deberia devolver el  muebles por error interno',async()=>{
        await request(app).get('/furnitures/0').send({
        }).expect(500)
     })
     it('deberia devolver un mueble por query',async()=>{
         await request(app).post('/furnitures').send({
            "name": "Mesa4",
            "description": "Mesa",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Mesa",
            "stock": 10
            }) 
            const res=await request(app).get('/furnitures?name=Mesa4').send({
                
            }).expect(200) 
            const expectavie=[
                {
                  name: 'Mesa4',
                  description: 'Mesa',
                  material: 'Plastico',
                  color: 'negro',
                  price: 50,
                  type: 'Mesa',
                  stock: 10,
                  __v: 0
                }
              ]
              expect(res.body[0]).to.deep.include(expectavie[0])               
     })
     it('deberia devolver error por query por get',async()=>{
           await request(app).get('/furnitures?name=a').send({
               
           }).expect(404)               
    })

    it('debería borrar el mueble',async()=>{
        await request(app).post('/furnitures').send({
            "name": "Mesa4",
            "description": "Mesa",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Mesa",
            "stock": 10
            }) 
        const res=await request(app).delete('/furnitures?name=Mesa4').send({
        }).expect(200) 
          expect(res.body).to.deep.equal({ message: '1 furniture(s) deleted' })   
    })
    it('debería dar error por borrar el mueble',async()=>{
        await request(app).delete('/furnitures').send({
        }).expect(400)     
    })
    it('debería borrar el mueble por id',async() =>{
        const response= await request(app).post('/furnitures').send({
            "name": "Mesa5",
            "description": "Mesa",
            "material": "Plastico",
            "color": "negro",
            "price": 50,
            "type": "Mesa",
            "stock": 10
            }) 
        const res=await request(app).delete('/furnitures/'+ String(response.body._id)).send({
        }).expect(200)  
        const expectavie={
              name: 'Mesa5',
              description: 'Mesa',
              material: 'Plastico',
              color: 'negro',
              price: 50,
              type: 'Mesa',
              stock: 10
            }
          
          expect(res.body).to.deep.include(expectavie)      
    })
    it('debería dar error 500 borrar el mueble por id',async() =>{
        await request(app).delete('/furnitures/0').send({
        }).expect(500)         
    })
    it('debería dar error 404 borrar el mueble por id',async() =>{
        await request(app).delete('/furnitures/663ba1e428abaf1a19c71e15').send({
        }).expect(404)         
    })
})


