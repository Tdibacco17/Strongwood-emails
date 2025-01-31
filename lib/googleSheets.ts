import { google } from 'googleapis';

// Verifica si la clave de servicio está definida en el entorno
const serviceAccountKeyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKeyEnv) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not defined.');
}
// Decodifica la clave de servicio de la variable de entorno
const decodedKey = Buffer.from(serviceAccountKeyEnv, 'base64').toString('utf-8');
const serviceAccountKey = JSON.parse(decodedKey);

// Configura la autenticación con Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Crear un cliente para la API de Sheets
const sheets = google.sheets({ version: 'v4', auth });

export { sheets };
