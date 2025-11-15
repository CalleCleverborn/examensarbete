import React, { useEffect, useState } from "react";
import "./_MyPlan.scss";

interface User {
  subscriptionPlan?: string;
  name?: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  conversionsPerMonth: number;
  voiceModelLimit: number;
  downloadTime: number;
  description: string;
  bulletPoints: string[];
}

interface MyPlanProps {
  user: User | null;
}

const MyPlan: React.FC<MyPlanProps> = ({ user }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://examensarbete.onrender.com/api/plans", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch plans. Status: ${response.status}`);
        }
        const data: Plan[] = await response.json();
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  async function handleChangePlan(planName: string) {
    try {
      const res = await fetch("https://examensarbete.onrender.com/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planName }),
      });
      if (!res.ok) {
        throw new Error(`Failed to initiate checkout: ${res.status}`);
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error changing plan:", error);
      alert("Failed to change plan. Check console for details.");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const userName = user?.name ?? "User";

  return (
    <div className="plan-page">
      <h1>Payment and Pricing</h1>

      <div className="plan-intro">
        <p>
          Hi {userName}, here you can see all our available subscription plans.
          Choose the plan that best fits your needs, or change your current plan
          if you want to upgrade or downgrade.
        </p>
        {user?.subscriptionPlan && (
          <p className="current-plan-info">
            You are currently on the <strong>{user.subscriptionPlan}</strong>{" "}
            plan.
          </p>
        )}
      </div>

      <div className="plans-wrapper">
        {plans.map((plan) => {
          const isSelected = user?.subscriptionPlan === plan.name;
          const displayPrice =
            plan.price === 0 ? "Free" : `$${plan.price.toFixed(2)}`;

          return (
            <div
              key={plan._id}
              className={`plan ${isSelected ? "selected" : ""}`}
            >
              <div className="title-desc-box">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <h2>{displayPrice}</h2>

              <ul>
                {plan.bulletPoints.map((point, idx) => (
                  <li key={idx}>
                    <span>✓ </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`select-plan-button ${isSelected ? "disabled" : ""}`}
                onClick={
                  !isSelected ? () => handleChangePlan(plan.name) : undefined
                }
              >
                {isSelected ? "Selected" : "Change plan"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="help-section">
        <h4>Need Help?</h4>
        <p>
          If you have any questions regarding billing or how to choose your
          plan, please check our{" "}
          <a href="/faq" target="_blank" rel="noreferrer">
            FAQ
          </a>{" "}
          or contact our support team.
        </p>
      </div>
    </div>
  );
};

export default MyPlan;
