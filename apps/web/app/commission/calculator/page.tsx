'use client';

import { useState } from 'react';

export default function CommissionCalculatorPage() {
  const [orderAmount, setOrderAmount] = useState(5000);
  const [sellerStl, setSellerStl] = useState('Normal');
  const [country, setCountry] = useState('Pakistan');
  const [category, setCategory] = useState('General');

  // STL levels
  const stlMap: { [key: string]: { sellerShare: number; platformShare: number; franchiseShare: number } } = {
    'New': { sellerShare: 80, platformShare: 15, franchiseShare: 5 },
    'Normal': { sellerShare: 85, platformShare: 10, franchiseShare: 5 },
    'High': { sellerShare: 88, platformShare: 7, franchiseShare: 5 },
    'VIP': { sellerShare: 90, platformShare: 5, franchiseShare: 5 },
  };

  // Affiliate commission rates by category
  const affiliateRates: { [key: string]: number } = {
    'General': 5,
    'Electronics': 8,
    'Fashion': 10,
    'Food': 7,
    'Services': 12,
    'Real Estate': 15,
  };

  // Current user's STL level (mock)
  const currentUserStl = 'L4';
  const stlBonusMap: { [key: string]: number } = {
    'L1': 0, 'L2': 0, 'L3': 1, 'L4': 2, 'L5': 2, 'L6': 2, 'L7': 3, 'L8': 3, 'L9': 3, 'L10': 3,
  };

  const currentStl = stlMap[sellerStl];
  const affiliateRate = affiliateRates[category];
  const stlBonus = stlBonusMap[currentUserStl] || 0;

  // Calculate base commission
  const sellerCommission = (orderAmount * currentStl.sellerShare) / 100;
  const platformFee = (orderAmount * currentStl.platformShare) / 100;
  const franchiseShare = (orderAmount * currentStl.franchiseShare) / 100;

  // Calculate affiliate commission
  const affiliateCommission = (orderAmount * affiliateRate) / 100;

  // STL bonus on seller share
  const stlBonusAmount = (sellerCommission * stlBonus) / 100;

  // Franchise network breakdown
  const franchiseNet = franchiseShare;
  const subNetwork = (franchiseNet * 0.05) / 1;
  const master = (franchiseNet * 0.02) / 1;
  const corporate = (franchiseNet * 0.015) / 1;
  const countryShare = (franchiseNet * 0.01) / 1;
  const hqExtra = (franchiseNet * 0.005) / 1;

  // Pakistan special case: Country 1% goes to HQ
  const isPakistan = country === 'Pakistan';
  const hqFinal = isPakistan ? hqExtra + countryShare : hqExtra;
  const countryFinal = isPakistan ? 0 : countryShare;

  // Cross-country 50/50 split
  const isCrossCountry = country === 'Cross-Country';
  const domesticPct = isCrossCountry ? 0.5 : 1;
  const internationalPct = isCrossCountry ? 0.5 : 0;

  // Total breakdown
  const totalSellerEarnings = sellerCommission + stlBonusAmount;
  const totalPlatformEarnings = platformFee;
  const totalFranchiseEarnings = franchiseShare;

  const cardStyle: React.CSSProperties = {
    background: 'rgba(19,22,42,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: '1.5rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 8,
    color: '#fff',
    fontSize: '1rem',
    marginTop: '0.5rem',
    fontFamily: 'inherit',
  };

  return (
    <main style={{ backgroundColor: '#0C0E1A', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <section style={cardStyle}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#2BBFA0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Tools & Calculators
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Commission Calculator
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#C8CCDF', marginTop: '0.5rem' }}>
            Interactive calculator to see exact commission breakdown for any order. Includes STL bonuses, affiliate rates, and franchise network splits.
          </p>
        </section>

        {/* Input Controls */}
        <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Configure Order
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <label style={{ fontSize: '0.875rem', color: '#8890B0' }}>
                Order Amount (USD)
              </label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Number(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div style={cardStyle}>
              <label style={{ fontSize: '0.875rem', color: '#8890B0' }}>
                Seller STL Level
              </label>
              <select
                value={sellerStl}
                onChange={(e) => setSellerStl(e.target.value)}
                style={inputStyle}
              >
                {Object.keys(stlMap).map((level) => (
                  <option key={level} value={level} style={{ background: '#0C0E1A', color: '#fff' }}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div style={cardStyle}>
              <label style={{ fontSize: '0.875rem', color: '#8890B0' }}>
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
              >
                <option value="Pakistan" style={{ background: '#0C0E1A', color: '#fff' }}>Pakistan</option>
                <option value="USA" style={{ background: '#0C0E1A', color: '#fff' }}>USA</option>
                <option value="UAE" style={{ background: '#0C0E1A', color: '#fff' }}>UAE</option>
                <option value="UK" style={{ background: '#0C0E1A', color: '#fff' }}>UK</option>
                <option value="Cross-Country" style={{ background: '#0C0E1A', color: '#fff' }}>Cross-Country</option>
              </select>
            </div>

            <div style={cardStyle}>
              <label style={{ fontSize: '0.875rem', color: '#8890B0' }}>
                Product Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                {Object.keys(affiliateRates).map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0C0E1A', color: '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Main Breakdown */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Commission Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Seller Earnings */}
            <div style={{
              ...cardStyle,
              background: 'rgba(56,200,120,0.08)',
              border: '1px solid rgba(56,200,120,0.3)',
            }}>
              <div style={{ fontSize: '10px', color: '#A0D98C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Seller Earnings
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#38C878', marginBottom: '0.5rem' }}>
                ${totalSellerEarnings.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: '#555A78', lineHeight: 1.6 }}>
                <div>Base ({currentStl.sellerShare}%): ${sellerCommission.toFixed(2)}</div>
                {stlBonus > 0 && <div style={{ color: '#38C878', fontWeight: 600 }}>STL Bonus (+{stlBonus}%): ${stlBonusAmount.toFixed(2)}</div>}
              </div>
            </div>

            {/* Platform Fee */}
            <div style={{
              ...cardStyle,
              background: 'rgba(123,110,246,0.08)',
              border: '1px solid rgba(123,110,246,0.3)',
            }}>
              <div style={{ fontSize: '10px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Platform Fee
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7B6EF6', marginBottom: '0.5rem' }}>
                ${platformFee.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: '#555A78' }}>
                {currentStl.platformShare}% of order amount
              </div>
            </div>

            {/* Franchise Share */}
            <div style={{
              ...cardStyle,
              background: 'rgba(240,160,48,0.08)',
              border: '1px solid rgba(240,160,48,0.3)',
            }}>
              <div style={{ fontSize: '10px', color: '#F5BB66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Franchise Network
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#F0A030', marginBottom: '0.5rem' }}>
                ${franchiseShare.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: '#555A78' }}>
                {currentStl.franchiseShare}% of order amount
              </div>
            </div>

            {/* Affiliate Commission */}
            <div style={{
              ...cardStyle,
              background: 'rgba(43,191,160,0.08)',
              border: '1px solid rgba(43,191,160,0.3)',
            }}>
              <div style={{ fontSize: '10px', color: '#7FDDC6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Affiliate Commission
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2BBFA0', marginBottom: '0.5rem' }}>
                ${affiliateCommission.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: '#555A78' }}>
                {affiliateRate}% on {category}
              </div>
            </div>
          </div>
        </section>

        {/* Franchise Network Details */}
        {currentStl.franchiseShare > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
              Franchise Network Distribution
            </h2>
            <div style={cardStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#2BBFA0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Sub Network (5%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2BBFA0' }}>
                    ${subNetwork.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#F5BB66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Master (2%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F0A030' }}>
                    ${master.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Corporate (1.5%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7B6EF6' }}>
                    ${corporate.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#38C878', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Country (1%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38C878' }}>
                    ${countryFinal.toFixed(2)}
                  </div>
                  {isPakistan && <div style={{ fontSize: '10px', color: '#555A78', marginTop: '0.5rem' }}>→ Redirected to HQ</div>}
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#F05858', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    HQ Extra (0.5%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F05858' }}>
                    ${hqFinal.toFixed(2)}
                  </div>
                </div>
              </div>

              {isPakistan && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(240,160,48,0.1)',
                  borderRadius: 8,
                  border: '1px solid rgba(240,160,48,0.3)',
                }}>
                  <div style={{ fontSize: '11px', color: '#F5BB66', fontWeight: 600, marginBottom: '0.5rem' }}>
                    ⚠ Pakistan Special Case
                  </div>
                  <p style={{ fontSize: '10px', color: '#C8CCDF' }}>
                    Country share (1% = ${countryShare.toFixed(2)}) is redirected to HQ. Total HQ receives ${hqFinal.toFixed(2)}.
                  </p>
                </div>
              )}

              {isCrossCountry && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(123,110,246,0.1)',
                  borderRadius: 8,
                  border: '1px solid rgba(123,110,246,0.3)',
                }}>
                  <div style={{ fontSize: '11px', color: '#A098F8', fontWeight: 600, marginBottom: '0.5rem' }}>
                    ↔ Cross-Country Order
                  </div>
                  <p style={{ fontSize: '10px', color: '#C8CCDF' }}>
                    Franchise distribution is split 50/50: Domestic network gets ${(franchiseShare * domesticPct).toFixed(2)}, International gets ${(franchiseShare * internationalPct).toFixed(2)}.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Summary Table */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Complete Breakdown
          </h2>
          <div style={cardStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Component</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: '1rem', fontSize: '11px', color: '#8890B0', fontWeight: 600, textTransform: 'uppercase' }}>% of Order</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#C8CCDF' }}>Order Total</td>
                    <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>${orderAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#8890B0' }}>100%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>→ Seller (incl. bonus)</td>
                    <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#38C878' }}>${totalSellerEarnings.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#38C878', fontWeight: 600 }}>
                      {((totalSellerEarnings / orderAmount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#7B6EF6', fontWeight: 600 }}>→ Platform Fee</td>
                    <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#7B6EF6' }}>${platformFee.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#7B6EF6', fontWeight: 600 }}>
                      {((platformFee / orderAmount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#F0A030', fontWeight: 600 }}>→ Franchise Network</td>
                    <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#F0A030' }}>${franchiseShare.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#F0A030', fontWeight: 600 }}>
                      {((franchiseShare / orderAmount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#2BBFA0', fontWeight: 600 }}>→ Affiliate Commission</td>
                    <td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#2BBFA0' }}>${affiliateCommission.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#2BBFA0', fontWeight: 600 }}>
                      {((affiliateCommission / orderAmount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Key Insights */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
            Key Insights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{
              ...cardStyle,
              background: 'rgba(43,191,160,0.08)',
              border: '1px solid rgba(43,191,160,0.2)',
            }}>
              <div style={{ fontSize: '11px', color: '#7FDDC6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Your Share
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2BBFA0', marginBottom: '0.5rem' }}>
                {((totalSellerEarnings / orderAmount) * 100).toFixed(1)}%
              </div>
              <p style={{ fontSize: '10px', color: '#8890B0' }}>
                {stlBonus > 0 ? `Includes +${stlBonus}% STL ${currentUserStl} bonus` : 'Base seller share'}
              </p>
            </div>

            <div style={{
              ...cardStyle,
              background: 'rgba(240,160,48,0.08)',
              border: '1px solid rgba(240,160,48,0.2)',
            }}>
              <div style={{ fontSize: '11px', color: '#F5BB66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Franchise Benefit
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F0A030', marginBottom: '0.5rem' }}>
                {currentStl.franchiseShare}%
              </div>
              <p style={{ fontSize: '10px', color: '#8890B0' }}>
                Network support & growth
              </p>
            </div>

            <div style={{
              ...cardStyle,
              background: 'rgba(123,110,246,0.08)',
              border: '1px solid rgba(123,110,246,0.2)',
            }}>
              <div style={{ fontSize: '11px', color: '#A098F8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Platform Sustainability
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7B6EF6', marginBottom: '0.5rem' }}>
                {currentStl.platformShare}%
              </div>
              <p style={{ fontSize: '10px', color: '#8890B0' }}>
                Maintenance & development
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
