import React, { useState, useEffect } from 'react';
import { Table, Button, Group, Title, Container, Loader, Center, Switch, Avatar, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EditUserModal from '../components/EditUserModal'; // Importa o novo modal

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Função para atualizar a lista de usuários localmente após a edição
  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser.data } : u));
    fetchUsers(); // Re-busca os dados para garantir consistência
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, { isAdmin: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !currentStatus } : u));
    } catch (error) {
      console.error("Erro ao atualizar status de admin:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação é irreversível.')) {
      const userDocRef = doc(db, 'users', userId);
      try {
        await deleteDoc(userDocRef);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  if (loading) {
    return <Center style={{ height: '100%' }}><Loader color="violet" /></Center>;
  }

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
            <Avatar src={user.photoURL} alt={user.displayName} radius="xl" />
            <div>
                <Text size="sm" fw={500}>{user.displayName || 'Nome não informado'}</Text>
                <Text size="xs" c="dimmed">{user.email}</Text>
            </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Switch
          checked={user.isAdmin || false}
          onChange={() => toggleAdminStatus(user.id, user.isAdmin)}
          label={user.isAdmin ? 'Admin' : 'Usuário'}
          color="violet"
        />
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          {/* Botão para abrir o modal de edição */}
          <Button 
            variant="light" 
            color="blue" 
            size="xs" 
            leftSection={<IconPencil size={14} />} 
            onClick={() => handleOpenEditModal(user)}
          >
            Editar
          </Button>
          <Button 
            variant="light" 
            color="red" 
            size="xs" 
            leftSection={<IconTrash size={14} />} 
            onClick={() => deleteUser(user.id)}
          >
            Excluir
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid p="lg">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Gestão de Usuários</Title>
      </Group>
      
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Usuário</Table.Th>
            <Table.Th>Função</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* Renderiza o modal */}
      <EditUserModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={selectedUser}
        onUserUpdate={handleUserUpdate}
      />
    </Container>
  );
};

export default AdminPage;
