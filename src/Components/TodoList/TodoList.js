import { useEffect, useState } from "react";
import "./styles.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
const GET_TASKS = "https://jsonplaceholder.typicode.com/todos";
const Todo = () => {
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showLoad, setShowLoad] = useState(false);
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const response = await axios.get(GET_TASKS);
    setTasks(response.data);
  };

  const addTask = async () => {
    try {
      setShowLoad(true);
      const response = await axios.post(GET_TASKS, { title: taskName });
      console.log(response.data);
      let temp = [...tasks];
      temp.push({ ...response.data, userId: 1, completed: false });
      setTasks(temp);
      setTaskName("");
      setShowLoad(false);
    } catch (error) {
      console.log("error adding tasks", error.response.data);
      setShowLoad(false);
    }
  };

  const onDelete = async (item) => {
    try {
      setShowLoad(true);
      const response = await axios.delete(GET_TASKS + "/" + item.id);
      if (response) {
        let temp = [...tasks];
        temp.splice(
          tasks.findIndex((task) => task.id === item.id),
          1
        );
        console.log(tasks);
        setTasks(temp);
        setShowLoad(false);
      }
    } catch (error) {
      console.log("error deleting item", error);
      setShowLoad(false);
    }
  };

  const onEdit = async (item) => {
    let temp = [...tasks];
    temp.splice(
      tasks.findIndex((task) => task.id === item.id),
      1,
      item
    );
    console.log(tasks);
    setTasks(temp);
  };

  return (
    <div id="todo-container">
      <input
        type="text"
        id="todo-input"
        placeholder="Enter a new task"
        value={taskName}
        onChange={(event) => {
          setTaskName(event.currentTarget.value);
        }}
      />
      <button
        id="add-btn"
        onClick={() => {
          addTask();
        }}
      >
        Add
      </button>
      <div style={{ height: "500px", overflow: "scroll" }}>
        {showLoad && (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="rotate"
              style={{
                height: "50px",
                width: "50px",
                border: "5px solid black",
                borderLeft: "5px solid white",
                borderRadius: "100px",
              }}
            ></div>
          </div>
        )}
        {!showLoad && tasks && tasks.length > 0 && (
          <ul id="todos" style={{ paddingLeft: "0px" }}>
            {tasks.map((item, index) => {
              return (
                <TaskList
                  key={index}
                  item={item}
                  index={index}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  showLoad={showLoad}
                  setShowLoad={setShowLoad}
                />
              );
            })}
          </ul>
        )}
      </div>
      <p>
        Total tasks: <span id="total-tasks">{tasks.length}</span>
      </p>
    </div>
  );
};

export default Todo;

const TaskList = ({ item, index, onDelete, onEdit, showLoad, setShowLoad }) => {
  const [isChecked, setIsChecked] = useState(item.completed);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState(item.title);
  const classOfItem = isChecked ? "completed" : "";

  const onEditItem = async () => {
    try {
      const newData = {
        ...item,
        title: taskName,
      };
      console.log(newData);
      const response = await axios.put(GET_TASKS + `/${newData.id}`, newData);
      if (response) {
        onEdit(newData);
        setIsEdit(false);
      }
    } catch (error) {
      console.log("error edit item ", error);
    }
  };

  const deleteItem = () => {
    if (isChecked) {
      alert("You cannot delete a checked task");
      return;
    }
    onDelete(item);
  };

  const handleClose = () => {
    setTaskName(item.title);
    setIsEdit(false);
  };
  return (
    <>
      <li key={index} className={classOfItem}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => {
            setIsChecked(event.target.checked);
          }}
        />
        <span
          className="todo-item "
          style={{
            userSelect: "none",
            marginLeft: "5px",
          }}
        >
          {item.title}
        </span>
        <button
          className="delete-btn"
          onClick={() => {
            setIsEdit(true);
          }}
        >
          <FaEdit />
        </button>
        <button className="delete-btn" onClick={() => deleteItem()}>
          <FaTrash />
        </button>
      </li>

      {isEdit && (
        <Modal show={isEdit} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              id="todo-input"
              placeholder="Enter a new task"
              value={taskName}
              onChange={(event) => {
                setTaskName(event.currentTarget.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={onEditItem}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
