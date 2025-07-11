import express from 'express';
import pool from '../db/database';

const router = express.Router();

// GET /api/elements
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.*,
                a.bezeichnung as aggregatzustand_name,
                k.bezeichnung as kategorie_name,
                ent.name as entdecker_name,
                ARRAY(
                    SELECT oxidationszahl 
                    FROM element_oxidationszahlen 
                    WHERE element_ordnungszahl = e.ordnungszahl
                    ORDER BY oxidationszahl
                ) as oxidationszahlen
            FROM element e
            LEFT JOIN aggregatzustand a ON e.aggregatzustand_id = a.id
            LEFT JOIN kategorie k ON e.kategorie_id = k.id
            LEFT JOIN entdecker ent ON e.entdecker_id = ent.id
            ORDER BY e.ordnungszahl
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Elemente:', error);
        res.status(500).json({
            error: 'Datenbankfehler',
            message: 'Es gab ein SQL fehler bei der Abfrage'
        });
    }
});

router.put('/:ordnungszahl', async (req, res) => {
    const { ordnungszahl } = req.params;
    const elementData = req.body;

    try {
        // SQL mit Platzhaltern ($1, $2, etc.) für Sicherheit
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
            ordnungszahl  // $8
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Element nicht gefunden' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update Fehler:', error);
        res.status(500).json({ error: 'Update fehlgeschlagen' });
    }
});

export default router;