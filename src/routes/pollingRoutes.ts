import { Router } from 'express';
import PollingController from '../controller/pollingController';

const router = Router();

router.get('/short-polling', PollingController.shortPolling);
router.get('/long-polling', PollingController.longPolling);

export default router;
