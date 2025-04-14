import { useState } from "react";
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
      await axios.post(`${BACKEND_URL}/api/users`, formData);
      setMessage("User saved successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
      });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
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
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default UserForm;
