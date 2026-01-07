import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTranslation } from '../hooks/useTranslation';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return t('login.errors.invalidEmail');
      case 'auth/user-disabled':
        return t('login.errors.userDisabled');
      case 'auth/user-not-found':
        return t('login.errors.userNotFound');
      case 'auth/wrong-password':
        return t('login.errors.wrongPassword');
      case 'auth/invalid-credential':
        return t('login.errors.invalidCredential');
      case 'auth/too-many-requests':
        return t('login.errors.tooManyRequests');
      default:
        return errorCode || t('login.errors.default');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-light text-gray-900 text-center mb-8">
          {t('login.title')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
          >
            {t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

