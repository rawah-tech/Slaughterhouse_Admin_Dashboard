import React from "react";

import Map from "./Map";

const HomeMap = ({ center }) => (
  <div className="my-4">
    {center ? (
      <Map center={center} height="300px" zoom={15} />
    ) : (
      <div className="alert alert-info" role="status">
        لا تتوفر إحداثيات صالحة لهذا الطلب.
      </div>
    )}
  </div>
);

export default HomeMap;
