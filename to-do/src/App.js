import React, {useEffect, useState} from 'react';
import axios from 'axios';

const URL = 'http://localhost:3001/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const [editTask, setEditTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(()=>{
    axios.get(URL)
      .then((response) => {
        setTasks(response.data);
      }).catch(error => {
        alert(error.message);
      });
  }, [])

  function save() {
    if (newTask == '') {
      return;
    }
    const json = JSON.stringify({description: newTask});
    axios.post(URL + 'new', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then((response) => {
      const addedObject = JSON.parse(json);
      addedObject.id = response.data.id;
      setTasks([...tasks, addedObject]);
      setNewTask('');
    }).catch(error => {
      alert(error.message);
    });
  }

  function saveEditedTask(task) {
    const newTask = {id: editTask.id, description: editDescription};
    const json = JSON.stringify(newTask);
    axios.put(URL+'edit', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      const tempArray = [...tasks];
      const idx = tempArray.findIndex(task => {return task.id === editTask.id})
      if (idx !== -1) {
        tempArray[idx].description = editDescription;
      }
      setTasks(tempArray);
      setEditTask(null);
      setEditDescription('');
    })
    .catch(error =>{
      alert(error.response.data.error);
    })
  }

  function del(id) {
    axios.delete(URL+'delete/'+id).then(() => {
      const newList = tasks.filter(item => item.id !== id);
      setTasks(newList);
    }).catch(err => {
      alert(err.message);
    })
  }

  function setEditRow(task) {
    setEditTask(task);
    setEditDescription(task.description);
  }

  return (
    <div style={{margin: '20px'}}>
      <h2>My tasks</h2>
      <form>
        <label>Add new</label>
        <input value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button type="button" onClick={save}>Save</button>
        </form>
      <ol>
        {tasks.map(task => (
          <li key={task.id}>
            {(editTask == null || editTask.id !== task.id) && task.description + ' '}
            {(editTask !== null && editTask.id === task.id) &&
              <form>
                <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                <button type='button' onClick={() => saveEditedTask(task)}>Save</button>
                <button type='button' onClick={() => setEditTask(null)}>Cancel</button>
              </form>
            }
            {(editTask == null || editTask.id !== task.id) &&
              <>
                <a href='#' onClick={() => del(task.id)}>X</a>&nbsp;
                <a href='#' onClick={() => setEditRow(task)}>Edit</a>
              </>
            }
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
