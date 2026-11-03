
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    function openEnquiry(event) {
      setSelectedProperty(event.detail);

      setFormData({
        name: "",
        email: "",
        message: ""
      });

      setErrors({});
      setSuccessMessage("");
    }

    window.addEventListener("rently:open-enquiry", openEnquiry);

    return () => {
      window.removeEventListener("rently:open-enquiry", openEnquiry);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ""
    }));

    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    // Client-side validation
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.message.trim().length < 5) {
      newErrors.message = "Message must contain at least 5 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    try {
      // Send enquiry to ExpressJS backend
      const response = await fetch(
        "http://localhost:5000/api/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.errors || {});
        setSuccessMessage("");
        return;
      }

      // Save enquiry in localStorage after backend success
      const existingInquiries = JSON.parse(
        localStorage.getItem("inquiries") || "[]"
      );

      const newInquiry = {
        id: result.enquiry.id,
        propertyId: selectedProperty?.id,
        propertyName: selectedProperty?.name,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        date: new Date().toLocaleString()
      };

      localStorage.setItem(
        "inquiries",
        JSON.stringify([...existingInquiries, newInquiry])
      );

      setSuccessMessage(
        "Your enquiry has been submitted successfully!"
      );

      setFormData({
        name: "",
        email: "",
        message: ""
      });

      setErrors({});
    } catch (error) {
      console.error("Enquiry submission error:", error);

      setSuccessMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  }

  function closeEnquiry() {
    setSelectedProperty(null);
    setErrors({});
    setSuccessMessage("");
  }

  return (
    <>
      {selectedProperty && (
        <div className="react-enquiry-overlay">
          <div className="react-enquiry-modal">
            <button
              type="button"
              className="react-close-btn"
              onClick={closeEnquiry}
            >
              ×
            </button>

            <h2>Property Enquiry</h2>

            <p>
              You are interested in:
              <strong> {selectedProperty.name}</strong>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="enquiry-name">Your Name</label>

              <input
                id="enquiry-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              {errors.name && (
                <p className="react-error">{errors.name}</p>
              )}

              <label htmlFor="enquiry-email">Email Address</label>

              <input
                id="enquiry-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="react-error">{errors.email}</p>
              )}

              <label htmlFor="enquiry-message">
                Message to Property Owner
              </label>

              <textarea
                id="enquiry-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="I am interested in this property..."
                rows="4"
              />

              {errors.message && (
                <p className="react-error">{errors.message}</p>
              )}

              <button type="submit" className="react-submit-btn">
                Send Enquiry
              </button>

              {successMessage && (
                <p className="react-success">{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
