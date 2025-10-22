import { Router } from 'express';
import Athlete from '../models/Athlete.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const athletes = await Athlete.find().lean();
    res.json(athletes);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const doc = await Athlete.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

export default router;