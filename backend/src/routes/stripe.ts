import { Router, Request, Response } from "express";
import Stripe from "stripe";
import requireAuth from "../middleware/auth";
import Plan from "../models/Plan";
import User from "../models/User";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});

router.post("/checkout", requireAuth, async (req: any, res: Response) => {
  try {
    const { planName } = req.body;
    if (!planName) {
      res.status(400).json({ error: "planName is required" });
      return;
    }

    const plan = await Plan.findOne({ name: planName });
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const product = await stripe.products.create({
      name: plan.name,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(plan.price * 100),
      currency: "usd",
      product: product.id,
      recurring: {
        interval: "month",
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "subscription",
      success_url: "https://backend-qrwq.onrender.com/api/stripe/success?planName=" + plan.name,
      cancel_url: "https://vocalflow.netlify.app/app/my-plan",
      client_reference_id: req.user._id.toString(),
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating Checkout Session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/success", async (req: any, res: Response) => {
  try {
    const { planName } = req.query;
    if (!planName) {
      res
        .status(400)
        .send("Missing planName in query params. Subscription not updated.");
      return;
    }

    if (!req.user) {
      res
        .status(401)
        .send("You must be logged in to update subscription plan.");
      return;
    }

    const plan = await Plan.findOne({ name: planName });
    if (!plan) {
      res.status(404).send("Plan not found in DB. Cannot update user.");
      return;
    }

    await User.findByIdAndUpdate(req.user._id, {
      subscriptionPlan: plan.name,
      usedTransformations: 0,
    });

    res.redirect("https://vocalflow.netlify.app/app/my-plan");
  } catch (error: any) {
    console.error("Error updating subscription plan:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
