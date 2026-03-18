# PSS AI Fraud Detection Reference

> Automated Fraud Prevention System

## Fraud Detection Layers

| Layer | Detects |
|-------|---------|
| Identity AI | Fake IDs, forgery, stolen identity |
| Liveness AI | Deepfakes, photo attacks |
| Device Intel | Multi-accounts, emulators |
| Behavior AI | Bots, account takeover |
| Transaction AI | Unusual patterns, laundering |
| AML Screening | Sanctions, PEP, watchlists |
| Crypto Monitor | Scam wallets, darknet |

## Risk Score Formula

```
Total = Identity_Risk × 0.25 +
        Device_Risk × 0.15 +
        Behavior_Risk × 0.15 +
        Transaction_Risk × 0.25 +
        AML_Risk × 0.20
```

## Risk Level Actions

| Score | Level | Action |
|-------|-------|--------|
| 0-30 | Low | Auto-approve |
| 31-50 | Medium | Additional verify |
| 51-70 | High | Manual review |
| 71-85 | Critical | Block + alert |
| 86-100 | Severe | Freeze + investigate |

## AI Technology Stack

```
ML:         TensorFlow / PyTorch
Vision:     OpenCV
NLP:        Transformers
Anomaly:    scikit-learn
Real-time:  Kafka, Flink
```

## Detection Targets

| Metric | Target |
|--------|--------|
| Detection Rate | > 95% |
| False Positive | < 2% |
| Response Time | < 100ms |

---

*Full details: docs/architecture/pss-ai-fraud-detection.md*
