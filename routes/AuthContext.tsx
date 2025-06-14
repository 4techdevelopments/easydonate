import Colors from '@/components/Colors';
import EasyDonateSvg from '@/components/easyDonateSvg';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';

type JwtPayload = {
    exp: number;
};

type AuthContextType = {
    isAuthenticated: boolean;
    usuario: any | null;
    login: (token: string, usuario: any) => void;
    logout: () => void;
    atualizarUsuario: (novosDados: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usuario, setUsuario] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync("token");
            const userData = await SecureStore.getItemAsync("usuario");

            if (token && userData) {
                try {
                    const decoded: JwtPayload = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp > currentTime) {
                        setIsAuthenticated(true);
                        setUsuario(JSON.parse(userData));
                    } else {
                        setIsAuthenticated(false);
                        setUsuario(null);
                    }
                } catch (err) {
                    console.warn("Erro ao verificar o token", err);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string, usuario: any) => {
        SecureStore.setItemAsync("token", token);
        SecureStore.setItemAsync("usuario", JSON.stringify(usuario));
        setIsAuthenticated(true);
        setUsuario(usuario);
        // router.replace("/home");
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("usuario");
        setIsAuthenticated(false);
        setUsuario(null);
        router.replace("/inicio");
    };

    const atualizarUsuario = (novosDados: any) => {
    // Cria o novo objeto de usuário completo
    const usuarioAtualizado = {
        ...usuario,
        ...novosDados,
    };

    // Atualiza o estado do React para a UI refletir a mudança instantaneamente
    setUsuario(usuarioAtualizado);

    // Salva o novo objeto de usuário no SecureStore para persistir os dados
    SecureStore.setItemAsync("usuario", JSON.stringify(usuarioAtualizado));
};

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.BG }}>
                <EasyDonateSvg />
            </View>
        )
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, usuario, login, logout, atualizarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
