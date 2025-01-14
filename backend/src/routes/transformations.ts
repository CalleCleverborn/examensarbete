import { Router, Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import requireAuth from "../middleware/auth";
import upload from "../middleware/upload";
import Transformation from "../models/Transformation";
import Plan from "../models/Plan";
import User from "../models/User";

const router = Router();


router.post("/", requireAuth, upload.single("soundFile"), async (req: any, res: Response): Promise<void> => {
  try {
    const { voiceModelId } = req.body;

    if (!voiceModelId) {
      res.status(400).json({ error: "voiceModelId is required" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "soundFile is required" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const plan = await Plan.findOne({ name: user.subscriptionPlan });
    if (!plan) {
      res.status(400).json({ error: "Invalid subscription plan" });
      return;
    }

  
    if (plan.conversionsPerMonth !== 99999) {
      if ((user.usedTransformations || 0) >= plan.conversionsPerMonth) {
        res.status(403).json({ error: "You have reached your monthly transformations limit." });
        return;
      }
    }

    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

 
    const form = new FormData();
    form.append("voiceModelId", voiceModelId);
    form.append("soundFile", req.file.buffer, req.file.originalname);


    const originalFilename = req.file.originalname;

 
    let voiceModelName = "";
    try {
      const modelResponse = await axios.get(
        `https://arpeggi.io/api/kits/v1/voice-models/${voiceModelId}`,
        { headers: { Authorization: `Bearer ${kitsApiKey}` } }
      );
      voiceModelName = modelResponse.data?.title || "";
    } catch (err) {
      console.warn("Could not fetch voiceModelName for ID:", voiceModelId);
   
    }


    const response = await axios.postForm(
      "https://arpeggi.io/api/kits/v1/voice-conversions",
      form,
      {
        headers: { Authorization: `Bearer ${kitsApiKey}` },
        timeout: 30000,
      }
    );

    const job = response.data;

   
    const newTransformation = await Transformation.create({
      userId: req.user._id,
      voiceModelId: Number(voiceModelId),
      jobId: job.id,
      status: job.status,
      jobStartTime: job.jobStartTime ? new Date(job.jobStartTime) : new Date(),
      originalFilename, 
      voiceModelName,   
    });

 
    user.usedTransformations = (user.usedTransformations || 0) + 1;
    await user.save();

 
    res.status(201).json({
      _id: newTransformation._id,
      jobId: job.id,
      status: job.status,
    });
    return;
  } catch (error: any) {
    console.error("Error creating transformation:", error.message);
    res.status(500).json({ error: "Failed to create voice conversion job" });
    return;
  }
});


router.get("/", requireAuth, async (req: any, res: Response): Promise<void> => {
  try {
    const transformations = await Transformation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ data: transformations });
    return;
  } catch (error: any) {
    console.error("Error fetching transformations:", error.message);
    res.status(500).json({ error: "Failed to fetch transformations" });
    return;
  }
});


router.get("/voice-models", requireAuth, async (req: any, res: Response): Promise<void> => {
  try {
    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const plan = await Plan.findOne({ name: user.subscriptionPlan });
    if (!plan) {
      res.status(400).json({ error: "Invalid subscription plan" });
      return;
    }

    const response = await axios.get("https://arpeggi.io/api/kits/v1/voice-models", {
      headers: { Authorization: `Bearer ${kitsApiKey}` },
      params: {
        page: 1,
        perPage: 1000,
        order: "asc",
      },
    });

    let allModels = (response.data.data || []).map((model: any) => ({
      id: model.id,
      title: model.title,
      tags: model.tags ? model.tags.join(", ") : "",
      imageUrl: model.imageUrl || "https://via.placeholder.com/60",
    }));

    if (plan.voiceModelLimit !== 99999) {
      allModels = allModels.slice(0, plan.voiceModelLimit);
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 8;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const paginatedModels = allModels.slice(startIndex, endIndex);

    const total = allModels.length;
    const lastPage = Math.ceil(total / perPage);

    const meta = {
      currentPage: page,
      lastPage,
      perPage,
      total,
    };

    res.status(200).json({ data: paginatedModels, meta });
    return;
  } catch (error: any) {
    console.error("Error fetching voice models:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch voice models" });
    return;
  }
});


router.get("/:id", requireAuth, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid transformation ID" });
      return;
    }

    const transformation = await Transformation.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (!transformation) {
      res.status(404).json({ error: "Transformation not found" });
      return;
    }

    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

    const response = await axios.get(
      `https://arpeggi.io/api/kits/v1/voice-conversions/${transformation.jobId}`,
      { headers: { Authorization: `Bearer ${kitsApiKey}` } }
    );

    const updatedJob = response.data;

    if (updatedJob.status === "success" && updatedJob.outputFileUrl) {
      transformation.status = "success";
      transformation.outputFileUrl = updatedJob.outputFileUrl;
      transformation.jobEndTime = new Date();
      await transformation.save();
    }

    res.status(200).json({
      _id: transformation._id,
      status: transformation.status,
      jobId: transformation.jobId,
      outputFileUrl: transformation.outputFileUrl,
    });
    return;
  } catch (error: any) {
    console.error("Error fetching transformation:", error.message);
    res.status(500).json({ error: "Failed to fetch transformation" });
    return;
  }
});


router.delete("/:id", requireAuth, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid transformation ID" });
      return;
    }

    const transformation = await Transformation.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (!transformation) {
      res.status(404).json({ error: "Transformation not found" });
      return;
    }

    await transformation.deleteOne();

    res.status(200).json({ message: "Transformation deleted" });
    return;
  } catch (error: any) {
    console.error("Error deleting transformation:", error.message);
    res.status(500).json({ error: "Failed to delete transformation" });
    return;
  }
});

export default router;
