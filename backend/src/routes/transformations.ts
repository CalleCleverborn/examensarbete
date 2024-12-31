import { Router, Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import requireAuth from "../middleware/auth";
import upload from "../middleware/upload";
import Transformation from "../../models/Transformation";

const router = Router();


router.post("/", requireAuth, upload.single("soundFile"), async (req: any, res: Response, next: NextFunction) => {
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
      jobStartTime: job.jobStartTime,
    });

  
    res.status(201).json({
      _id: newTransformation._id,
      jobId: job.id,
      status: job.status,
    });
  } catch (error: any) {
    console.error("Error creating transformation:", error.message);
    res.status(500).json({ error: "Failed to create voice conversion job" });
  }
});


router.get("/", requireAuth, async (req: any, res: Response) => {
  try {
    const transformations = await Transformation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: transformations });
  } catch (error: any) {
    console.error("Error fetching transformations:", error.message);
    res.status(500).json({ error: "Failed to fetch transformations" });
  }
});


router.get("/voice-models", requireAuth, async (req: Request, res: Response) => {
  try {
    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 8;
    const order = (req.query.order as string) || "asc";

  
    const response = await axios.get("https://arpeggi.io/api/kits/v1/voice-models", {
      headers: { Authorization: `Bearer ${kitsApiKey}` },
      params: { page, perPage, order },
    });

  
    const mappedData = (response.data.data || []).map((model: any) => ({
      id: model.id,
      title: model.title,
      tags: model.tags ? model.tags.join(", ") : "",
      imageUrl: model.imageUrl || "https://via.placeholder.com/60", 
    }));

    res.status(200).json({
      data: mappedData,
      meta: response.data.meta, 
    });
  } catch (error: any) {
    console.error("Error fetching voice models:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch voice models" });
  }
});



router.get("/:id", requireAuth, async (req: any, res: Response) => {
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
      {
        headers: { Authorization: `Bearer ${kitsApiKey}` },
      }
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
  } catch (error: any) {
    console.error("Error fetching transformation:", error.message);
    res.status(500).json({ error: "Failed to fetch transformation" });
  }
});

export default router;
