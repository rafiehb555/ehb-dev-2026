# DMO AI Decision Engine Quick Reference

> Autonomous Governance System

## AI Modules

```
DMO Core → AI Decision Engine
├── Verification AI (KYC, documents, face match)
├── Risk AI (Fraud, anomalies, AML)
├── Workflow AI (Routing, priority)
├── STL AI (Trust scoring)
├── Compliance AI (Policy, SAR)
└── Recommendation AI (Matching)
```

## Decision Areas

| Area | AI Decides |
|------|------------|
| Verification | Approve/reject KYC |
| Fraud | Block suspicious activity |
| STL | Update trust scores |
| Routing | Assign to officers |
| Compliance | Flag AML risks |

## Decision Flow

```
User Action → Data Processing → AI Model → 
Risk Score → Decision (Approve/Reject/Review/Escalate)
```

## Decision Thresholds

| Risk Score | Decision |
|------------|----------|
| < 30 | Auto Approve |
| 30-80 | Manual Review |
| > 80 | Auto Reject |

## Tech Stack

- ML Framework: TensorFlow / PyTorch
- Serving: TensorFlow Serving
- Features: Feast
- MLOps: MLflow
- Processing: Apache Flink

## Full Details

See: `docs/architecture/dmo-ai-decision-engine.md`
