// contexts/ModalFeedbackContext.tsx

import { ModalFeedback } from '@/components/ModalFeedback';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// --- INTERFACE ATUALIZADA ---
// A função agora declara que pode receber um 'title' opcional.
interface ModalContextType {
    mostrarModalFeedback: (message: string, type: 'success' | 'error', duration?: number, title?: string) => void;
}

const ModalFeedbackContext = createContext<ModalContextType | undefined>(undefined);

export const ModalFeedbackProvider = ({ children }: { children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');
    // --- NOVO ESTADO PARA O TÍTULO ---
    const [title, setTitle] = useState<string | undefined>(undefined);

    const mostrarModalFeedback = (
        msg: string, 
        feedbackType: 'success' | 'error', 
        duration: number = 2100,
        // O novo parâmetro 'customTitle' é recebido aqui
        customTitle?: string 
    ) => {
        setMessage(msg);
        setType(feedbackType);
        // O estado do título é atualizado com o valor recebido
        setTitle(customTitle); 
        setIsVisible(true);

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
                // O estado do título é passado como prop para o componente do modal
                title={title}
                onClose={hideModal}
            />
        </ModalFeedbackContext.Provider>
    );
};

export const useModalFeedback = () => {
    const context = useContext(ModalFeedbackContext);
    if (context === undefined) {
        throw new Error('useModalFeedback must be used within a ModalFeedbackProvider');
    }
    return context;
};
