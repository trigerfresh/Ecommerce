import { useState, useEffect } from 'react'
import api from '../../api.js'
import { Modal, Button } from 'react-bootstrap'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=7`)

      if (res.data.success) {
        setUsers(res.data.users)
        setTotalPages(res.data.pagination.totalPages)
        setCurrentPage(res.data.pagination.currentPage)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers(currentPage)
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const saveEdit = async () => {
    try {
      await api.put(`/admin/users/${editUser._id}`, editUser)
      fetchUsers(currentPage)
      setEditUser(null)
    } catch (err) {
      console.error('Failed to update user:', err)
    }
  }

  if (loading) return <div className="text-center mt-4">Loading users...</div>

  return (
    <div className="container">
      <h3>User List</h3>

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
              <th>Actions</th>
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
                  <td>{(currentPage - 1) * 7 + index + 1}</td>
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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center gap-3 my-3">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>

      {/* Edit Modal */}
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
                value={editUser.fname}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    fname: e.target.value,
                  })
                }
              />
              <input
                className="form-control mb-2"
                value={editUser.lname}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    lname: e.target.value,
                  })
                }
              />
              <input
                className="form-control mb-2"
                value={editUser.phone}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    phone: e.target.value,
                  })
                }
              />
              <input
                className="form-control mb-2"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    email: e.target.value,
                  })
                }
              />
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
