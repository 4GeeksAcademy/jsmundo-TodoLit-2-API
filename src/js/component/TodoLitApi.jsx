import React, { useState, useEffect } from "react";

const TodoLitApi = () => {
  const [tareas, setTareas] = useState([]);
  const [newTarea, setNuevaTarea] = useState("");
  const [loading, setLoading] = useState(false); 
  const username = "alexander60"; 

  // Función para crear usuario si no existe
  const createUser = () => {
    console.log("Intentando crear usuario...");
    return fetch(`https://playground.4geeks.com/todo/users/${username}`, {
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
        return response.json(); 
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
        alert(`No se pudo crear el usuario: ${error.message}`);
        throw error; 
      });
  };

  // Función para obtener las tareas del usuario
  const obtenerTareas = () => {
    return fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            // Usuario no existe, intentar crearlo
            console.log("Usuario no encontrado, intentando crear usuario...");
            return createUser().then(() => {
              return fetch(`https://playground.4geeks.com/todo/users/${username}`);
            });
          } else {
            throw new Error("Error al obtener las tareas");
          }
        }
        return response.json();
      })
      .then((data) => {
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
  };

  // useEffect para crear el usuario y obtener las tareas al montar el componente
  useEffect(() => {
    setLoading(true); 
    obtenerTareas()
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  // Función para agregar una nueva tarea
  const addTareas = () => {
    if (newTarea.trim() === "") {
      alert("La tarea no puede estar vacía.");
      return;
    }

    setLoading(true); 
    const nuevaTareaObj = { label: newTarea, is_done: false };
    console.log("Agregando tarea:", nuevaTareaObj);

    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTareaObj),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Usuario no encontrado, intentando crear usuario...");
            return createUser().then(() => {
              return fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
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
        if (data && data.id) {
          setTareas([...tareas, data]);
          setNuevaTarea("");
          console.log("Tarea agregada exitosamente:", data);
          alert("Tarea agregada correctamente.");
        } else if (data instanceof Response) {
          return data.json().then((data2) => {
            if (data2 && data2.id) {
              setTareas([...tareas, data2]);
              setNuevaTarea("");
              console.log("Tarea agregada exitosamente después de crear el usuario:", data2);
              alert("Tarea agregada correctamente.");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error al agregar la tarea:", error);
        alert(`No se pudo agregar la tarea: ${error.message}`);
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  // Función para eliminar una tarea
  const deleteTarea = (id) => {
    console.log(`Intentando eliminar tarea con ID: ${id}`);
    setLoading(true); 

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
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  // Manejo del evento de tecla para agregar tarea con "Enter"
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
          disabled={loading}
        />
        <button onClick={addTareas} className="add-button" disabled={loading}>
          {loading ? "Procesando..." : "Agregar Tarea"}
        </button>
      </div>
      <ul className="todo-list">
        {tareas.map((tarea) => (
          <li key={tarea.id} className="todo-list-item">
            <span>{tarea.label}</span>
            <button
              onClick={() => deleteTarea(tarea.id)}
              className="delete-button"
              disabled={loading}
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

