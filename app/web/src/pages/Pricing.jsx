import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const plans = [
  {
    name: "Free Plan",
    key: "free",
    price: 0,
    features: [
      "Basic features access",
      "Fixed access for Housing information",
    ],
  },
  {
    name: "Premium Plan",
    key: "premium",
    price: 15,
    features: [
      "Access to all features",
      //"Full access to Housing information",
      "Completely Ad-Free",
      "Regular updates",
    ],
    stripePriceId: "price_1Ryob6J6LIuw8SalP4nciIx7", // replace with your live ID in prod
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, subscribeFree, refresh } = useAuth()
  // Hide Pricing page entirely for admins
  if (user?.role === "admin") {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Admins do not need a plan.</div>;
  }
  
  const currentPlan = user?.subscription?.plan || "none"

  const handleSubscribe = async (plan) => {
    if (plan.key === "free") {
      try {
        await subscribeFree()
        navigate("/")
      } catch (e) {
        console.error(e)
      }
      return
    }

    // Premium → Stripe Checkout
    try {
      const res = await fetch("http://localhost:1617/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.stripePriceId }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        console.error("Stripe session URL missing:", data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      // just in case you mark plan in Success route later
      await refresh()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold mb-12">Choose Your Plan</h1>

      {/* Wider boxes, harmonious layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.key
          return (
            <div
              key={plan.key}
              className="flex flex-col bg-white rounded-2xl shadow-md p-10 w-full"
            >
              {/* Top content */}
              <div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="text-4xl font-extrabold mb-6">
                  ${plan.price}
                  <span className="text-lg font-semibold">/month</span>
                </div>

                {/* Features: no wrapping issues by giving enough width & spacing */}
                <ul className="space-y-2 mb-12">
                  {plan.features.map((f) => (
                    <li key={f} className="text-green-700">
                      ✔ {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button pinned to bottom */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrent}
                className={`mt-auto w-full py-3 rounded-lg font-semibold ${
                  isCurrent
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isCurrent ? "Current Plan" : "Subscribe Now"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}