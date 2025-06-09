"use client"; // BU SATIR EN ÖNEMLİSİ!

import dynamic from 'next/dynamic';

// Chat bileşenini, SSR kapalı şekilde dinamik olarak import ediyoruz.
const ChatWithNoSSR = dynamic(
  () => import('@/components/chat').then((mod) => mod.Chat),
  { 
    ssr: false, // Sunucu tarafı render'ı KAPAT
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Sohbet arayüzü yükleniyor...</p>
        </div>
      </div>
    )
  }
);

// Bu yeni bileşen, sadece ChatWithNoSSR'ı render etmekle görevli.
export function ChatLoader() {
  return <ChatWithNoSSR />;
}