// routes/PrivateRoute.tsx

import React from 'react';
import { useAuth } from './AuthContext';

// Este componente não é mais usado para redirecionar.
// A lógica de redirecionamento agora vive em app/index.tsx e no layout raiz.
// A principal função do PrivateRoute agora é simplesmente não renderizar
// as telas privadas se o usuário não estiver autenticado, enquanto o
// redirecionamento acontece.

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    // 1. Ele ainda pergunta ao "gerente" se o usuário está logado.
    const { isAuthenticated, loading } = useAuth();

    // 2. Se o AuthContext ainda estiver carregando, não mostramos nada
    //    para evitar "piscadas" na tela. O index.tsx já está mostrando a tela de loading.
    if (loading) {
        return null; 
    }

    // 3. Se estiver autenticado, ele simplesmente renderiza o conteúdo da tela.
    //    Se não estiver, ele não renderiza nada, e o redirecionamento
    //    que o `index.tsx` ou o `logout` fazem vai assumir o controle.
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Se não estiver autenticado, não renderiza nada.
    return null;
};

export default PrivateRoute;
