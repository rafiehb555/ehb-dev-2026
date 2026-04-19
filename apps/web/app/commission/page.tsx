'use client';

import { useState } from 'react';

export default function CommissionPage() {
  const [orderAmount, setOrderAmount] = useState(1000);
  const [selectedStl, setSelectedStl] = useState('Normal');

  // STL levels and their seller share percentages
  const stlLevels = [
    { name: 'New', sellerShare: 80, platformShare: 15, franchiseShare: 5 },
    { name: 'Normal', sellerShare: 85, platformShare: 10, franchiseShare: 5 },
    { name: 'High', sellerShare: 88, platformShare: 7, franchiseShare: 5 },
    { name: 'VIP', sellerShare: 90, platformShare: 5, franchiseShare: 5 },
  ];

  const currentStl = stlLevels.find((s) => s.name === selectedStl) || stlLevels[1];

  // Calculate splits
  const sellerAmount = (orderAmount * currentStl.sellerShare) / 100;
  const franchiseAmount = (orderAmount * currentStl.franchiseShare) / 100;
  const platformAmount = (orderAmount * currentStl.platformShare) / 100;

  // Franchise network sub-distribution (10% breakdown)
  const franchiseSub = franchiseAmount;
  const subNetwork = (franchiseSub * 0.05) / 1;
  const master = (franchiseSub * 0.02) / 1;
  const corporate = (franchiseSub * 0.015) / 1;
  const country = (franchiseSub * 0.01) / 1;
  const hqExtra = (franchiseSub * 0.005) / 1;

  // STL bonus system
  const stlBonusMap: { [key: string]: number } = {
    'L1': 0, 'L2': 0, 'L3': 1, 'L4': 2, 'L5': 2, 'L6': 2, 'L7': 3, 'L8': 3, 'L9': 3, 'L10': 3,
  };

  // Mock STL level for the current user
  const currentStlLevel = 'L4';
  const stlBonus = stlBonusMap[currentStlLevel] || 0;
  const bonusAmount = (sellerAmount * stlBonus) / 100;

  const cardStyle: React.CSSProperties = {
    background: 'rgba(19,22,42,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: '1.5rem',
  };

  const progressBarStyle = (pct: number, color: string): React.CSSProperties => ({
    height: 6,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: '0.5rem',
  });

  const progressFillStyle = (pct: number, color: string): React.CSSProperties => ({
    height: '100%',
    width: `${pct}%`,
    background: color,
    borderRadius: 4,
    transition: 'width 400ms ease-out',
  });

  return (
    <main style={{ backgroundColor: '#0C0E1A', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <section style={cardStyle}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#2BBFA0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Finance System
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Commission & Revenue
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#C8CCDF', marginTop: '0.5rem' }}>
            Real-time breakdown of how money flows through the EHB platform — seller share, franchise network, and platform fees.
          </p>
        </section>

        {/* 85/10/5 Split Visualizer */}
        <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            85/10/5 Split Visualizer
          </h2>
          <div style={cardStyle}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.5rem', display: 'block' }}>
                Order Amount (USD)
              </label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              />
            </div>

            {/* Stacked bar visualization */}
            <div style={{ display: 'flex', gap: '0.5rem', height: '40px', borderRadius: 8, overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{
                flex: `${currentStl.sellerShare}%`,
                background: '#38C878',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fff',
              }}>
                {currentStl.sellerShare}% Seller
              </div>
              <div style={{
                flex: `${currentStl.franchiseShare}%`,
                background: '#F0A030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fff',
              }}>
                {currentStl.franchiseShare}%
              </div>
              <div style={{
                flex: `${currentStl.platformShare}%`,
                background: '#7B6EF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fff',
              }}>
                {currentStl.platformShare}%
              </div>
            </div>

            {/* Split breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ background: 'rgba(38,200,120,0.1)', borderRadius: 8, padding: '1rem', border: '1px solid rgba(38,200,120,0.3)' }}>
                <div style={{ fontSize: '10px', color: '#A0D98C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seller</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38C878', marginTop: '0.5rem' }}>
                  ${sellerAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: '#555A78', marginTop: '0.25rem' }}>
                  {currentStl.sellerShare}% of order
                </div>
              </div>

              <div style={{ background: 'rgba(240,160,48,0.1)', borderRadius: 8, padding: '1rem', border: '1px solid rgba(240,160,48,0.3)' }}>
                <div style={{ fontSize: '10px', color: '#F5BB66', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Franchise</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F0A030', marginTop: '0.5rem' }}>
                  ${franchiseAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: '#555A78', marginTop: '0.25rem' }}>
                  {currentStl.franchiseShare}% of order
                </div>
              </div>

              <div style={{ background: 'rgba(123,110,246,0.1)', borderRadius: 8, padding: '1rem', border: '1px solid rgba(123,110,246,0.3)' }}>
                <div style={{ fontSize: '10px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7B6EF6', marginTop: '0.5rem' }}>
                  ${platformAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: '#555A78', marginTop: '0.25rem' }}>
                  {currentStl.platformShare}% of order
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Franchise Network Sub-Distribution */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Franchise Network Sub-Distribution (10% breakdown)
          </h2>
          <div style={cardStyle}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Sub Network', amount: subNetwork, pct: 5, color: '#2BBFA0' },
                { label: 'Master', amount: master, pct: 2, color: '#F5BB66' },
                { label: 'Corporate', amount: corporate, pct: 1.5, color: '#A098F8' },
                { label: 'Country', amount: country, pct: 1, color: '#38C878' },
                { label: 'HQ Extra', amount: hqExtra, pct: 0.5, color: '#F05858' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#C8CCDF' }}>{item.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: item.color }}>
                      ${item.amount.toFixed(2)} ({item.pct}%)
                    </span>
                  </div>
                  <div style={progressBarStyle(item.pct * 10, item.color)}>
                    <div style={progressFillStyle(100, item.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Seller Share by STL */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Dynamic Seller Share by STL Level
          </h2>
          <div style={cardStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>STL Tier</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Seller Share</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Platform Share</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Example on $1000</th>
                  </tr>
                </thead>
                <tbody>
                  {stlLevels.map((level, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#C8CCDF' }}>{level.name}</td>
                      <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>
                        {level.sellerShare}%
                      </td>
                      <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', color: '#7B6EF6', fontWeight: 600 }}>
                        {level.platformShare}%
                      </td>
                      <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <span style={{ color: '#38C878' }}>${(1000 * level.sellerShare / 100).toFixed(0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3 Earning Engines */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            3 Earning Engines
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {[
              {
                title: 'Order Commission',
                icon: '📦',
                description: 'Base commission on every order',
                rate: '85% to sellers',
                color: '#38C878',
              },
              {
                title: 'Affiliate Product Commission',
                icon: '🔗',
                description: 'Category-based affiliate rates',
                rate: '5-15% depending on category',
                color: '#F0A030',
              },
              {
                title: 'Franchise Sale Commission',
                icon: '🏢',
                description: 'Commission on franchise sales',
                rate: '30% to affiliate network',
                color: '#7B6EF6',
              },
            ].map((engine, idx) => (
              <div key={idx} style={{
                ...cardStyle,
                background: `rgba(${engine.color === '#38C878' ? '56, 200, 120' : engine.color === '#F0A030' ? '240, 160, 48' : '123, 110, 246'}, 0.08)`,
                border: `1px solid ${engine.color}40`,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{engine.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                  {engine.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '1rem' }}>
                  {engine.description}
                </p>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: engine.color }}>
                  {engine.rate}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STL Bonus System */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            STL Bonus System
          </h2>
          <div style={cardStyle}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#C8CCDF', marginBottom: '1rem' }}>
                Your STL level ({currentStlLevel}) grants a <span style={{ color: '#2BBFA0', fontWeight: 600 }}>+{stlBonus}% bonus</span> on all seller commissions.
              </p>
              <div style={{ background: 'rgba(43,191,160,0.1)', borderRadius: 8, padding: '1rem', border: '1px solid rgba(43,191,160,0.3)' }}>
                <div style={{ fontSize: '10px', color: '#A0D98C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Monthly Bonus on $10K Orders</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2BBFA0' }}>
                  +${(10000 * 0.85 * stlBonus / 100).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Level</th>
                    <th style={{ textAlign: 'center', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Bonus %</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>On $1000 Order</th>
                  </tr>
                </thead>
                <tbody>
                  {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'].map((level, idx) => {
                    const bonus = stlBonusMap[level];
                    const sellerShare = 85;
                    const bonusAmt = 1000 * sellerShare / 100 * bonus / 100;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: level === currentStlLevel ? '#2BBFA0' : '#C8CCDF', fontWeight: level === currentStlLevel ? 600 : 400 }}>
                          {level} {level === currentStlLevel && '(You)'}
                        </td>
                        <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#7B6EF6', fontWeight: 600 }}>
                          +{bonus}%
                        </td>
                        <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>
                          ${bonusAmt.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Penalty System */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Penalty System
          </h2>
          <div style={cardStyle}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { violation: 'Late Delivery', penalty: '-10%', color: '#F0A030' },
                { violation: 'Customer Complaint', penalty: '-20%', color: '#F05858' },
                { violation: 'Fraud Detected', penalty: 'Frozen', color: '#F05858' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: `rgba(${item.color === '#F0A030' ? '240, 160, 48' : '240, 88, 88'}, 0.1)`,
                  borderRadius: 8,
                  border: `1px solid ${item.color}40`,
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#C8CCDF' }}>{item.violation}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: item.color }}>
                    {item.penalty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
