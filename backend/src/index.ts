import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './db/database';
import elementRoutes from './routes/elements.routes';  // NEU!

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Periodensystem API läuft!' });
});

// Element Routes registrieren - NEU!
app.use('/api/elements', elementRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

testConnection();