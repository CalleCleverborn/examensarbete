import { Router, Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import requireAuth from "../middleware/auth";
import upload from "../middleware/upload";
import Transformation from "../../models/Transformation";

const router = Router();

router.post(
  "/",
  requireAuth,
  upload.single("soundFile"),
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
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

      const kitsApiKey = process.env.KITS_API_KEY;
      if (!kitsApiKey) {
        res.status(500).json({ error: "KITS_API_KEY not configured" });
        return;
      }

      const form = new FormData();
      form.append("voiceModelId", voiceModelId);
      form.append("soundFile", req.file.buffer, req.file.originalname);

      const response = await axios.postForm(
        "https://arpeggi.io/api/kits/v1/voice-conversions",
        form,
        { headers: { Authorization: `Bearer ${kitsApiKey}` }, timeout: 30000 }
      );

      const job = response.data;

      const newTransformation = await Transformation.create({
        userId: req.user._id,
        voiceModelId: Number(voiceModelId),
        jobId: job.id,
        status: job.status,
        jobStartTime: job.jobStartTime,
      });

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
  }
);

router.get("/", requireAuth, async (req: any, res: Response): Promise<void> => {
  try {
    const transformations = await Transformation.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

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

    const response = await axios.get("https://arpeggi.io/api/kits/v1/voice-models", {
      headers: { Authorization: `Bearer ${kitsApiKey}` },
      params: {
        order: "asc",
        page: 1,
        perPage: 10,
      },
    });

    res.status(200).json(response.data);
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
    const response = await axios.get(
      `https://arpeggi.io/api/kits/v1/voice-conversions/${transformation.jobId}`,
      { headers: { Authorization: `Bearer ${kitsApiKey}` } }
    );

    const updatedJob = response.data;

    if (updatedJob.status === "success" && updatedJob.outputFileUrl) {
      transformation.status = "success";
      transformation.outputFileUrl = updatedJob.outputFileUrl;
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

export default router;
