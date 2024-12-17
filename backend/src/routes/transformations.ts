import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { requireAuth } from '../middleware/auth';
import upload from '../middleware/upload';
import Transformation from '../../models/Transformation';

const router = Router();


router.post('/', requireAuth, upload.single('soundFile'), async (req: any, res: Response, next: NextFunction) => {
  try {
    const { voiceModelId } = req.body;
    if (!voiceModelId) {
      res.status(400).json({ error: 'voiceModelId is required' });
      return; 
    }

    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

    const form = new FormData();
    form.append('voiceModelId', voiceModelId);
    if (!req.file) {
      res.status(400).json({ error: 'soundFile is required' });
      return;
    }
    form.append('soundFile', fs.createReadStream(req.file.path));

    const response = await axios.post('https://arpeggi.io/api/kits/v1/voice-conversions', form, {
      headers: {
        Authorization: `Bearer ${kitsApiKey}`,
        ...form.getHeaders()
      }
    });

    const job = response.data;

    const newTransformation = await Transformation.create({
      userId: req.user._id,
      voiceModelId: Number(voiceModelId),
      jobId: job.id,
      status: job.status,
      jobStartTime: job.jobStartTime,
      originalFileUrl: req.file.path
    });

    res.json(newTransformation);
    return;

  } catch (error: any) {
    console.error("Error creating voice conversion job:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create voice conversion job" });
    return;
  }
});


router.get('/', requireAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    const transformations = await Transformation.find({ userId: req.user._id })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = await Transformation.countDocuments({ userId: req.user._id });

    res.json({
      data: transformations,
      meta: {
        currentPage: page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    });
    return;

  } catch (error: any) {
    console.error("Error fetching transformations:", error.message);
    res.status(500).json({ error: "Failed to fetch transformations" });
    return;
  }
});


router.get('/:id', requireAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const transformation = await Transformation.findOne({ _id: id, userId: req.user._id });

    if (!transformation) {
      res.status(404).json({ error: 'Transformation not found' });
      return;
    }

    const kitsApiKey = process.env.KITS_API_KEY;
    if (!kitsApiKey) {
      res.status(500).json({ error: "KITS_API_KEY not configured" });
      return;
    }

    const response = await axios.get(`https://arpeggi.io/api/kits/v1/voice-conversions/${transformation.jobId}`, {
      headers: { Authorization: `Bearer ${kitsApiKey}` }
    });

    const updatedJob = response.data;
    if (updatedJob.status !== transformation.status) {
      transformation.status = updatedJob.status;
      transformation.jobStartTime = updatedJob.jobStartTime;
      transformation.jobEndTime = updatedJob.jobEndTime;
      await transformation.save();
    }

    res.json(transformation);
    return;

  } catch (error: any) {
    console.error("Error fetching transformation status:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch transformation status" });
    return;
  }
});

export default router;
