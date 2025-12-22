import admin from 'firebase-admin';

// A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY conterá o JSON da sua chave de serviço.
// Vamos verificar se as credenciais já foram carregadas para evitar reinicializações.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    });
  } catch (error) {
    console.error('Falha ao inicializar o Firebase Admin SDK:', error);
  }
}

// Exportamos o objeto 'auth' e 'firestore' do admin para serem usados em nossas funções de API.
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { admin, adminAuth, adminDb };
