import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database Verbindung herstellen
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Database Verbindung testen
export async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Datenbank-Verbindung erfolgreich!');
        const result = await client.query('SELECT NOW()');
        console.log('Aktuelle Zeit aus DB:', result.rows[0]);
        client.release();
    } catch (error) {
        console.error('Datenbank-Verbindung fehlgeschlagen:', error);
    }
}

export default pool;