# EHB COMPLETE SYSTEM ER DIAGRAM

> Database Relationship Map

---

# OVERVIEW

ER (Entity-Relationship) diagram shows **data entities and their relationships** in the EHB system.

---

# CORE ER STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USERS                                     │
│                   (Central Identity Table)                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────────────┐
        │                         │                                 │
        ▼                         ▼                                 ▼
┌───────────────┐       ┌───────────────┐               ┌───────────────┐
│ user_profiles │       │ user_devices  │               │ user_sessions │
│               │       │               │               │               │
│ 1:1 with user │       │ 1:many        │               │ 1:many        │
└───────────────┘       └───────────────┘               └───────────────┘
        │
        │ 1:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        JPS_PROFILES                                 │
│                (Professional Identity Table)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  jps_skills   │       │jps_experience │       │ jps_education │
│               │       │               │       │               │
│ 1:many        │       │ 1:many        │       │ 1:many        │
└───────────────┘       └───────────────┘       └───────────────┘
        │
        │ many:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PSS_VERIFICATION                               │
│               (Identity Verification Records)                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   identity    │       │      aml      │       │    address    │
│ verification  │       │   screening   │       │ verification  │
└───────────────┘       └───────────────┘       └───────────────┘
        │
        │ many:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CRB_CERTIFICATION                              │
│                (Professional Certification)                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  skill_tests  │       │ inspections   │       │ certificates  │
│               │       │               │       │               │
│ 1:many        │       │ 1:many        │       │ 1:many        │
└───────────────┘       └───────────────┘       └───────────────┘
        │
        │ many:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        STL_SCORES                                   │
│                  (Trust Level Scores)                              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│    reviews    │       │  complaints   │       │   rankings    │
│               │       │               │       │               │
│ 1:many        │       │ 1:many        │       │ 1:1           │
└───────────────┘       └───────────────┘       └───────────────┘
        │
        │ many:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MARKETPLACE                                  │
│               (Products & Services)                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   products    │       │   services    │       │    orders     │
│               │       │               │       │               │
│ 1:many        │       │ 1:many        │       │ 1:many        │
└───────────────┘       └───────────────┘       └───────────────┘
        │
        │ many:1
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          WALLET                                     │
│                  (Financial Accounts)                              │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       TRANSACTIONS                                  │
│               (Payment Records)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

# KEY RELATIONSHIPS

| Parent Entity | Child Entity | Relationship | Description |
|---------------|--------------|--------------|-------------|
| Users | JPS Profiles | 1:1 | One profile per user |
| Users | Orders | 1:many | User can have many orders |
| Users | Wallet | 1:1 | One wallet per user |
| JPS Profiles | Skills | 1:many | Profile has many skills |
| JPS Profiles | Experience | 1:many | Profile has many experiences |
| JPS Profiles | Education | 1:many | Profile has many education entries |
| Users | PSS Verification | 1:many | User has verification history |
| Users | CRB Certificates | 1:many | User can have multiple certificates |
| Users | STL Scores | 1:many | User has score history |
| Wallet | Transactions | 1:many | Wallet has many transactions |
| Products | Orders | many:many | Products in multiple orders |
| Services | Service Orders | 1:many | Service can be ordered many times |
| Franchises | Inspections | 1:many | Franchise does many inspections |

---

# ENTITY RELATIONSHIP DETAILS

## Users → JPS Profile (1:1)

```
users.id ←→ jps_profiles.user_id
```

Every user has exactly one professional profile.

---

## JPS Profile → Skills (1:many)

```
jps_profiles.id → jps_skills.profile_id
```

A profile can have multiple skills.

---

## Users → Wallet (1:1)

```
users.id ←→ wallet_accounts.user_id
```

Each user has one wallet account.

---

## Wallet → Transactions (1:many)

```
wallet_accounts.id → wallet_transactions.wallet_id
```

A wallet has many transactions.

---

## Users → Orders (1:many)

```
users.id → orders.customer_id
```

Users can place multiple orders.

---

## Orders → Order Items (1:many)

```
orders.id → order_items.order_id
```

An order contains multiple items.

---

## Products → Categories (many:1)

```
products.category_id → product_categories.id
```

Products belong to one category.

---

## Service Provider → Service Orders (1:many)

```
users.id → service_orders.provider_id
```

Providers receive multiple service orders.

---

# COMPLETE RELATIONSHIP MAP

```
USERS (1) ──── (1) JPS_PROFILES (1) ──── (n) SKILLS
   │                    │
   │                    └──── (n) EXPERIENCE
   │                    │
   │                    └──── (n) EDUCATION
   │
   └──── (n) PSS_VERIFICATION
   │
   └──── (n) CRB_CERTIFICATES
   │
   └──── (n) STL_SCORES ──── (n) REVIEWS
   │                    │
   │                    └──── (n) COMPLAINTS
   │
   └──── (1) WALLET ──── (n) TRANSACTIONS
   │
   └──── (n) ORDERS ──── (n) ORDER_ITEMS ──── (1) PRODUCTS
   │
   └──── (n) SERVICE_ORDERS ──── (1) SERVICES
```

---

# FOREIGN KEY CONSTRAINTS

```sql
-- JPS Profile
ALTER TABLE jps_profiles 
ADD CONSTRAINT fk_jps_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Skills
ALTER TABLE jps_skills 
ADD CONSTRAINT fk_skills_profile 
FOREIGN KEY (profile_id) REFERENCES jps_profiles(id);

-- Wallet
ALTER TABLE wallet_accounts 
ADD CONSTRAINT fk_wallet_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Transactions
ALTER TABLE wallet_transactions 
ADD CONSTRAINT fk_tx_wallet 
FOREIGN KEY (wallet_id) REFERENCES wallet_accounts(id);

-- Orders
ALTER TABLE orders 
ADD CONSTRAINT fk_order_customer 
FOREIGN KEY (customer_id) REFERENCES users(id);

-- STL Scores
ALTER TABLE stl_scores 
ADD CONSTRAINT fk_stl_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

---

*Complete ER Diagram v1.0 | March 2026*
