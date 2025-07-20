import pool from '../db/database';
import elementsBackup from '../data/elements-backup.json';

let dbAvailable = true;
let lastDbCheck = 0;
const DB_CHECK_INTERVAL = 60000; // Check alle 60 Sekunden

// Type für Backup-Daten definieren
interface ElementBackup {
    Ordnungszahl: number;
    Symbol: string;
    Name: string;
    Atommasse: number;
    Aggregatzustand: string;
    Kategorie: string;
    "Siedepunkt (K)": number;
    "Schmelzpunkt (K)": number;
    Elektronegativität: number;
    "Dichte (g/cm³)"?: number;
    Entdeckt: string;
    Gruppe: number | null;
    Periode: number;
    Oxidationszahlen?: string;
}

export async function getElements() {
    // Prüfe DB-Verfügbarkeit nur alle 60 Sekunden
    const now = Date.now();
    if (now - lastDbCheck > DB_CHECK_INTERVAL) {
        dbAvailable = await checkDbConnection();
        lastDbCheck = now;
    }

    if (!dbAvailable) {
        console.log('Nutze Backup-Daten');
        return transformBackupData();
    }

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
        return result.rows;
    } catch (error) {
        dbAvailable = false;
        return transformBackupData();
    }
}

async function checkDbConnection(): Promise<boolean> {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch {
        return false;
    }
}

function transformBackupData() {
    return (elementsBackup as any[]).map(el => ({
        // Basis-Felder
        ordnungszahl: el.Ordnungszahl,
        symbol: el.Symbol,
        name: el.Name,
        atommasse: el.Atommasse,

        // Aggregatzustand und Kategorie als Text (nicht ID!)
        aggregatzustand_name: el.Aggregatzustand,
        kategorie_name: el.Kategorie,

        // Zahlen-Felder
        siedepunkt: el['Siedepunkt (K)'],
        schmelzpunkt: el['Schmelzpunkt (K)'],
        elektronegativitaet: el.Elektronegativität,
        dichte: el['Dichte (g/cm³)'],

        // Text-Felder
        entdecker_name: el.Entdeckt,

        // Position (kann null sein!)
        gruppe: el.Gruppe,
        periode: el.Periode,

        // Oxidationszahlen als Array
        oxidationszahlen: el.Oxidationszahlen
            ? el.Oxidationszahlen.split(', ').map((n: string) => parseInt(n.trim()))
            : []
    }));
}