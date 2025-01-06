import React, { useEffect, useState } from "react";
import "./_MyPlan.scss";

interface User {
  subscriptionPlan?: string;
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
        const response = await fetch("http://localhost:4000/api/plans", {
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
      const res = await fetch("http://localhost:4000/api/stripe/checkout", {
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

  return (
    <div className="plan-page">
      <h1>Payment and Pricing</h1>

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
    </div>
  );
};

export default MyPlan;
