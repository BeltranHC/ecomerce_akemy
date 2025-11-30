'use client';

import { AdminChatPanel } from '@/components/admin/chat-panel';

export default function AdminMensajesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">
          Gestiona las conversaciones con tus clientes en tiempo real
        </p>
      </div>

      <AdminChatPanel />
    </div>
  );
}
