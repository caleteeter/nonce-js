import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/nonce', routes.nonce);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Nonce manager api app listening on port ${process.env.PORT || 8080}`)
});