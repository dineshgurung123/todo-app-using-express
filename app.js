const express = require('express')
const { readFile } = require('fs')
const path = require('path')
const  {createClient}   = require('@supabase/supabase-js')
const { error } = require('console')
const { ifError } = require('assert')
const { devNull, type } = require('os')

const mongoose = require('mongoose')

try {
  

  mongoose.connect('mongodb+srv://root:sspear54321@todos.umqh6.mongodb.net/?retryWrites=true&w=majority&appName=todos')

   console.log("Conected mongodb")

} catch (error) {
  console.log("Err", error)
  
}

const todoSchema = new mongoose.Schema({

title :{
  type : String
},

note :{
  type : String
},

completed : {
  type : Boolean
}

})

  const Todos = mongoose.model('todos', todoSchema)

const port = 5000


const app = express()

app.use(express.json()) //body parser
 



app.get('/todos' , async(req, res)=>{
 
    try {
      
      const todos = await Todos.find()

      res.status(200).send(todos)

    } catch (error) {
      res.status(404).send('err', error)
    }

})

app.get('/todos/:id',  async(req, res)=>{
      const {id} = req.params 
 
       try {
        
       const todos  =   await Todos.findById(id)     
     res.status(200).send(todos)

       } catch (error) {
        res.status(404).send("Error", error)
       }
   
})

app.post('/todos', async(req, res)=>{

const {title, note, completed}= req.body

 

 const todos = new Todos({

  title,
  note,
  completed
})

    await todos.save()   // saved a data to the database
   res.status(201).send(`todo created ${todos}`)
})


app.put('/todos/:id', async(req, res)=>{

const {id} = req.params
const {title, note} = req.body

      const updatedTodo  =  await Todos.findByIdAndUpdate(
        id, 
        {
          title:title,
          note : note
        }
      )

     if(!updatedTodo){

     return res.send(201).send("Not found")
     }

     res.status(200).send(`Todo updated ${updatedTodo}`)

})

app.delete('/todos/:id', async(req, res)=>{

     const {id} = req.params
       try {
        await Todos.findByIdAndDelete(id)
        console.log("Successfully deleted")
        res.send("Deleted successfully")
     
       } catch (error) {
         res.status(500).send(error)
       }

})

app.delete('/todos' , async(req, res)=>{
      
  try {

    const todoDeleted =  await Todos.deleteMany({})
    console.log(todoDeleted)
    res.status(200).send("Todo deleted")
    
  } catch (error) {
    res.send("Error", error)
  }
    

    
})



app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})