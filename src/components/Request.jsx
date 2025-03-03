
// Request.jsx
import img4 from '../assets/br.png';

const Request = ({ country, creationDate }) => {
  return (
    <div className="request-block-wrapper">
      <p className="request-data">Request</p>
      <div className="request-wrapper">
        <p>Country:</p>
        <p className="request-icon-wrapper">
         {country}
        </p>
      </div>
      <div className="request-wrapper">
        <p>Created:</p>
        <p>{new Date(creationDate).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
      </div>
    </div>
  );
};

export default Request;
