const express = require('express')
const { readFile } = require('fs')
const path = require('path')
const  {createClient}   = require('@supabase/supabase-js')
const { error } = require('console')
const { ifError } = require('assert')
const { devNull } = require('os')


const supabase = createClient('https://gszowrbrsqeeaaqjzuit.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzem93cmJyc3FlZWFhcWp6dWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MTk5NTUsImV4cCI6MjA1MjA5NTk1NX0.33dSkbZAI8gP5ZOoRTyfPJtONVPf4FHrC5orHJVF33E')




const fs = require('fs').promises
const port = 5000


const app = express()

app.use(express.json()) //body parser
 
const filepath = path.join(__dirname, 'todo.json')
 
const readTodos = async() =>{

 try {
     
    const data =  await fs.readFile(filepath, 'utf-8')
    return JSON.parse(data) 

 } catch (error) {
  
  console.error('Error reading file')
  return []
 }

}

const writeTodos = async(todos) =>{

try {
    
  await fs.writeFile(filepath, JSON.stringify(todos, null, 2))
  return []


} catch (error) {
  console.error("Error writing file", error)
}

}

app.get('/todos' , async(req, res)=>{
 

  // const {completed} = req.query
  //  const todos = await readTodos()

  // if (completed !== undefined) {
    
  //    const data =  todos.filter((t)=>t.completed.toString() === completed)
  //    return  res.send({todos: data})
  //   }
  console.log("Hello")
  const {data, error} = await supabase.from('todo').select('*')
      console.log(data)
     
      
  if(error){
    return res.status(400).json({error: error.message})
  }
  res.send({
    data
    
  })

})

app.get('/todos/:id',  async(req, res)=>{
      const {id} = req.params 

      // const todos = await readTodos()

        const   {data:todos, error} = await supabase.from('todo').select('*').eq('id', id)
       
      // const todo =  todos.find((current)=>current.id === Number(id))
       
     if(error){
       res.status(404).send({message: error})
     }
       
      res.status(200).send(todos)
})

app.post('/todos', async(req, res)=>{

const {title, note}= req.body


if(!title){
 return  res.status(400).send({message: "Title cannot be empty"})
}
// const todos = await readTodos()


const newTodo = {id : Date.now(), title: title, note: note, completed: false}


const {error} = await supabase.from('todo').insert({title: newTodo.title, note: newTodo.note, completed:newTodo.completed})

// todos.push(newTodo)

// await writeTodos(todos)

res.send("Todo created")
})

app.put('/todos/:id', async(req, res)=>{

const {id} = req.params

  // const todos =  await readTodos()

    const todo = todos.find((current)=>current.id === Number(id))
      
    if(!todo){
      res.send(404).send("Not found")
    }
    
    todo.completed = true
      
    // writeTodos(todos)
    res.send("Updated")

})

app.delete('/todos/:id', async(req, res)=>{

     const {id} = req.params
          //  let todos = await readTodos()
       
      //  let todo = todos.find((current)=>current.id === Number(id))
                
      const   {data:todos, error} = await supabase.from('todo').delete('*').eq('id', id)
       
       if(error){
         res.status(404).send({message:error})
       }
       
        // todos = todos.filter((c)=>c.id !== todo.id)

        // await writeTodos(todos)

        res.status(200).send({message : `todo with id deleted successfully`})
})

app.delete('/todos' , async(req, res)=>{
 
      // const todos = await  readTodos()

    const {data , error} =  await supabase.from('todo').delete().neq('id', 0)
          
    // .neq('completed', false)
      // await writeTodos([])
    
      if(error){

        return res.status(400).json({message: error})
      }

 res.status(200).send(`Todo deleted successfully`)
    
})



app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})