import express from 'express';
import pool from '../db/database';
import { getElements } from '../services/dataService';

const router = express.Router();

// GET /api/elements - nutzt jetzt dataService
router.get('/', async (req, res) => {
    try {
        const elements = await getElements();
        res.json(elements);
    } catch (error) {
        console.error('Fehler beim Abrufen der Elemente:', error);
        res.status(500).json({
            error: 'Fehler beim Abrufen der Elemente'
        });
    }
});

// PUT /api/elements/:ordnungszahl
router.put('/:ordnungszahl', async (req, res) => {
    const { ordnungszahl } = req.params;
    const elementData = req.body;

    try {
        const result = await pool.query(`
            UPDATE element 
            SET 
                name = $1,
                symbol = $2,
                atommasse = $3,
                siedepunkt = $4,
                schmelzpunkt = $5,
                elektronegativitaet = $6,
                dichte = $7
            WHERE ordnungszahl = $8
            RETURNING *
        `, [
            elementData.name,
            elementData.symbol,
            elementData.atommasse,
            elementData.siedepunkt,
            elementData.schmelzpunkt,
            elementData.elektronegativitaet,
            elementData.dichte,
            ordnungszahl
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Element nicht gefunden' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update Fehler:', error);
        res.status(503).json({
            error: 'Datenbank offline - Änderungen können nicht gespeichert werden',
            element: elementData
        });
    }
});

export default router;