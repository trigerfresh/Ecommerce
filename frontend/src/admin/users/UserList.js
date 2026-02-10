import { useState, useEffect } from 'react'
import api from '../../api.js'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await api.get('/admin/users')
    const onlyUsers = res.data.filter((u) => u.role === 'user')

    setUsers(res.data)
    setLoading(false)
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    await api.delete(`/admin/users/${id}`)
    setUsers(users.filter((u) => u._id !== id))
  }

  if (loading) {
    return <div className="text-center mt-4">Loading users...</div>
  }

  return (
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
                    <button className="btn btn-warning btn-sm me-2">
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
  )
}

export default UserList
