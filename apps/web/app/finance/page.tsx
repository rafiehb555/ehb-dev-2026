'use client';

import { useState } from 'react';

export default function FinancePage() {
  const [timeRange, setTimeRange] = useState('month');

  // Mock monthly revenue data
  const monthlyData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 142000 },
    { month: 'Mar', revenue: 156000 },
    { month: 'Apr', revenue: 173000 },
    { month: 'May', revenue: 198000 },
    { month: 'Jun', revenue: 215000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const cardStyle: React.CSSProperties = {
    background: 'rgba(19,22,42,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: '1.5rem',
  };

  const revenueStreams = [
    { name: 'Service Fees', amount: 45250, pct: 28, icon: '💳', color: '#7B6EF6' },
    { name: 'Affiliate Commissions', amount: 32100, pct: 20, icon: '🔗', color: '#2BBFA0' },
    { name: 'Franchise Sales', amount: 51800, pct: 32, icon: '🏢', color: '#F0A030' },
    { name: 'DMO Subscriptions', amount: 19450, pct: 12, icon: '🏛️', color: '#38C878' },
    { name: 'Token Fees', amount: 13400, pct: 8, icon: '⛓️', color: '#A098F8' },
  ];

  const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.amount, 0);

  return (
    <main style={{ backgroundColor: '#0C0E1A', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <section style={cardStyle}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#2BBFA0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Platform Financials
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Finance Overview
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#C8CCDF', marginTop: '0.5rem' }}>
            Monitor platform revenue streams, payouts, and financial health across all 32 industries.
          </p>
        </section>

        {/* Total Revenue KPI */}
        <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, rgba(123,110,246,0.15) 0%, rgba(43,191,160,0.15) 100%)',
            border: '1px solid rgba(123,110,246,0.3)',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#A098F8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Monthly Revenue
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2BBFA0' }}>
                ${(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>
                +12.8% vs last month
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#8890B0' }}>
              Revenue distributed across 5 streams: service fees, affiliate commissions, franchise sales, subscriptions, and token fees.
            </p>
          </div>
        </section>

        {/* 5 Revenue Streams */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            5 Revenue Streams
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {revenueStreams.map((stream, idx) => (
              <div key={idx} style={{
                ...cardStyle,
                background: `rgba(${stream.color === '#7B6EF6' ? '123, 110, 246' : stream.color === '#2BBFA0' ? '43, 191, 160' : stream.color === '#F0A030' ? '240, 160, 48' : stream.color === '#38C878' ? '56, 200, 120' : '160, 152, 248'}, 0.08)`,
                border: `1px solid ${stream.color}40`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>{stream.icon}</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: stream.color, background: `${stream.color}20`, padding: '0.25rem 0.75rem', borderRadius: 4, textTransform: 'uppercase' }}>
                    {stream.pct}%
                  </div>
                </div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C8CCDF', marginBottom: '0.5rem' }}>
                  {stream.name}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stream.color }}>
                  ${stream.amount.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#555A78', marginTop: '0.5rem' }}>
                  of ${totalRevenue.toLocaleString()} total
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Revenue Chart */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Monthly Revenue Trend
          </h2>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '300px', gap: '1rem' }}>
              {monthlyData.map((data, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                      background: `linear-gradient(180deg, #7B6EF6 0%, #2BBFA0 100%)`,
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '0.5rem',
                      transition: 'all 300ms ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#8890B0', fontWeight: 600 }}>
                    {data.month}
                  </span>
                  <span style={{ fontSize: '10px', color: '#555A78', marginTop: '0.25rem' }}>
                    ${(data.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Rules */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Financial Rules & Policies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              {
                rule: 'Minimum Payout',
                value: '1000 PKR',
                description: 'Minimum amount to request withdrawal',
                icon: '💰',
              },
              {
                rule: 'Escrow System',
                value: 'Instant',
                description: 'Funds held in escrow during transaction',
                icon: '🔐',
              },
              {
                rule: 'Refund Policy',
                value: 'Full Clawback',
                description: 'Full amount clawed back on refund',
                icon: '↩️',
              },
              {
                rule: 'Settlement Period',
                value: '24-48 Hours',
                description: 'Typical payout settlement time',
                icon: '⏱️',
              },
            ].map((item, idx) => (
              <div key={idx} style={{
                ...cardStyle,
                background: 'rgba(43,191,160,0.08)',
                border: '1px solid rgba(43,191,160,0.2)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C8CCDF', marginBottom: '0.5rem' }}>
                  {item.rule}
                </h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2BBFA0', marginBottom: '0.5rem' }}>
                  {item.value}
                </div>
                <p style={{ fontSize: '10px', color: '#555A78' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Currency Display */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Currency & Display Policy
          </h2>
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(123,110,246,0.1)',
                borderRadius: 8,
                border: '1px solid rgba(123,110,246,0.3)',
              }}>
                <div style={{ fontSize: '11px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Primary Currency
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7B6EF6' }}>
                  USD Only
                </div>
                <p style={{ fontSize: '10px', color: '#8890B0', marginTop: '0.5rem' }}>
                  All transactions displayed in USD for consistency
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'rgba(160,152,248,0.1)',
                borderRadius: 8,
                border: '1px solid rgba(160,152,248,0.3)',
              }}>
                <div style={{ fontSize: '11px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Token Display (EHBGC)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#A098F8' }}>
                  For Locks Only
                </div>
                <p style={{ fontSize: '10px', color: '#8890B0', marginTop: '0.5rem' }}>
                  EHBGC tokens shown only in wallet lock sections
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Distribution by Industry */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Revenue Distribution by Industry (Phase 1)
          </h2>
          <div style={cardStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Industry</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Revenue</th>
                    <th style={{ textAlign: 'center', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>% of Total</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { industry: 'E-commerce (GoSellr)', revenue: 42500, pct: 26, growth: '+18%' },
                    { industry: 'Legal (OLS)', revenue: 38200, pct: 23, growth: '+12%' },
                    { industry: 'Medical (WMS)', revenue: 35800, pct: 22, growth: '+8%' },
                    { industry: 'Education (HPS/OBS)', revenue: 28400, pct: 17, growth: '+15%' },
                    { industry: 'Jobs (JPS)', revenue: 12300, pct: 8, growth: '+5%' },
                    { industry: 'Travel (AGTS)', revenue: 4800, pct: 3, growth: '+2%' },
                  ].map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#C8CCDF' }}>
                        {item.industry}
                      </td>
                      <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', color: '#2BBFA0', fontWeight: 600 }}>
                        ${item.revenue.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#8890B0' }}>
                        {item.pct}%
                      </td>
                      <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>
                        {item.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
