import React, { useState, useEffect } from "react";

const TodoLitApi = () => {
  const [tareas, setTareas] = useState([]);
  const [newTarea, setNuevaTarea] = useState("");

  // Obtener las tareas al montar el componente
  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/users/alex_31")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tareas obtenidas:", data);
        if (Array.isArray(data)) {
          setTareas(data);
        } else {
          setTareas([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las tareas:", error);
        alert(`No se pudo obtener las tareas: ${error.message}`);
      });
  }, []);

  // Función para crear usuario si no existe
  const createUser = () => {
    return fetch("https://playground.4geeks.com/todo/users/alex_31", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo crear el usuario");
        }
        console.log("Usuario creado exitosamente");
        alert("Usuario creado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
        alert(`No se pudo crear el usuario: ${error.message}`);
      });
  };

  // Función para agregar una nueva tarea
  const addTareas = () => {
    if (newTarea.trim() === "") {
      alert("La tarea no puede estar vacía.");
      return;
    }

    const nuevaTareaObj = { label: newTarea, is_done: false };

    fetch("https://playground.4geeks.com/todo/todos/alex_31", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTareaObj),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            // Usuario no existe, intentamos crearlo
            console.log("Usuario no encontrado, intentando crear usuario...");
            return createUser().then(() => {
              // Reintentar agregar la tarea después de crear el usuario
              return fetch("https://playground.4geeks.com/todo/todos/alex_31", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaTareaObj),
              });
            });
          } else {
            throw new Error("Error al agregar la tarea");
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          // Si se recibió data significa que se agregó la tarea
          setTareas([...tareas, data]);
          setNuevaTarea("");
          console.log("Tarea agregada exitosamente:", data);
          alert("Tarea agregada correctamente.");
        }
      })
      .catch((error) => {
        console.error("Error al agregar la tarea:", error);
        alert(`No se pudo agregar la tarea: ${error.message}`);
      });
  };

  // Función optimizada para eliminar una tarea
  const deleteTarea = (id) => {
    console.log(`Intentando eliminar tarea con ID: ${id}`);

    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log("Respuesta del servidor:", response);
        if (!response.ok) {
          return response.json().then((err) => {
            const errorMsg = err.message || "Error al eliminar la tarea";
            throw new Error(errorMsg);
          });
        }
      })
      .then(() => {
        const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);
        setTareas(nuevasTareas);
        console.log(`Tarea con ID ${id} eliminada exitosamente.`);
        alert("Tarea eliminada correctamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea:", error);
        alert(`No se pudo eliminar la tarea: ${error.message}`);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTareas();
    }
  };

  return (
    <div className="todo-container">
      <h1>Lista de Tareas</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nueva tarea"
          className="todo-input"
        />
        <button onClick={addTareas} className="add-button">
          Agregar Tarea
        </button>
      </div>
      <ul className="todo-list">
        {tareas.map((tarea) => (
          <li key={tarea.id} className="todo-list-item">
            <span>{tarea.label}</span>
            <button
              onClick={() => deleteTarea(tarea.id)}
              className="delete-button"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoLitApi;
