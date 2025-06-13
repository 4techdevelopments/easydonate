import { ModalFeedback } from '@/components/ModalFeedback';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Definindo o formato do nosso contexto
interface ModalContextType {
    mostrarModalFeedback: (message: string, type: 'success' | 'error', duration?: number) => void;
}

const ModalFeedbackContext = createContext<ModalContextType | undefined>(undefined);

// O Provider é quem vai "abraçar" nosso app e fornecer o modal
export const ModalFeedbackProvider = ({ children }: { children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    const mostrarModalFeedback = (msg: string, feedbackType: 'success' | 'error', duration: number = 2100) => { // espera 2.1 segundos para  fechar automaticamente
        setMessage(msg);
        setType(feedbackType);
        setIsVisible(true);

        // Se for sucesso, fecha automaticamente depois de um tempo
        if (feedbackType === 'success') {
            setTimeout(() => {
                setIsVisible(false);
            }, duration);
        }
    };

    const hideModal = () => {
        setIsVisible(false);
    };

    return (
        <ModalFeedbackContext.Provider value={{ mostrarModalFeedback }}>
            {children}
            <ModalFeedback
                isVisible={isVisible}
                type={type}
                message={message}
                onClose={hideModal}
            />
        </ModalFeedbackContext.Provider>
    );
};

// O Hook é a forma fácil de usar o nosso contexto nas telas
export const useModalFeedback = () => {
    const context = useContext(ModalFeedbackContext);
    if (context === undefined) {
        throw new Error('useModalFeedback must be used within a ModalFeedbackProvider');
    }
    return context;
};