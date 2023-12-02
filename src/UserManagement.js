import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch users from the API
    axios.get(API_ENDPOINT)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleRowClick = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map(user => user.id));
    }
  };

  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleSaveEdit = () => {
    setEditMode(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleEditChange = (id, field, value) => {
    setUsers(prevUsers => {
      const userIndex = prevUsers.findIndex(user => user.id === id);
      const updatedUsers = [...prevUsers];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        [field]: value,
      };
      return updatedUsers;
    });
  };
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const renderTableRows = () => {
    const filteredUsers = users.filter(user =>
      Object.values(user).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = filteredUsers.slice(startIndex, endIndex);

    return displayedUsers.map(user => (
      <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected-row' : ''}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(user.id)}
            onChange={() => handleRowClick(user.id)}
          />
        </td>
        <td>{user.id}</td>
        <td>
          {editMode === user.id ? (
            <input
              type="text"
              value={user.name}
              onChange={(e) => handleEditChange(user.id, 'name', e.target.value)}
            />
          ) : (
            user.name
          )}
        </td>
        <td>
          {editMode === user.id ? (
            <input
              type="text"
              value={user.email}
              onChange={(e) => handleEditChange(user.id, 'email', e.target.value)}
            />
          ) : (
            user.email
          )}
        </td>
        <td>
          {editMode === user.id ? (
            <input
              type="text"
              value={user.role}
              onChange={(e) => handleEditChange(user.id, 'role', e.target.value)}
            />
          ) : (
            user.role
          )}
        </td>
        <td>
          {editMode === user.id ? (
            <>
              <button className="save" onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <button className="edit" onClick={() => handleEdit(user.id)}>Edit</button>
          )}
          <button className="delete" onClick={()=>handleDelete(user.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setSelectedRows([]);
  };
  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="user-management-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-icon" onClick={() => handlePageChange(1)}>Search</button>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === users.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(1)}>First</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <button onClick={() => handlePageChange(totalPages)}>Last</button>
      </div>

      <button className="delete-selected" onClick={handleDeleteSelected}>Delete Selected</button>
    </div>
  );
};

export default UserManagement;
