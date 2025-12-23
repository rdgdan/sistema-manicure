import admin from 'firebase-admin';

// Evita reinicializações desnecessárias em ambientes serverless.
if (!admin.apps.length) {
  try {
    // O método robusto: usar uma única variável de ambiente com o JSON da chave de serviço em Base64.
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_BASE64 é obrigatória.');
    }

    // Decodifica a string Base64 para obter o JSON original.
    const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log("Firebase Admin SDK inicializado com sucesso via Base64!");

  } catch (error) {
    // Log de erro detalhado para facilitar a depuração nos logs da Vercel.
    console.error('ERRO CRÍTICO AO INICIALIZAR FIREBASE ADMIN:', error.message);
    if (error instanceof SyntaxError) {
      console.error('CAUSA PROVÁVEL: A string Base64 não foi decodificada para um JSON válido. Verifique se o conteúdo completo do arquivo .json foi codificado.');
    } else if (error.message.includes('permission-denied') || error.message.includes('private key')) {
        console.error('CAUSA PROVÁVEL: O valor da variável FIREBASE_SERVICE_ACCOUNT_BASE64 está mal formatado ou a chave é inválida. Por favor, recodifique o arquivo JSON completo.');
    }
  }
}

// Exporta as instâncias do Admin SDK.
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { admin, adminAuth, adminDb };
