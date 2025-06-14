// routes/AuthContext.tsx

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
    loading: boolean; // 1. Adicionado a propriedade 'loading' aqui
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
                        // Token expirado
                        setIsAuthenticated(false);
                        setUsuario(null);
                        // Opcional: remover o token expirado
                        await SecureStore.deleteItemAsync("token");
                        await SecureStore.deleteItemAsync("usuario");
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
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("usuario");
        setIsAuthenticated(false);
        setUsuario(null);
        router.replace("/inicio");
    };

    const atualizarUsuario = (novosDados: any) => {
        const usuarioAtualizado = {
            ...usuario,
            ...novosDados,
        };
        setUsuario(usuarioAtualizado);
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
        // 2. A propriedade 'loading' agora é fornecida para o resto do app
        <AuthContext.Provider value={{ isAuthenticated, usuario, loading, login, logout, atualizarUsuario }}>
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
