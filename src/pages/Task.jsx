import "../styles/tasks.css";
import { useState, useEffect } from "react";
import Maintenance from "../components/Maintenance";
import Request from "../components/Request";
import img3 from "../assets/no-project-without-text.png";

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRadio, setCurrentRadio] = useState(null);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Added success message state
  const [isLoading, setIsLoading] = useState(false); // Loading state to manage API calls
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const authToken = localStorage.getItem("authToken");
  console.log(authToken);
  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/get-projects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`, // Include the token
          },
        });
        const data = await response.json();
        if (response.ok && data.status === "success") {
          setProjects(data.projects);
        } else {
          setErrorMessage("Failed to load projects. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Error fetching projects. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [API_BASE_URL]);

  // Fetch the current radio for the selected project
  const fetchCurrentRadio = async () => {
    if (!selectedProject) return;

    setIsLoading(true); // Set loading true while fetching the current radio
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/projects/${selectedProject.id}/current-radio`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`, // Include the token
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.status !== "error") {
        setCurrentRadio(data);
        setErrorMessage(""); // Clear error message on success
      } else {
        setCurrentRadio(null);
        setErrorMessage(data.message || "No stations available.");
      }
    } catch (error) {
      setCurrentRadio(null);
      setErrorMessage("Failed to fetch the current radio. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading false after fetch completes
    }
  };

  // Fetch the current radio when the selected project changes
  useEffect(() => {
    fetchCurrentRadio();
  }, [selectedProject]);

  const handleProjectChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const project = projects.find((p) => p.id === selectedId);
    setSelectedProject(project || null); // Update the selected project
    setIsConfirming(false);
  };

  // **Snooze radio functionality**
  const snoozeRadio = async (radioId, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}/snooze-radio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`, // Include the token
        },
        body: JSON.stringify({ task_id: radioId }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Radio Snooze Successfully!", data.message);
        setSuccessMessage("Radio snoozed successfully!"); // Set success message for snooze
      } else {
        setErrorMessage(data.error || "Failed to snooze the radio.");
      }
    } catch (error) {
      setErrorMessage("Error snoozing the radio. Please try again.");
    }
  };

  const nextRadio = async () => {
    if (!selectedProject || !currentRadio) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects/${selectedProject.id}/complete-radio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`, // Include the token
        },
        body: JSON.stringify({ task_id: currentRadio.task_id }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Next radio station changed successfully!");
        fetchCurrentRadio();
        setIsConfirming(false); // Hide the confirmation button after changing the radio
        console.log("Next radio station changed successfully!", data.task_id);
      } else {
        setErrorMessage(data.error || "Failed to complete the radio.");
      }
    } catch (error) {
      setErrorMessage("Error completing the radio. Please try again.");
    }
  };

  const handleConfirmNextRadio = () => {
    nextRadio();
    setIsConfirming(false); // Hide the confirmation button after confirming

    // Hide success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  // Hide success message after 2 seconds if "Radio snoozed successfully!"
  useEffect(() => {
    if (successMessage === "Radio snoozed successfully!") {
      const timer = setTimeout(() => {
        setSuccessMessage(""); // Clear the success message after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted or success message changes
    }
  }, [successMessage]);

  useEffect(() => {
    if (selectedProject && currentRadio) {
      const workerId = localStorage.getItem("worker_id");
      const projectType = selectedProject.type;
      const projectName = selectedProject.name;
      const radioId = currentRadio.radio?.key || null;
      const taskId = currentRadio.task_id;

      // Push data into the dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pageview",
        worker_id: workerId,
        radio_id: radioId,
        task_id: taskId,
        project_type: projectType,
        project_name: projectName,
        tool_id: "extension",
      });

      console.log("Data pushed to dataLayer:", {
        worker_id: workerId,
        radio_id: radioId,
        task_id: taskId,
        project_type: projectType,
        project_name: projectName,
        tool_id: "extension",
      });
    }
  }, [selectedProject, currentRadio]);

  const openAdminUrl = () => {
    const adminUrl = currentRadio.radio.admin_url.startsWith("http")
      ? currentRadio.radio.admin_url
      : `https://${currentRadio.radio.admin_url}`;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0].id;
      chrome.tabs.update(currentTabId, { url: adminUrl });
    });
  };

  return (
    <div className="cust extension-panel">
      {/* Loading Indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Progress Section */}
      {!isLoading && (
        <div className="select-option-block block2">
          <div className="select-option1-wrapper">
            <p className="Weekly-text">Weekly progress</p>
            <p className="task-text">{completedTasksCount}/100 tasks</p>
          </div>
          <div className="select-option-wrapper">
            <div className="task1-type">
              <select
                value={selectedProject ? selectedProject.id : ""}
                onChange={handleProjectChange}
              >
                <option value="" disabled>
                  Select task type...
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <div className="blank-block">
              <div className="maintenance-icon">
                <img src={img3} alt="" />
                <p className="errorText">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Radio Details */}
      <>
        {currentRadio && selectedProject ? (
          <div className="extension-panel-1 task-block-4">
            <h3 className="panel-content-title">{currentRadio.radio.name}</h3>
            {selectedProject?.type === "maintenance" && (
              <div className="status-block-wrapper">
                <p className="status-data">Data pipeline</p>
                <div className={`status-${currentRadio.radio.pipeline}`}>
                  {currentRadio.radio.pipeline}
                </div>
              </div>
            )}

            {selectedProject?.type === "maintenance" ? (
              <Maintenance events={currentRadio.radio.events} />
            ) : (
              <Request
                country={currentRadio.radio.country}
                creationDate={currentRadio.radio.creation_date}
              />
            )}

            {/* Action Buttons */}
            <div className="Previous-btn-block">
              <button
                className="website-btn"
                onClick={() => window.open(currentRadio.radio.resources?.facebook, "_blank")}
              >
                <span className="globel-icon">
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26 16.5C26 22.0228 21.5228 26.5 16 26.5M26 16.5C26 10.9772 21.5228 6.5 16 6.5M26 16.5H6M16 26.5C10.4772 26.5 6 22.0228 6 16.5M16 26.5C18.5013 23.7616 19.9228 20.208 20 16.5C19.9228 12.792 18.5013 9.23835 16 6.5M16 26.5C13.4987 23.7616 12.0772 20.208 12 16.5C12.0772 12.792 13.4987 9.23835 16 6.5M6 16.5C6 10.9772 10.4772 6.5 16 6.5"
                      stroke="#1E1E1E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Website
              </button>
              <button
                className="admin-btn"
                onClick={openAdminUrl}>
                Open admin
              </button>
            </div>

            <div className="task4-bottom-btn">
              <button className="station-btn" onClick={() => setIsConfirming(true)}>
                <span className="bottom-btn-icon">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8334 4.5L6.50002 11.8333L3.16669 8.5"
                      stroke="#F5F5F5"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Next radio station
              </button>

              {/* Confirmation Button */}
              {isConfirming && (
                <div className="confirmation-block">
                  <button className="confirm-btn" onClick={handleConfirmNextRadio}>
                    <span className="bottom-btn-icon">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.8334 4.5L6.50002 11.8333L3.16669 8.5"
                          stroke="#F5F5F5"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              )}

              {/* Success message for Next radio station */}
              {successMessage === "Next radio station changed successfully!" && (
                <div className="success-message">
                  <p>{successMessage}</p>
                </div>
              )}

              {selectedProject?.type === "maintenance" && (
                <button
                  className="snooze-btn"
                  onClick={() => snoozeRadio(currentRadio.task_id, selectedProject.id)}
                >
                  <span className="bottom-btn-icon">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.50001 4.49999V8.49999L11.1667 9.83333M15.1667 8.49999C15.1667 12.1819 12.1819 15.1667 8.50001 15.1667C4.81811 15.1667 1.83334 12.1819 1.83334 8.49999C1.83334 4.8181 4.81811 1.83333 8.50001 1.83333C12.1819 1.83333 15.1667 4.8181 15.1667 8.49999Z"
                        stroke="#2C2C2C"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Snooze radio
                </button>
              )}

              {/* Success message for Snooze radio */}
              {successMessage === "Radio snoozed successfully!" && (
                <div className="success-message">
                  <p>{successMessage}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default Tasks;
