import React from "react";
import { Link } from "react-router-dom";

const BottomWarning = ({ label, buttonText, to }) => {
  return (
    <div>
      <div className="py-2 text-sm flex justify-center">
        <div>{label}</div>
        <Link className="pointer underline pl-1 cursor-pointer" to={to}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default BottomWarning;
