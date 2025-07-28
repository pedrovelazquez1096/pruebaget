import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Fingerprint } from 'lucide-react';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  h3 {
    color: #1f3a65;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }
`;

const FingerprintContainer = styled.div`
  margin: 20px auto;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  animation: ${pulse} 1s infinite;
`;

const Timer = styled.div`
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #e53e3e;
  background-color: #FED7D7;
  padding: 8px;
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FingerprintModal = ({ user, onClose, onSuccess }) => {
  const [status, setStatus] = useState('waiting');
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const success = Math.random() > 0.3; // 70% probabilidad de éxito
      if (success) {
        setStatus('success');
        setTimeout(onSuccess, 1000); // Simula éxito antes de cerrar
      } else {
        setStatus('error');
      }
    }
  }, [timeLeft, onSuccess]);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3>Gestión de Huella</h3>
        {status === 'waiting' && (
          <>
            <FingerprintContainer>
              <Fingerprint size={64} color="#3498db" />
            </FingerprintContainer>
            <p>Coloca tu dedo en el sensor</p>
            <Timer>Tiempo restante: {timeLeft}s</Timer>
          </>
        )}
        {status === 'success' && (
          <p>¡Huella registrada correctamente!</p>
        )}
        {status === 'error' && (
          <p>Error al registrar la huella.</p>
        )}
        <Button onClick={onClose}>Cerrar</Button>
      </Modal>
    </Overlay>
  );
};

export default FingerprintModal;