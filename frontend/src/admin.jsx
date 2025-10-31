import React, { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBirthday, setEditBirthday] = useState("");

  // Fetch users from backend on component mount
  useEffect(() => {
    fetch("http://localhost:4000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // Start editing a user
  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditName(user.name);

    // Defensive: handle missing/invalid birthday
    let bdayString = "";
    if (user.birthday) {
      const dt = new Date(user.birthday);
      bdayString = isNaN(dt.getTime()) ? "" : dt.toISOString().substr(0, 10);
    }
    setEditBirthday(bdayString);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditUserId(null);
    setEditName("");
    setEditBirthday("");
  };

  // Save user after editing
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${editUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, birthday: editBirthday }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
        setEditUserId(null);
        setEditName("");
        setEditBirthday("");
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      alert("Error updating user");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", paddingTop: "2rem" }}>
      <h2>Admin Dashboard - User List</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              {editUserId === user._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={e => setEditBirthday(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
