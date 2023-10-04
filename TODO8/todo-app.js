(function () {
    // Функция создает и возвращает заголовок приложения
    function createAppTitle(title) {
      let appTitle = document.createElement("h2");
      appTitle.innerHTML = title;
      return appTitle;
    }
  
    // Функция создает и возвращает форму для создания дела
    function createTodoItemForm() {
      let form = document.createElement("form");
      let input = document.createElement("input");
      let buttonWrapper = document.createElement("div");
      let button = document.createElement("button");
  
      form.classList.add("input-group", "mb-3");
      input.classList.add("form-control");
      input.placeholder = "Введите название нового дела";
      buttonWrapper.classList.add("input-group-append");
      button.classList.add("btn", "btn-primary");
      button.textContent = "Добавть дело";
      // Устанавливаем атрибут disabled для кнопки изначально
      button.disabled = true;
  
      // Если поле ввода пустое, устанавливаем атрибут disabled для кнопки
      input.addEventListener("input", function () {
        button.disabled = input.value.trim() === "";
      });
  
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);
  
      return {
        form,
        input,
        button,

      };

    }
  
    // Функция создает и возвращает список элементов
    function createTodoList() {
      let list = document.createElement("ul");
      list.classList.add("list-group");
      return list;
      
    }
  
    // Функция создает и возвращает элемент списка дела
    function createTodoItem(todo) {
      let item = document.createElement("li");
      // Кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement("div");
      let doneButton = document.createElement("button");
      let deleteButton = document.createElement("button");
  
      // Устанавливаем стили для элемента списка, а также для размещения кнопок
      // в его правой части с помощью flex
      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      item.textContent = todo.name;
  
      buttonGroup.classList.add("btn-group", "btn-group-sm");
      doneButton.classList.add("btn", "btn-success");
      doneButton.textContent = "Готово";
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Удалить";
  
      // Вкладываем кнопки в отдельный элемент, чтобы они объединились в список
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
  
      if (todo.done) {
        item.classList.add("list-group-item-success");
      }
      
  
      // Возвращаем объект с элементом списка дела и кнопками
      return {
        item,
        doneButton,
        deleteButton,
      };
    }
  
    // // Функция сохраняет список дел в localStorage
    // function saveTodosToLocalStorage(listName, todos) {
    //   localStorage.setItem(listName, JSON.stringify(todos));
    // }
    
    function saveHTMLtoLS(event) {
      localStorage.setItem('todoHTML', todoList.innerHTML);
    }



    function createTodoApp(container, title = "Список дел", listName) {
      // Проверяем, есть ли уже сохраненные дела в localStorage
      let savedTodos = localStorage.getItem(listName);
      let todos = savedTodos ? JSON.parse(savedTodos) : [];
  
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();
  
      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
  
      // Обработчик события нажатия на кнопку "Удалить"
      function handleDeleteButtonClick(todoId) {
        let index = todos.findIndex((todo) => todo.id === todoId);
        if (index !== -1) {
          todos.splice(index, 1);
          todoList.querySelector(`li[data-id="${todoId}"]`).remove();
          // Вызываем функцию сохранения после изменения списка дел
          saveTodosToLocalStorage(listName, todos);
        }
      }
  
      // Обработчик события нажатия на кнопку "Готово"
      function handleDoneButtonClick(todoId) {
        let todo = todos.find((todo) => todo.id === todoId);
        if (todo) {
          todo.done = !todo.done;
          let listItem = todoList.querySelector(`li[data-id="${todoId}"]`);
          if (listItem) {
            listItem.classList.toggle("list-group-item-success", todo.done);
          }

        }
      }
  
      // Добавляем обработчики на кнопки "Удалить" и "Готово" для каждого элемента списка
      todoList.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-danger")) {
          let todoId = parseInt(e.target.closest("li").dataset.id);
          handleDeleteButtonClick(todoId);
        } else if (e.target.classList.contains("btn-success")) {
          let todoId = parseInt(e.target.closest("li").dataset.id);
          handleDoneButtonClick(todoId);
        }
      });
  
      todoItemForm.input.addEventListener("input", function () {
        // Если поле ввода пустое, устанавливаем атрибут disabled для кнопки
        todoItemForm.button.disabled = todoItemForm.input.value.trim() === "";
      });
  
      // Браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
      todoItemForm.form.addEventListener("submit", function (e) {
        // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
        // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
        e.preventDefault();
  
        // Игнорируем создание элемента, если пользователь ничего не ввёл в поле
        if (!todoItemForm.input.value) {
          return;
        }
  
        let newId = generateUniqueId();
  
        let todo = {
          id: newId,
          name: todoItemForm.input.value,
          done: false,
        };
  
        let todoItem = createTodoItem(todo);
  
        todoItem.doneButton.addEventListener("click", function () {
          todoItem.item.classList.toggle("list-group-item-success");
          handleDoneButtonClick(newId);
        });
  
        todoItem.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            todoItem.item.remove();
            handleDeleteButtonClick(newId);
          }
          
        });

        
  
        todos.push(todo);
  
        // Создаём и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItem.item);
        // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = "";
  
        // Генерируем уникальный идентификатор для дела
        function generateUniqueId() {
          if (todos.length === 0) {
            // Если массив todos пустой, начинаем с id = 1
            return 1;
          } else {
            // Ищем максимальный id в массиве todos
            let maxId = Math.max(...todos.map((todo) => todo.id));
            // Возвращаем новый уникальный id, увеличенный на 1
            return maxId + 1;
          }
          
        }

      });
    }

  
    // После объявления функции createTodoApp, добавляем ее в глобальный объект window
    window.createTodoApp = createTodoApp;
  })();