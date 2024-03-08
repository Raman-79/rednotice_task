'use client'

import { useState,useEffect } from 'react';
import axios from 'axios';

const Home = () => {

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    hobbies: ''
  });
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('https://rednotice-task.onrender.com/api/entries');
        setTableData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchEntries();
  }, []);
  const handleSendEmail = async () => {
    try {
      await axios.post('https://rednotice-task.onrender.com/api/sendEmail', {rows:selectedRows});
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleRowSelect = (id, rowData) => {
    const isSelected = selectedRows.some(row => row._id === id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(row => row._id !== id));
    } else {
      setSelectedRows([...selectedRows, rowData]);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddEntry = async () => {
    try {
      const response = await axios.post('https://rednotice-task.onrender.com/api/entries', formData);
      console.log(response.data);
      setTableData([...tableData, response.data.entry]);
      setShowAddForm(false);
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        hobbies: ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUDS Example</h1>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => setShowAddForm(true)}>Add New Entry</button>

      {showAddForm && (
        <div className="bg-gray-100 p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Add New Entry</h2>
          <div className="flex flex-col mb-4">
            <label className="mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-1">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-1">Hobbies</label>
            <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className="border border-gray-300 p-2 rounded" />
          </div>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddEntry}>Save</button>
        </div>
      )}

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Update/Delete</th>
          </tr>
        </thead>
        <tbody>
        {tableData.map((entry, index) => (
  <tr key={index}>
    <td><input type="checkbox" onChange={() => handleRowSelect(entry._id,entry)} /></td>
    <td>{index + 1}</td>
    <td>{entry && entry.name}</td>
    <td>{entry && entry.phoneNumber}</td>
    <td>{entry && entry.email}</td>
    <td>{entry && entry.hobbies}</td>
    <td>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">Update</button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
    </td>
  </tr>
))}

        </tbody>
      </table>
      <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={()=>{handleSendEmail()}}>Send mail</button>
    </div>
  );
};

export default Home;
