import './load-env.js';

import express from 'express';
import db from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import cors from 'cors';

import candidateRoutes from './routes/candidateRoutes.js';
import voterRoutes from './routes/voterRoutes.js';
import votesRoutes from './routes/votesRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import queriesRoutes from './routes/queriesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf8'));

app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

db.getConnection()
  .then(() => console.log('Connection successful'))
  .catch((err) => console.error('Connection Failed:', err));


app.use('/api/candidates', candidateRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/queries', queriesRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});


