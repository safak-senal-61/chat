import { ChatLoader } from '@/components/chat-loader'; // Yeni yükleyici bileşenimizi import ediyoruz.

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <ChatLoader />
    </main>
  );
}