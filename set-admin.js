import { adminAuth } from './api/firebaseAdmin.js';

// UID do seu usuário: danspda1@gmail.com
const uid = 'dBfvS9tkkyWDIocpkkTV2aBlVgJ3';

adminAuth.setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`SUCESSO: A permissão de Administrador foi concedida para o usuário com UID: ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('ERRO AO DEFINIR PERMISSÃO:', error);
    process.exit(1);
  });
