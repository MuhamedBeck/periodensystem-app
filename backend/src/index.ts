import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './db/database';
import elementRoutes from './routes/elements.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Periodensystem API läuft!' });
});

// Alle Elemente abrufen
app.use('/api/elements', elementRoutes);

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

// CORS Policies setzen
app.use(cors({
    origin: ['http://localhost:4200',
        'https://periodensystem-frontend-51jnz8540-muhamed-nur-becks-projects.vercel.app',
        'https://periodensystem-frontend.vercel.app'
    ]
}))

testConnection();