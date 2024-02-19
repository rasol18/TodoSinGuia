
const todoList = [];
function createTodo (text){
    if(text === ""){
     return console.log('esta vacio')
    }else {
      const todo = {
        task: text.trim(),
        state: 'pending'
      }
      todoList.push(todo);
      document.getElementById('main').style.display="";
      document.getElementById('footer').style.display="";
    return todoList
    }
}

const pendingTodo = []
function ListTodo (){
  pendingTodo = todoList.map(todo => {
    todo.state == 'pending';
  })

  return console.log("Lista de pendientes" + pendingTodo)
}

export{createTodo, todoList, ListTodo};
