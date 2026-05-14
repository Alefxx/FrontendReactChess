// src/features/profile/ProfileView.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfileView() {
  // Estados locais para persistência temporária dos dados do formulário
  const [name, setName] = useState('Magnus Carlsen');
  const [email, setEmail] = useState('magnus@chess.com');

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
      <h2 className="text-2xl font-bold mb-8 text-white text-center">Editar Perfil</h2>
      
      <div className="flex flex-col gap-6 mb-10">
        {/* Input controlado: o valor é vinculado ao estado 'name' */}
        <Input 
          label="Nome de Usuário" 
          value={name} 
          onChange={setName} 
          placeholder="Ex: MestreDoXadrez"
        />

        {/* Input de e-mail com validação nativa de tipo */}
        <Input 
          label="E-mail" 
          type="email" 
          value={email} 
          onChange={setEmail}
          placeholder="seu@email.com"
        />
      </div>

      <div className="flex flex-col gap-3">
        {/* Acionamento da lógica de salvamento com os dados atuais do estado */}
        <Button label="Salvar Alterações" onClick={() => console.log('Salvando...', {name, email})} />
        <Button label="Cancelar" variant="secondary" onClick={() => {}} />
      </div>
    </div>
  );
}
