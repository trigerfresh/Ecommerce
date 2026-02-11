import { useState, useEffect } from 'react'
import api from '../../api.js'
import { Modal, Button } from 'react-bootstrap'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(null) // user being edited

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.filter((u) => u.role === 'user'))
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter((u) => u._id !== id))
      alert('User deleted successfully')
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user')
    }
  }

  const saveEdit = async () => {
    try {
      await api.put(`/admin/users/${editUser._id}`, editUser)
      // Update users array locally
      setUsers(users.map((u) => (u._id === editUser._id ? editUser : u)))
      setEditUser(null) // close modal
      alert('User updated successfully')
    } catch (err) {
      console.error('Failed to update user:', err)
      alert('Failed to update user')
    }
  }

  if (loading) return <div className="text-center mt-4">Loading users...</div>

  return (
    <div className="container">
      <h3>User List</h3>

      {/* Users table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Email</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.fname}</td>
                  <td>{u.lname}</td>
                  <td>{u.phone}</td>
                  <td>{u.gender}</td>
                  <td>{u.email}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditUser(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal using React-Bootstrap */}
      <Modal
        show={!!editUser}
        onHide={() => setEditUser(null)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <>
              <input
                className="form-control mb-2"
                placeholder="First Name"
                value={editUser.fname}
                onChange={(e) =>
                  setEditUser({ ...editUser, fname: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Last Name"
                value={editUser.lname}
                onChange={(e) =>
                  setEditUser({ ...editUser, lname: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Phone"
                value={editUser.phone}
                onChange={(e) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <select
                className="form-select mb-2"
                value={editUser.gender}
                onChange={(e) =>
                  setEditUser({ ...editUser, gender: e.target.value })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserList
