import { useState, useEffect } from "react";
import { ArrowLeft, Globe } from "lucide-react";
import "../styles/history.css";

const History = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/history`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`, // Include the token
          },
        });
        const data = await response.json();
        console.log(data);

        if (data.status === "error") {
          setError(data.message || "Failed to fetch data");
          setTasks([]);
        } else if (data.status === "success" && data.historyResponse.history.length > 0) {
          const formattedTasks = data.historyResponse.history.map((item) => ({
            id: item.radio.key,
            name: item.radio.name,
            date: new Date(item.date_reviewed).toLocaleDateString(),
            status: item.radio.pipeline || "Unknown",
            events: item.radio.events.map((event) => ({
              name: event.name,
              date: new Date(event.date).toLocaleDateString(),
            })),
            website: item.radio.website,
            adminUrl: item.radio.admin_url,
          }));
          setTasks(formattedTasks);
          setError("");
        } else {
          setError("No history data available.");
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("An error occurred while fetching data.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      {selectedTask ? (
        <>
          <div className="back-list-btn">
            <button onClick={() => setSelectedTask(null)} className="back-button">
              <ArrowLeft className="icon" size={18} /> Back to list
            </button>
          </div>
          <div className="task-details">
            <h2 className="task-title">{selectedTask.name}</h2>
            <div className="task-status-wrapper">
              <p className="task-status">Data pipeline</p>
              <span className="status-badge">{selectedTask.status}</span>
            </div>

            {/* Events Section */}
            {selectedTask.events.length > 0 && (
              <div className="task-events">
                <div className="event-title-wrapper">
                  <span className="clock_icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_220_130)"><path d="M7.99992 3.99998V7.99998L10.6666 9.33331M14.6666 7.99998C14.6666 11.6819 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6819 1.33325 7.99998C1.33325 4.31808 4.31802 1.33331 7.99992 1.33331C11.6818 1.33331 14.6666 4.31808 14.6666 7.99998Z" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_220_130"><rect width="16" height="16" fill="white"></rect></clipPath></defs></svg>
                  </span>
                  <p className="event-title">Events:</p>
                </div>
                <ul className="event-list">
                  {selectedTask.events.map((event, index) => (
                    <li key={index} className="event-item">
                      <span className="event-name">{event.name}</span>  <span className="event-date">{event.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="task-actions">
              {selectedTask.website && (
                <a href={selectedTask.website} target="_blank" rel="noopener noreferrer" className="website-button">
                  <Globe className="icon" size={16} /> Website
                </a>
              )}
              {selectedTask.adminUrl && (
                <a href={selectedTask.adminUrl} className="admin-button">
                  Open admin
                </a>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="task-list">
          <p className="progress-info">
            Weekly progress <span className="progress-count">{tasks.length}/100 tasks</span>
          </p>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="task-items">
              {tasks.map((task) => (
                <div key={task.id} className="task-item" onClick={() => setSelectedTask(task)}>
                  <div className="task-name-wrapper">
                    <h3 className="task-name">{task.name}</h3>
                    <span className="task-arrow-right">
                      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <div className="task-item-info">
                    <div className="task-info-1">
                      <p className="task-meta">Data pipeline</p>
                      <span className="status-badge">{task.status}</span>
                    </div>
                    <div className="task-info-date">
                      <span className="task-date">{task.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default History;
