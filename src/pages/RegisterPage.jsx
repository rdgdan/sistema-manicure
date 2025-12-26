import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, AlertCircle } from 'lucide-react'; // Importa o ícone de usuário
import './Login.css'; 

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.2C5,8.13 8.36,5.12 12.18,5.12C14.4,5.12 16.03,6.06 16.96,6.96L19.23,4.72C17.22,2.83 14.85,1.6 12.18,1.6C6.7,1.6 2.43,6.17 2.43,12.2C2.43,18.23 6.7,22.8 12.18,22.8C17.66,22.8 21.6,18.88 21.6,12.42C21.6,11.83 21.49,11.47 21.35,11.1Z" />
    </svg>
);

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState(''); // Estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    try {
      // Passa o nome para a função de signup
      await signup(displayName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao criar a conta. Este e-mail pode já estar em uso.');
      console.error("Erro no registro com e-mail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
        await signInWithGoogle();
        navigate('/dashboard');
    } catch (error) {
        setError('Falha ao criar conta com o Google. Tente novamente.');
        console.error("Erro no registro com Google:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Crie sua conta</h2>
        <p>Comece a organizar seu negócio em poucos passos.</p>
      </div>

      {error && (
        <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
        </div>
      )}

      <button onClick={handleGoogleSignIn} className="auth-button google-auth-button" disabled={loading}>
        <GoogleIcon />
        <span>Criar conta com Google</span>
      </button>

      <div className="auth-divider">
        <span>OU</span>
      </div>

      <form onSubmit={handleEmailSubmit} className="auth-form" noValidate>
        {/* Campo de Nome Completo */}
        <div className="input-group">
          <User className="input-icon" size={20} />
          <input 
            type="text"
            placeholder="Nome Completo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input 
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input 
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input 
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta com E-mail'}
        </button>
      </form>

      <div className="auth-form-footer">
        <span>Já tem uma conta? </span>
        <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
