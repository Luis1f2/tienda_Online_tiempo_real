import { Request, Response } from 'express';
import Producto from '../model/productoModel';

class PollingController {
    public async shortPolling(req: Request, res: Response): Promise<void> {
        try {
            const productos = await Producto.find();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    public async longPolling(req: Request, res: Response): Promise<void> {
        try {
            const data = await new Promise((resolve) => {
                setTimeout(async () => {
                    const productos = await Producto.find();
                    resolve(productos);
                }, 5000);
            });
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }
}

export default new PollingController();
