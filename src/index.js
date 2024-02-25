import "./css/base.css";
import {createTodo, todoList, ListTodo} from "./js/TodoList"

var clearButton = document.getElementById('btn-clear');

var inputTodo = document.getElementById('new-todo');
inputTodo.addEventListener("input", createTodo)

var view = document.getElementById('view');
var editing = document.getElementById('editing');

//funcion para llamar al localstorage
let setLocalStorageTodoList = (list) =>{localStorage.setItem("mydayapp-js", JSON.stringify(list))}

let getLocalStorageTodoList = () => {return JSON.parse( localStorage.getItem("mydayapp-js") )}

//crea un nuevo todo en la lista//
inputTodo.addEventListener('keyup',(event) => {
  let newArray
  if(event.key === "Enter") {
    event.preventDefault();
    console.log('hice clic')
    inputTodo.value='';
    newArray =[...getLocalStorageTodoList(), ...todoList]
    setLocalStorageTodoList (newArray)
    getLocalStorageTodoList()
    const htmlTodo = `

              <div class="view">
                <input class="toggle" type="checkbox">
                <label id="${getLocalStorageTodoList().length-1}">${getLocalStorageTodoList()[(getLocalStorageTodoList().length-1)].task}</label>
                <button class="destroy"></button>
              </div>
              <input class="edit" value="Buy a unicorn" />
    `;
    var seeList = document.createElement('li');
    seeList.innerHTML = htmlTodo
    view.insertBefore(seeList, editing)
    Active();
    EditMode();
    PendingList();

  }
});


  clearButton.addEventListener('click', clear)
  //borra los elementos completados//
  function clear() {
    const completados = document.querySelectorAll('li.completed')
    completados.forEach( li => view.removeChild(li))

    const ids= []
    let editedStorage =  getLocalStorageTodoList()
    console.log(getLocalStorageTodoList().length)
    for (let index = 0; index < getLocalStorageTodoList().length; index++) {
      if(getLocalStorageTodoList()[index].state === 'completed'){
        ids.push (index)
      }
    }
    for (let index = 0; index < ids.length; index++) {
      let values = ids[index]
      editedStorage = [...getLocalStorageTodoList()]
      const modifiedEditedStorage = editedStorage.splice(values, 1 )
      setLocalStorageTodoList(editedStorage)
    }

  }

  //cuando inicia la app oculta el main y el footer//
  window.onload = appInit();
  function appInit (){
    clear()
    inputTodo.focus();
    if(getLocalStorageTodoList().length === 0){
      document.getElementById('main').style.display="none";
      document.getElementById('footer').style.display="none";
    }else {
        for (let index = 0; index < getLocalStorageTodoList().length; index++) {
            const indexLocalStorage =[...getLocalStorageTodoList()]
          if(indexLocalStorage[index].state === 'pending'){
            const htmlTodo = `

        <div class="view">
          <input class="toggle" type="checkbox">
          <label id="${index}">${indexLocalStorage[index].task}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Buy a unicorn" />
        `;
        var seeList = document.createElement('li');
        seeList.innerHTML = htmlTodo
        view.insertBefore(seeList, editing)
        Active();
        EditMode();
        PendingList();
        }else {
          const htmlTodo = `

          <div class="view">
            <input class="toggle" type="checkbox">
            <label id="${index}">${getLocalStorageTodoList[index].task}</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="Buy a unicorn" />
  `;
          var seeList = document.createElement('li');
          seeList.innerHTML = htmlTodo;
          seeList.className='completed'
          view.insertBefore(seeList, editing)
          PendingList();
        }
    }
  }}

var pendingList = document.getElementById('btn-pending');
pendingList.addEventListener("click",ListTodo);

//muestra si la tarea esta pendiente o completada
function Active () {
  var toggle = document.querySelectorAll('.toggle');
  toggle.forEach((li) => {
    li.addEventListener('click', () =>{
      const fatherLi = li.parentNode.parentNode;
      fatherLi.classList.add("completed");

      const todoId = li.parentNode.childNodes[3].id
      const completedTodo = [...getLocalStorageTodoList()]
       completedTodo[todoId].state='completed'
      setLocalStorageTodoList(completedTodo)
      PendingList ()
    }
    )
  });

}

//cambia el css a modo edit//
function EditMode () {
  var label = document.querySelectorAll('label');
  label.forEach((li) => {
    li.addEventListener('dblclick', () =>{
      const fatherLi = li.parentNode.parentNode;
      fatherLi.classList.add("edit")

      const liList = document.querySelectorAll('li')
      liList.forEach(view => {
        if(!(view.className === 'edit')) {
          view.style.display="none"
        }
        });


      var input = fatherLi.childNodes[3]
      input.classList.replace("edit", "view")
      input.focus();



      //si hace enter guarda los cambios sino sale del modo editar//
      input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          let editValue = input.value;
          const editTodo = [...getLocalStorageTodoList()]
          const editCompleteTodo= editTodo[li.id].task = editValue.trim();
          setLocalStorageTodoList(editTodo)
          li.textContent = editValue
          input.classList.replace("view", "edit")

          liList.forEach(view => {
            view.style.display=""
            view.classList.remove("edit")
          });
        }else if (event.key === "Escape"){
          input.classList.replace("view", "edit")

          liList.forEach(view => {
            view.style.display=""
            view.classList.remove("edit")
          });
        }
      })
      ;
    }
    )
  }

  );

}
//cuenta las tareas pendientes//
function PendingList () {
  const seePending = document.querySelector("strong");
  let count = 0
  getLocalStorageTodoList().forEach(todo => {
    if(todo.state === 'pending'){
        count ++
    }
  })
  let item = 'items'
    if(count === 1){
      item= 'item'
    }
  seePending.innerHTML= `${count} ${item}`
}

//filtra dependiendo el hash//
window.addEventListener('hashchange', filter);
function filter () {
  const completedList =document.querySelectorAll('li.completed');
  const pendingLi = document.querySelectorAll( 'ul.todo-list > li')
  let hashtag = window.location.hash;
  if(hashtag === '#/'){
    pendingLi.forEach( li => li.style.display="")
    completedList.forEach( li => li.style.display="")
  }else if(hashtag === '#/completed'){
    pendingLi.forEach( li => li.style.display="none")
    completedList.forEach( li => li.style.display="")
  }else if (hashtag === '#/pending') {
    pendingLi.forEach( li => li.style.display="")
    completedList.forEach( li => li.style.display="none")
  }else {
    pendingLi.forEach( li => li.style.display="none")
    completedList.forEach( li => li.style.display="none")
  }
}
