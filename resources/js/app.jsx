import './bootstrap';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import AuthContextProvider from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <Home />
    </AuthContextProvider>
);
