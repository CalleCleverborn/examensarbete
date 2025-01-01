import React from "react";
import "./_MyPlan.scss";

const MyPlan: React.FC = () => {
  return (
    <div className="plan-page">
      <h1>Payment and pricing</h1>
      <div className="plans-wrapper">
        <div className="plan">
          <div className="title-desc-box">
            <h3>Base</h3>
            <p>For hobby use</p>
          </div>

          <h2>Free</h2>
          <ul>
            <li>
              <span>&#10003; </span>
              <span>5 conversions per month</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>16 voice models</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>10 minutes download time</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Wav download format</span>
            </li>
          </ul>
          <div className="select-plan-button">Change plan</div>
        </div>
        <div className="plan">
          <div className="title-desc-box">
            <h3>Premium</h3>
            <p>For more professional use</p>
          </div>
          <h2>$12.99</h2>
          <ul>
            <li>
              <span>&#10003; </span>
              <span>100 conversions per month</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Access Every Voice Model</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>60 minutes download time</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Wav download format</span>
            </li>
          </ul>
          <div className="select-plan-button">Change plan</div>
        </div>
        <div className="plan">
          <div className="title-desc-box">
            <h3>Enterprise</h3>
            <p>For studio grade creation</p>
          </div>
          <h2>$29.99</h2>
          <ul>
            <li>
              <span>&#10003; </span>
              <span>Unlimited conversions</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Access Every Voice Model</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Unlimited download time</span>
            </li>
            <li>
              <span>&#10003; </span>
              <span>Wav download format</span>
            </li>
          </ul>
          <div className="select-plan-button">Change plan</div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
