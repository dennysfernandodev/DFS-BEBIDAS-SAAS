const cards = [
  ['Comerciantes ativos', '0', 'Cadastros, lojas, planos e bloqueios'],
  ['Motoboys aprovados', '0', 'Disponibilidade e operação DFS'],
  ['Receita recorrente', 'R$ 0,00', 'Mensalidades pagas no período'],
  ['Cobranças em atraso', '0', 'Assinaturas que exigem ação'],
];

const menu = [
  'Visão geral', 'Comerciantes', 'Lojas', 'Motoboys', 'Pedidos', 'Entregas DFS',
  'Planos e preços', 'Assinaturas', 'Cobranças', 'WhatsApp e IA', 'Regras e taxas',
  'Usuários e permissões', 'Auditoria', 'Backups', 'Configurações'
];

export default function AdminDashboard() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><strong>DFS</strong><span>SaaS Admin</span></div>
        <nav>{menu.map((item, index) => <a className={index === 0 ? 'active' : ''} href="#" key={item}>{item}</a>)}</nav>
      </aside>
      <section className="content">
        <header><div><small>PAINEL GERAL</small><h1>Controle central da operação</h1><p>Comerciantes, lojas, motoboys, cobranças e integrações em um só lugar.</p></div><button>+ Novo comerciante</button></header>
        <div className="cards">{cards.map(([title, value, note]) => <article key={title}><span>{title}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
        <div className="grid">
          <section className="panel"><div className="panelTitle"><h2>Operação ao vivo</h2><span>Atualização automática</span></div><div className="empty"><strong>Nenhum pedido em andamento</strong><p>Pedidos e entregas aparecerão aqui em tempo real.</p></div></section>
          <section className="panel"><div className="panelTitle"><h2>Ações necessárias</h2></div><ul><li><span>Comerciantes aguardando aprovação</span><b>0</b></li><li><span>Motoboys aguardando documentos</span><b>0</b></li><li><span>Cobranças vencidas</span><b>0</b></li><li><span>Falhas em integrações</span><b>0</b></li></ul></section>
        </div>
        <section className="panel modules"><div className="panelTitle"><h2>Módulos administrativos</h2></div><div className="moduleGrid">{menu.slice(1).map(item => <button key={item}>{item}<span>Gerenciar →</span></button>)}</div></section>
      </section>
    </main>
  );
}
