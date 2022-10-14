import React, {useEffect, useState} from 'react';
import axios from 'axios';

const URL = 'http://localhost:3001/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(()=>{
    axios.get(URL)
      .then((response) => {
        setTasks(response.data);
      }).catch(error => {
        alert(error.message);
      });
  }, [])

  function save() {
    const json = JSON.stringify({description: task});
    axios.post(URL + 'new', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then((response) => {
      const addedObject = JSON.parse(json);
      addedObject.id = response.data.id;
      setTasks([...tasks, addedObject]);
      setTask('');
    }).catch(error => {
      alert(error.message);
    });
  }

  function del(id) {
    axios.delete(URL+'delete/'+id).then(() => {
      const newList = tasks.filter(item => item.id !== id);
      setTasks(newList);
    }).catch(err => {
      alert(err.message);
    })
  }

  return (
    <div style={{margin: '20px'}}>
      <h2>My tasks</h2>
      <ul>
        <form>
          <label>Add new</label>
          <input value={task} onChange={e => setTask(e.target.value)} />
          <button type="button" onClick={save}>Save</button>
        </form>
        {tasks.map(task => {return <li key={task.id}>{task.description} <a href='#' onClick={() => del(task.id)}>X</a></li>})}
      </ul>
    </div>
  );
}

export default App;
