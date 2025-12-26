import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Group, Loader, Text, Alert } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { IconAlertCircle } from '@tabler/icons-react';

const EditUserModal = ({ isOpen, onClose, user, onUserUpdate }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { adminUpdateUser, sendAdminPasswordResetEmail } = useAuth();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setError('');
      setResetSent(false);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!displayName || !email) {
        setError("Nome e e-mail não podem ficar em branco.");
        return;
    }

    setLoading(true);
    setError('');

    try {
        const updatedData = { displayName, email };
        await adminUpdateUser(user.id, updatedData);
        onUserUpdate({ id: user.id, data: updatedData });
        onClose();
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        setError("Falha ao salvar as alterações. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    setLoading(true);
    setError('');
    setResetSent(false);

    try {
        await sendAdminPasswordResetEmail(user.email);
        setResetSent(true);
    } catch (err) {
        console.error("Erro ao enviar e-mail de redefinição:", err);
        setError(`Falha ao enviar e-mail. Verifique se o endereço "${user.email}" é válido.`);
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal opened={isOpen} onClose={onClose} title={`Editar Usuário: ${user.displayName || user.email}`}>
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" withCloseButton onClose={() => setError('')} mb="md">
          {error}
        </Alert>
      )}
      {resetSent && (
        <Alert color="green" withCloseButton onClose={() => setResetSent(false)} mb="md">
          E-mail de redefinição de senha enviado para {user.email}!
        </Alert>
      )}
      
      <TextInput
        label="Nome Completo"
        placeholder="Nome do usuário"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        mb="sm"
        disabled={loading}
      />
      <TextInput
        label="Endereço de E-mail"
        placeholder="email@exemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb="lg"
        disabled={loading}
        description="Alterar este campo não muda o e-mail de login, apenas a exibição no sistema."
      />

      <Group justify="space-between">
        <Button 
            variant="outline" 
            color="orange" 
            onClick={handleSendPasswordReset} 
            loading={loading && !resetSent} 
            disabled={resetSent}
        >
          {resetSent ? "E-mail Enviado" : "Redefinir Senha"}
        </Button>
        <Button onClick={handleSaveChanges} loading={loading && resetSent}>
          Salvar Alterações
        </Button>
      </Group>
    </Modal>
  );
};

export default EditUserModal;
