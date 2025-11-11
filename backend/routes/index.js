import express from 'express';
import authRoutes from './authRoutes.js';
import importRoutes from './importRoutes.js';
import queryRoutes from './queryRoutes.js';
import prestadorRoutes from './prestadorRoutes.js';
import billRoutes from './bills.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/import', importRoutes);
router.use('/query', queryRoutes);
router.use('/prestadores', prestadorRoutes);
router.use('/bills', billRoutes);



router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

export default router;
