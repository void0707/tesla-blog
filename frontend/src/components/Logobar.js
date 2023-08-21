import React from "react";
import "./Logobar.css";
function Logobar() {
  return (
    <div className="header">
      <img
        src={process.env.PUBLIC_URL + "/logo.png"}
        className="logo"
        alt="logo"
      />
    </div>
  );
}

export default Logobar;
