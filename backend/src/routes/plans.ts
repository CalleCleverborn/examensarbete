import { Router, Request, Response } from "express";
import Plan from "../../models/Plan";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });

    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

export default router;