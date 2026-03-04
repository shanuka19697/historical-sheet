"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    members: Array.from({ length: 4 }, () => ({
      name: "",
      indexNumber: "",
      department: "ICT",
    })),
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ["ICT", "IAT", "ET", "AT"];

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      members: Array.from({ length: 4 }, () => ({
        name: "",
        indexNumber: "",
        department: "ICT",
      })),
    });
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Form submitted successfully!" });
        handleReset();
      } else {
        const data = await response.json();
        setStatus({ type: "error", message: data.error || "Failed to submit form." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Group Registration</h1>
      <p className="form-subtitle">Please enter your group details below.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter the title of your project"
            required
          />
        </div>

        <div className="members-grid">
          {formData.members.map((member, index) => (
            <div key={index} className="member-card">
              <h3>Member {index + 1}</h3>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Index Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={member.indexNumber}
                  onChange={(e) => handleMemberChange(index, "indexNumber", e.target.value)}
                  placeholder="e.g., IX001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  className="form-input"
                  value={member.department}
                  onChange={(e) => handleMemberChange(index, "department", e.target.value)}
                  required
                >
                  {departments.map((dep) => (
                    <option key={dep} value={dep} style={{color: "black"}}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {status.message && (
          <div className={`message ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isSubmitting}>
            Reset Form
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
