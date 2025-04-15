import { useEffect, useState } from "react";
import axios from "axios";

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${BACKEND_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      setMessage("Error fetching users!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required!";
    if (!formData.lastName.trim())
      newErrors.lastName = "Second name is required";

    const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;
    if (!phoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = "Enter a valid phone number!";

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email!";

    if (!formData.address.trim()) newErrors.address = "Please enter address!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      if (editId) {
        await axios.patch(`${BACKEND_URL}/api/users/${editId}`, formData);
        setMessage("User updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/api/users`, formData);
        setMessage("User saved successfully!");
      }

      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
      });
      setErrors({});
      setEditId(null);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        await axios.delete(`${BACKEND_URL}/api/users/${id}`);
        setMessage("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        setMessage("Failed to delete user!");
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h2>User Details Form</h2>
      <form onSubmit={handleSubmit}>
        {["firstName", "lastName", "phoneNumber", "email", "address"].map(
          (field) => (
            <div className="form-group" key={field}>
              <label>
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
              {errors[field] && (
                <small style={{ color: "red" }}>{errors[field]}</small>
              )}
            </div>
          )
        )}
        <button type="submit">{editId ? "Update" : "Submit"}</button>
        {message && <p>{message}</p>}
      </form>
      <hr />
      <h2>All Users</h2>
      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <p>
            <strong>
              {user.firstName} {user.lastName}
            </strong>
          </p>
          <p>{user.phoneNumber}</p>
          <p>{user.email}</p>
          <p>{user.address}</p>
          <button className="edit" onClick={() => handleEdit(user)}>
            Edit
          </button>
          <button className="delete" onClick={() => handleDelete(user._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserForm;
