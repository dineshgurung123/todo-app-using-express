//To do

//1 add a new todo                        done        
//2 Remove a todo                          done
// 3. mark a todo as completed             done
//4. Reverse a the todo status              done 
//5. filter the todo                       done
//6. get all to do                          done
//7 get all completed todo                   done
//8 get all uncompleted todo                   done
//9 get todo by id                         done



const express = require('express')
const { readFile } = require('fs')
const path = require('path')


const fs = require('fs').promises
const port = 3000

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
 

  const {completed} = req.query
   const todos = await readTodos()

  if (completed !== undefined) {
    
     const data =  todos.filter((t)=>t.completed.toString() === completed)
     return  res.send({todos: data})
    }
  

  res.send({
    todos
  })

})

app.get('/todos/:id',  async(req, res)=>{

      const {id} = req.params

      const todos = await readTodos()
       
      const todo =  todos.find((current)=>current.id === Number(id))
       
     if(!todo){
      res.status(404).send("Not found")
     }
       
     res.status(200).send(todo)
})

app.post('/todos', async(req, res)=>{

const {title, note}= req.body

if(!title){
 return  res.status(400).send({message: "Title cannot be empty"})
}
const todos = await readTodos()


const newTodo = {id : Date.now(), title: title, note: note, completed: false}

todos.push(newTodo)

await writeTodos(todos)

res.send("Todo created")
})

app.put('/todos/:id', async(req, res)=>{

const {id} = req.params

  const todos =  await readTodos()

    const todo = todos.find((current)=>current.id === Number(id))
      
    if(!todo){
      res.send(404).send("Not found")
    }
    
    todo.completed = true
      
    writeTodos(todos)
    res.send("Updated")

})

app.delete('/todos/:id', async(req, res)=>{

     const {id} = req.params
           let todos = await readTodos()
       
       let todo = todos.find((current)=>current.id === Number(id))

       if(!todo){
         res.status(404).send("Data not available")
       }
       
        todos = todos.filter((c)=>c.id !== todo.id)

        await writeTodos(todos)

        res.status(200).send({message : `todo with id ${todo.id} deleted successfully`})
})

app.delete('/todos' , async(req, res)=>{
 
      const todos = await  readTodos()

  
      await writeTodos([])
 res.status(200).send(`Todo deleted successfully`)
    
})

app.get('/')

app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})