import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = '/api';

function App() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', instructor: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({ title: '', description: '', instructor: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <h1>Digilians</h1>
          </div>
          <p className="tagline">Your Path to Learning Excellence</p>
        </div>
      </header>
      
      <div className="container">
        <div className="form-section">
          <h2>📚 Add New Course</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">📖</span>
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">📝</span>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">👨‍🏫</span>
              <input
                type="text"
                placeholder="Instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required
              />
            </div>
            <button type="submit">
              <span>➕</span> Add Course
            </button>
          </form>
        </div>

        <div className="courses-section">
          <h2>🎓 Available Courses</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="card-icon">📘</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p className="instructor">👨‍🏫 {course.instructor}</p>
                <button onClick={() => handleDelete(course.id)} className="delete-btn">
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
