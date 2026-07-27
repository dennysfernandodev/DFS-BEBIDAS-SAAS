import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DFS SaaS Admin',
  description: 'Painel central de comerciantes, lojas, motoboys, cobranças e operação DFS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
