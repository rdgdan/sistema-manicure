
import React from 'react';
import './Dashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList
} from 'recharts';
import { FiUsers, FiCalendar, FiDollarSign, FiUserPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';

// --- DADOS DOS KPIs ---
const kpiData = {
  clients: [
    { title: 'Clientes Atendidos', value: '128', change: '+15%', changeType: 'positive', icon: <FiUsers /> },
    { title: 'Agendamentos do Mês', value: '42', change: '+5%', changeType: 'positive', icon: <FiCalendar /> },
    { title: 'Novos Clientes', value: '8', change: '-10%', changeType: 'negative', icon: <FiUserPlus /> },
  ],
  revenue: [
    { title: 'Receita do Mês', value: 'R$ 6.000,00', change: '+20%', changeType: 'positive', icon: <FiDollarSign /> },
  ]
};

// --- DADOS DOS GRÁFICOS ---
const revenueData = [
  { name: 'Jan', receita: 4000 }, { name: 'Fev', receita: 3000 },
  { name: 'Mar', receita: 5000 }, { name: 'Abr', receita: 4500 },
  { name: 'Mai', receita: 6000 }, { name: 'Jun', receita: 5500 },
];

const clientData = [
  { name: 'Jan', clientes: 20 }, { name: 'Fev', clientes: 25 },
  { name: 'Mar', clientes: 22 }, { name: 'Abr', clientes: 30 },
  { name: 'Mai', clientes: 28 }, { name: 'Jun', clientes: 35 },
];

// NOVO GRÁFICO: Modelos de unha mais realizados
const nailModelData = [
    { name: 'Francesinha', count: 45 },
    { name: 'Stiletto', count: 30 },
    { name: 'Amendoada', count: 25 },
    { name: 'Bailarina', count: 18 },
    { name: 'Fibra de Vidro', count: 12 },
];
const COLORS = ['#BF93FD', '#A073E8', '#8155D0', '#6237B9', '#4E2C94'];

// --- COMPONENTES REUTILIZÁVEIS ---
const KpiCard = ({ title, value, change, changeType, icon }) => (
  <div className="kpi-card">
    <div className="kpi-icon-wrapper">{icon}</div>
    <div className="kpi-content">
        <h4>{title}</h4>
        <p>{value}</p>
        <div className={`kpi-change ${changeType}`}>
            {changeType === 'positive' ? <FiArrowUp /> : <FiArrowDown />}
            <span>{change.replace(/[+-]/g, '')}</span>
        </div>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="main-header">
        <h2>Dashboard</h2>
        <p>Bem-vinda de volta, aqui está um resumo do seu negócio.</p>
      </header>

      {/* --- SEÇÃO DE KPIs DE CLIENTES --- */}
      <div className="kpi-section-header"><h3>Clientes</h3></div>
      <div className="kpi-grid clients">
        {kpiData.clients.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      {/* --- SEÇÃO DE KPIs DE RECEITA --- */}
      <div className="kpi-section-header"><h3>Receita</h3></div>
      <div className="kpi-grid revenue">
        {kpiData.revenue.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </div>

      {/* --- SEÇÃO DE GRÁFICOS --- */}
      <div className="charts-container">
        <div className="chart-card full-width">
            <h3>Modelos de Unha Mais Realizados</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={nailModelData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                    <XAxis type="number" hide />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="var(--text-secondary)" 
                        axisLine={false} 
                        tickLine={false}
                        width={100} 
                    />
                    <Tooltip cursor={{fill: 'var(--background-secondary)'}} contentStyle={{backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)'}}/>
                    <Bar dataKey="count" barSize={35} radius={[0, 10, 10, 0]}>
                        {nailModelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList dataKey="count" position="right" style={{ fill: 'var(--text-primary)' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="chart-card full-width"> {/* <-- MUDANÇA AQUI */}
          <h3>Evolução da Receita</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--text-secondary)" />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)'}}/>
              <Line type="monotone" dataKey="receita" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-card full-width"> {/* <-- MUDANÇA AQUI */}
          <h3>Evolução de Clientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--text-secondary)" />
              <YAxis tickLine={false} axisLine={false} stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)'}}/>
              <Line type="monotone" dataKey="clientes" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
