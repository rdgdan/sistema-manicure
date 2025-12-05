
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (authAction) => {
    setLoading(true);
    setError(null);
    try {
      await authAction();
      navigate('/'); // Redireciona para a raiz (Dashboard) após login/registro
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isRegistering
      ? () => createUserWithEmailAndPassword(auth, email, password)
      : () => signInWithEmailAndPassword(auth, email, password);
    handleAuth(action);
  };

  const handleGoogleSignIn = () => {
    handleAuth(() => signInWithPopup(auth, googleProvider));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Crie sua Conta' : 'Bem-vinda de Volta!'}</h2>
        <p>Acesse sua agenda e gerencie seus horários.</p>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Sua senha secreta" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <FaLock className="input-icon" />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Aguarde...' : (isRegistering ? 'Registrar Agora' : 'Entrar')}
          </button>
        </form>

        <div className="divider">ou</div>

        <button onClick={handleGoogleSignIn} className="google-button" disabled={loading}>
          <FcGoogle size={24} />
          <span>Entrar com Google</span>
        </button>

        <div className="toggle-form">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
            {isRegistering ? 'Faça Login' : 'Crie uma'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
