import React from "react";
export function Display(props) {
  return (
    <>
      <label htmlFor="lat">Latitude:</label>
      <input
        type="number"
        name="lat"
        placeholder="latitude"
        onChange={props.onChange}
        value={props.userLat}
      />
      <label htmlFor="lon">Longitude:</label>
      <input
        type="number"
        name="lon"
        placeholder="longitude"
        onChange={props.onChange}
        value={props.userLon}
      />
      <br />
      <input type="submit" id="submit" onClick={props.onSubmit} />
      <br />
      <label className="leftside" htmlFor="time">
        Time Until Forecast:{" "}
      </label>
      <br />
      <input
        min="0"
        max="117"
        step="3"
        type="range"
        name="time"
        className="leftside"
        disabled={props.rangeDisabled}
        value={props.rangeValue}
        onChange={props.regulateTime}
      />
      <br />
      <input
        type="text"
        value={props.timeValue}
        style={{ textAlign: "center" }}
        className="leftside"
        disabled
      />
      <input
        type="text"
        id="location"
        value={props.location}
        style={{ textAlign: "center" }}
        readOnly
      />
      <input
        type="text"
        id="temperature"
        value={props.temperature}
        style={{ textAlign: "center" }}
        readOnly
      />
      <input //will show actual time
        className="dateTimeB"
        type="text"
        value={props.dateTime}
        style={{ textAlign: "center" }}
        readOnly
      />
      <input
        className="weatherMoji"
        type="text"
        value={props.weatherMoji}
        readOnly
      />
    </>
  );
}
