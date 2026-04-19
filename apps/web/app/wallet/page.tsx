'use client';

import { useState } from 'react';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const balances = {
    ehbgc: { total: 5420.50, locked: 2200, free: 3220.50 },
    ehbgx: { balance: 542000, usdValue: 5420 },
  };

  const recentTransactions = [
    { id: 1, type: 'lock', amount: 1000, currency: 'EHBGC', date: '2026-04-19', status: 'completed', icon: '🔒' },
    { id: 2, type: 'receive', amount: 250, currency: 'EHBGC', date: '2026-04-18', status: 'completed', icon: '📥' },
    { id: 3, type: 'convert', amount: 500, currency: 'EHBGC → EHBGX', date: '2026-04-17', status: 'completed', icon: '🔄' },
    { id: 4, type: 'stake', amount: 2000, currency: 'EHBGX', date: '2026-04-16', status: 'completed', icon: '📈' },
    { id: 5, type: 'withdraw', amount: 5000, currency: 'PKR', date: '2026-04-15', status: 'pending', icon: '📤' },
  ];

  const lockPlans = [
    { duration: '1 Year', apy: '8%', stlRequirement: 'L2+' },
    { duration: '2 Years', apy: '12%', stlRequirement: 'L3+' },
    { duration: '3 Years', apy: '18%', stlRequirement: 'L4+' },
  ];

  return (
    <main style={{ backgroundColor: '#0C0E1A', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <section style={{
          background: 'rgba(19,22,42,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 14,
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#2BBFA0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            EHB Super App
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Wallet
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#C8CCDF' }}>
            Track your EHBGC and EHBGX balances, lock tokens, convert currencies, and manage withdrawals.
          </p>
        </section>

        {/* Balance Overview Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Balance (USD)
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#2BBFA0', marginBottom: '0.75rem' }}>
              ${(balances.ehbgc.total + balances.ehbgx.usdValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555A78' }}>
              EHBGC: ${balances.ehbgc.total.toFixed(2)} + EHBGX: ${balances.ehbgx.usdValue.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              EHBGC Balance
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#F0A030', marginBottom: '0.75rem' }}>
              {balances.ehbgc.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555A78' }}>
              🔒 Locked: {balances.ehbgc.locked} | Free: {balances.ehbgc.free.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              EHBGX Balance
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#7B6EF6', marginBottom: '0.75rem' }}>
              {(balances.ehbgx.balance / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}K
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555A78' }}>
              Worth ~${balances.ehbgx.usdValue.toFixed(2)} USD @ $0.01 ea.
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {['overview', 'ehbgc-lock', 'ehbgx', 'transactions', 'topup-withdraw'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? '#7B6EF6' : '#8890B0',
                background: activeTab === tab ? 'rgba(123, 110, 246, 0.1)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(123, 110, 246, 0.3)' : '1px solid transparent',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 120ms ease',
                textTransform: 'capitalize'
              }}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </section>

        {/* Tab Content */}
        <section>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{
                background: 'rgba(19,22,42,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 12,
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                  Portfolio Overview
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>Locked EHBGC</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F0A030' }}>{balances.ehbgc.locked}</div>
                    <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>Current locks earning 8-18% APY</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>Free EHBGC</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38C878' }}>{balances.ehbgc.free.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>Available to lock or withdraw</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>Staked EHBGX</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7B6EF6' }}>125K</div>
                    <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>Earning 15% APY</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ehbgc-lock' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{
                background: 'rgba(19,22,42,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 12,
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                  Lock Duration & Rewards
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {lockPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(19,22,42,0.92)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 10,
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                        borderColor: 'rgba(123, 110, 246, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(123, 110, 246, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(123, 110, 246, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(19,22,42,0.92)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.5rem' }}>Duration</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>{plan.duration}</div>
                      <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.5rem' }}>APY</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2BBFA0', marginBottom: '1rem' }}>{plan.apy}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555A78' }}>
                        Requires STL: <span style={{ color: '#F0A030' }}>{plan.stlRequirement}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>
                    Lock Amount (EHBGC)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    defaultValue="1000"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(19,22,42,0.92)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #F0A030 0%, #7B6EF6 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Lock EHBGC
                  </button>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    color: '#C8CCDF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.color = '#C8CCDF';
                  }}
                  >
                    Unlock Early
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ehbgx' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{
                background: 'rgba(19,22,42,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 12,
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                  EHBGX Growth Token
                </h2>

                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(123, 110, 246, 0.08)', borderRadius: 10, border: '1px solid rgba(123, 110, 246, 0.2)' }}>
                  <div style={{ fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.5rem' }}>Current Balance</div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#7B6EF6', marginBottom: '1rem' }}>
                    {(balances.ehbgx.balance / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })}K EHBGX
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#C8CCDF' }}>
                    USD Value: ${balances.ehbgx.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Conversion Calculator</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#8890B0', marginBottom: '0.5rem' }}>EHBGC</label>
                      <input type="number" placeholder="0" defaultValue="1000" style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(19,22,42,0.92)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 8,
                        color: '#fff',
                        boxSizing: 'border-box'
                      }} />
                      <div style={{ fontSize: '0.65rem', color: '#555A78', marginTop: '0.5rem' }}>Fee: 5% (50 EHBGC)</div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#8890B0' }}>⇄</div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#8890B0', marginBottom: '0.5rem' }}>EHBGX</label>
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(19,22,42,0.92)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 8,
                        color: '#7B6EF6',
                        fontWeight: 600
                      }}>95,000</div>
                      <div style={{ fontSize: '0.65rem', color: '#555A78', marginTop: '0.5rem' }}>You receive</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(240, 88, 88, 0.08)', borderRadius: 8, border: '1px solid rgba(240, 88, 88, 0.2)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F05858', marginBottom: '0.5rem' }}>Anti-Dump Limits</div>
                  <div style={{ fontSize: '0.75rem', color: '#C8CCDF' }}>
                    Daily limit: 5% of balance | Weekly limit: 20% of balance
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Convert EHBGC → EHBGX
                  </button>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    color: '#C8CCDF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.color = '#C8CCDF';
                  }}
                  >
                    Convert Back to EHBGC
                  </button>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Staking</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'L0-L2 Stakers', apy: '8% APY' },
                      { label: 'L3-L5 Stakers', apy: '12% APY' },
                      { label: 'L6-L8 Stakers', apy: '18% APY' }
                    ].map((stake, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(43, 191, 160, 0.08)',
                        border: '1px solid rgba(43, 191, 160, 0.2)',
                        borderRadius: 8,
                        padding: '1rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#8890B0' }}>{stake.label}</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2BBFA0' }}>{stake.apy}</div>
                      </div>
                    ))}
                  </div>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #2BBFA0 0%, #38C878 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Stake EHBGX
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div style={{
              background: 'rgba(19,22,42,0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 12,
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                Transaction History
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', transition: 'all 120ms ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#C8CCDF' }}>
                          <span style={{ marginRight: '0.5rem' }}>{tx.icon}</span>
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                          {tx.amount.toLocaleString()} {tx.currency}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#8890B0' }}>
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.75rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.375rem 0.75rem',
                            background: tx.status === 'completed' ? 'rgba(56, 200, 120, 0.15)' : 'rgba(240, 160, 48, 0.15)',
                            color: tx.status === 'completed' ? '#38C878' : '#F0A030',
                            borderRadius: 5,
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'topup-withdraw' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Top Up */}
              <div style={{
                background: 'rgba(19,22,42,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 12,
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                  Top Up
                </h2>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(19,22,42,0.92)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>
                    Minimum: 100 PKR
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>
                    Payment Method
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(19,22,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    color: '#C8CCDF',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile">Mobile Wallet (Jazz/Zong)</option>
                  </select>
                </div>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #2BBFA0 0%, #38C878 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 120ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Proceed to Top Up
                </button>
              </div>

              {/* Withdraw */}
              <div style={{
                background: 'rgba(19,22,42,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 12,
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
                  Withdraw
                </h2>
                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(240, 88, 88, 0.08)', borderRadius: 8, border: '1px solid rgba(240, 88, 88, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F05858', marginBottom: '0.5rem' }}>Minimum Withdrawal: 1,000 PKR</div>
                  <div style={{ fontSize: '0.75rem', color: '#C8CCDF' }}>Please maintain this balance</div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(19,22,42,0.92)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>
                    Available: 15,420 PKR
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem' }}>
                    Recipient Bank
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(19,22,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    color: '#C8CCDF',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}>
                    <option value="">Select Bank</option>
                    <option value="hbl">HBL</option>
                    <option value="nbp">NBP</option>
                    <option value="ubl">UBL</option>
                  </select>
                </div>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #F05858 0%, #F0A030 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 120ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Request Withdrawal
                </button>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
                    Pending Withdrawals
                  </h3>
                  {[
                    { id: 1, amount: 5000, date: '2026-04-19', status: 'processing' },
                    { id: 2, amount: 3000, date: '2026-04-18', status: 'pending' }
                  ].map((wd) => (
                    <div key={wd.id} style={{
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 6,
                      marginBottom: '0.75rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>PKR {wd.amount.toLocaleString()}</div>
                        <div style={{ color: '#555A78' }}>{wd.date}</div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: wd.status === 'processing' ? 'rgba(240, 160, 48, 0.15)' : 'rgba(43, 191, 160, 0.15)',
                        color: wd.status === 'processing' ? '#F0A030' : '#2BBFA0',
                        borderRadius: 4,
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>{wd.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
