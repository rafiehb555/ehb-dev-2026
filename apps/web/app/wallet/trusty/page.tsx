'use client';

import { useState } from 'react';

export default function TrustyWalletPage() {
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Mock data
  const trustyData = {
    balance: 2850,
    minimumRequired: 1000,
    status: 'healthy',
    lastCollected: '2026-04-19 14:30',
    totalCollected: 45320,
    activeOrders: 12
  };

  const codCollectionLog = [
    { id: 1, orderId: 'ORD-001234', amount: 450, date: '2026-04-19 14:30', status: 'completed', icon: '✓' },
    { id: 2, orderId: 'ORD-001233', amount: 820, date: '2026-04-19 10:15', status: 'completed', icon: '✓' },
    { id: 3, orderId: 'ORD-001232', amount: 380, date: '2026-04-18 18:45', status: 'completed', icon: '✓' },
    { id: 4, orderId: 'ORD-001231', amount: 650, date: '2026-04-18 16:20', status: 'completed', icon: '✓' },
    { id: 5, orderId: 'ORD-001230', amount: 290, date: '2026-04-18 12:00', status: 'completed', icon: '✓' },
  ];

  const autoDeductionHistory = [
    { id: 1, type: 'commission-deduction', amount: -45, date: '2026-04-19 15:00', description: 'Weekly commission (0.5%)' },
    { id: 2, type: 'insurance', amount: -200, date: '2026-04-15 09:00', description: 'Monthly rider insurance' },
    { id: 3, type: 'maintenance-fund', amount: -100, date: '2026-04-10 10:30', description: 'Vehicle maintenance fund' },
  ];

  const balanceStatus = trustyData.balance >= trustyData.minimumRequired * 1.5
    ? 'healthy'
    : trustyData.balance >= trustyData.minimumRequired
      ? 'warning'
      : 'critical';

  const statusColor = balanceStatus === 'healthy' ? '#38C878' : balanceStatus === 'warning' ? '#F0A030' : '#F05858';
  const statusBg = balanceStatus === 'healthy' ? 'rgba(56, 200, 120, 0.08)' : balanceStatus === 'warning' ? 'rgba(240, 160, 48, 0.08)' : 'rgba(240, 88, 88, 0.08)';

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
            Rider Finance
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Trusty Wallet
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#C8CCDF' }}>
            Manage your COD collection balance, auto-deductions, and rider earnings in one place.
          </p>
        </section>

        {/* Main Balance Card */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 14,
            padding: '2rem',
            borderColor: statusColor,
            boxShadow: `0 0 20px ${statusColor}40`
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              {/* Balance */}
              <div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Current Balance
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2BBFA0', marginBottom: '1rem', lineHeight: 1 }}>
                  {trustyData.balance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#C8CCDF', marginBottom: '1.5rem' }}>
                  PKR
                </div>

                {/* Status Indicator */}
                <div style={{
                  padding: '1rem',
                  background: statusBg,
                  borderRadius: 8,
                  border: `1px solid ${statusColor}30`,
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: statusColor, textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Status: {balanceStatus.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#C8CCDF' }}>
                    Minimum Required: PKR {trustyData.minimumRequired.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#C8CCDF' }}>
                    Buffer: PKR {(trustyData.balance - trustyData.minimumRequired).toLocaleString()}
                  </div>
                </div>

                {/* Top Up Button */}
                <button
                  onClick={() => setShowTopUpModal(true)}
                  style={{
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
                  💳 Top Up Balance
                </button>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(43, 191, 160, 0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(43, 191, 160, 0.2)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#8890B0', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Total Collected (All Time)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2BBFA0' }}>
                    PKR {trustyData.totalCollected.toLocaleString()}
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(123, 110, 246, 0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(123, 110, 246, 0.2)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#8890B0', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Active COD Orders
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7B6EF6' }}>
                    {trustyData.activeOrders}
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(240, 160, 48, 0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(240, 160, 48, 0.2)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#8890B0', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Last Collection
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F0A030' }}>
                    {trustyData.lastCollected}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        {balanceStatus === 'critical' && (
          <section style={{
            background: 'rgba(240, 88, 88, 0.15)',
            border: '1px solid rgba(240, 88, 88, 0.4)',
            borderRadius: 12,
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ fontSize: '1.5rem' }}>⚠️</div>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F05858', marginBottom: '0.5rem' }}>
                  Critical Balance Alert
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#C8CCDF', marginBottom: '1rem' }}>
                  Your Trusty balance is below the minimum required amount. You may not be able to accept COD orders until you top up.
                </p>
                <button
                  onClick={() => setShowTopUpModal(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #F05858 0%, #F0A030 100%)',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Top Up Now
                </button>
              </div>
            </div>
          </section>
        )}

        {/* COD Collection Log */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
              📥 COD Collection Log
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Amount (PKR)</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#8890B0', textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {codCollectionLog.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', transition: 'all 120ms ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#C8CCDF' }}>
                        {log.orderId}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#2BBFA0', textAlign: 'right' }}>
                        +{log.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.75rem', color: '#8890B0' }}>
                        {log.date}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.75rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.375rem 0.75rem',
                          background: 'rgba(56, 200, 120, 0.15)',
                          color: '#38C878',
                          borderRadius: 5,
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}>
                          {log.icon} {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Auto-Deduction History */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
              📤 Auto-Deduction History
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {autoDeductionHistory.map((deduct) => (
                <div
                  key={deduct.id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'center',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
                      {deduct.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8890B0' }}>
                      {deduct.date}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F05858', textAlign: 'right' }}>
                    {deduct.amount.toLocaleString()} PKR
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              fontSize: '0.75rem',
              color: '#8890B0'
            }}>
              Deductions are automatic and applied on their scheduled dates. Commission is 0.5% weekly, insurance is monthly.
            </div>
          </div>
        </section>

        {/* Bottom Section - Info Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>📋</div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              How Trusty Works
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#8890B0', lineHeight: 1.6 }}>
              Your Trusty wallet holds COD collections. We automatically deduct commissions, insurance, and maintenance fees on schedule.
            </p>
          </div>

          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💡</div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              Minimum Balance
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#8890B0', lineHeight: 1.6 }}>
              Keep at least PKR 1,000 to accept COD orders. More balance = more reliability rating.
            </p>
          </div>

          <div style={{
            background: 'rgba(19,22,42,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🔐</div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              Safe & Secure
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#8890B0', lineHeight: 1.6 }}>
              All transactions are protected by PSS (Proof & Security System) encryption.
            </p>
          </div>
        </section>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            background: 'rgba(19,22,42,0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 14,
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Top Up Trusty Balance</h2>
              <button
                onClick={() => setShowTopUpModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8890B0',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem', fontWeight: 600 }}>
                Amount (PKR)
              </label>
              <input
                type="number"
                placeholder="5000"
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
              <div style={{ fontSize: '0.75rem', color: '#555A78', marginTop: '0.5rem' }}>Minimum: PKR 500</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#8890B0', marginBottom: '0.75rem', fontWeight: 600 }}>
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
                <option value="easypaisa">EasyPaisa</option>
                <option value="jazzcash">JazzCash</option>
              </select>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(43, 191, 160, 0.08)',
              border: '1px solid rgba(43, 191, 160, 0.2)',
              borderRadius: 8,
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: '#C8CCDF'
            }}>
              Top-ups are processed instantly. Processing fee: 1.5%
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowTopUpModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
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
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
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
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
