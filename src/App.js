import React, { useState, useEffect } from 'react';
import { addItem, getAllItems ,deleteItem , editItem,getItem} from './Db';

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({
    name: '',
    position: ''
  })
  const [isEdit,setIsEdit]=useState(false)
  const [id,setId]=useState('')



  async function fetchItems() {
    const data = await getAllItems();
    setItems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  }

  async function handleAddItem() {
    if (!user?.name || !user?.position) {
      return alert('Enter Details')
    } else {
      const newItem = user;
      await addItem(newItem);
      setUser({
        name: '',
        position: ''
      })
      fetchItems()
    }
  }

  async function handelDelete(id){
    await deleteItem(id)
    fetchItems();
  }

  async function handelEdit(id){
    const data = await getItem(id)
    if(data){
      const filterItems = items?.filter((item)=>item.id != data.id)
      setItems(filterItems)
      setIsEdit(!isEdit)
      setId(data?.id)
      setUser({
        name:data?.name,
        position:data?.position
      })
    }
  }

  async function handelSave(id){
    await editItem(user,id);
    setUser({
      name: '',
      position: ''
    })
    setIsEdit(!isEdit)
    setId('')
    fetchItems()
  }
  
  async function handelCancel(id){
    setUser({
      name: '',
      position: ''
    })
    fetchItems()
  }

  return (
    <div className='row p-4'>
      <div className='col-4 border-end'>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
          <input type="text" name='name' value={user?.name} className="form-control" id="Name" onChange={(e) => handelChange(e)} />
        </div>
        <div className="mb-3">
          <label htmlFor="Postion" className="form-label">position</label>
          <input type="text" name='position' value={user?.position} className="form-control" id="Postion" onChange={(e) => handelChange(e)} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={() =>{!isEdit ?  handleAddItem() : handelSave(id)}}>{isEdit ? 'Save' : "Submit"}</button>
        {isEdit && <button type="submit" className="btn btn-primary m-4" onClick={() => handelCancel()}>Cancel</button>}
      </div>
      <div className="col-8">
        <table className=" col-6 table ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              items?.length > 0 ? items.map((items, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{items?.name}</td>
                    <td>{items?.position}</td>
                    <td className='d-flex gap-4'>
                      <button type="button" className="btn btn-primary"  onClick={()=>{handelEdit(items?.id)}}>Edit</button>
                      <button type="button" className="btn btn-danger" onClick={()=>handelDelete(items?.id)}>Delete</button>
                    </td>
                  </tr>
                )
              }) : <tr><td colSpan={3} className='text-center'>No Data</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
