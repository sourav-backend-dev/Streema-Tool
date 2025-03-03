// Maintenance.jsx
const Maintenance = ({ events }) => {
    return (
      <div className="Previous-block Task">
        <h4 className="event-text">
          <span className="clock-icon">
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
          Previous events
        </h4>
        <div className="Previous-content Task">
          {events.map((event, index) => (
            <div className="event-text-wrapper" key={index}>
              <p className="event-info-text">{event.name}</p>
              <p>{new Date(event.date).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Maintenance;
  