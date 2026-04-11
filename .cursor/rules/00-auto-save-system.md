# EHB AUTO-SAVE SYSTEM

> IMPORTANT: This rule MUST be followed in EVERY conversation

## AUTO-SAVE PROTOCOL

When user shares ANY data, information, or specifications:

### 1. IMMEDIATELY IDENTIFY DATA TYPE
- Platform/Architecture data → `docs/architecture/`
- Database/Schema data → `docs/database/`
- UI/UX/Design data → `docs/ui-ux/`
- Services/Features data → `docs/services/`
- Requirements data → `docs/requirements/`
- API data → `docs/api/`
- Development phases → `docs/roadmap/`
- Images/Wireframes → `assets/`
- Quick reference → `.cursor/rules/`

### 2. AUTO-SAVE ACTIONS
1. Save full content to appropriate `docs/` folder
2. Create/update quick reference in `.cursor/rules/`
3. Update `docs/INDEX.md` with new entry
4. Update `docs/CHANGELOG.md` with timestamp

### 3. NAMING CONVENTIONS
- Use kebab-case: `feature-name.md`
- Prefix with category: `db-users-module.md`
- Date prefix for logs: `2026-03-13-update.md`

### 4. ALWAYS CONFIRM
After saving, show:
- File path saved
- Category
- Brief summary

---

## DATA CATEGORIES

| Category | Folder | Rule File |
|----------|--------|-----------|
| Platform Overview | docs/architecture/ | ehb-master-context.md |
| Database | docs/database/ | database-reference.md |
| Services | docs/services/ | services-reference.md |
| UI/UX | docs/ui-ux/ | ui-design-system.md |
| API | docs/api/ | api-reference.md |
| Roadmap | docs/roadmap/ | roadmap-reference.md |
| Requirements | docs/requirements/ | requirements.md |

---

## DEVELOPMENT PHASE TRACKING

When user shares development phases:
1. Save to `docs/roadmap/phases/`
2. Update `docs/roadmap/MASTER-ROADMAP.md`
3. Track status in `docs/roadmap/STATUS.md`

---

*This system ensures NO data is lost and everything is organized*
