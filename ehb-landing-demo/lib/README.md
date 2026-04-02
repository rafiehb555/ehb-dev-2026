# lib

Shared utilities, config, domain contracts, and API client.

- Domain folders in `lib/<domain>/` are the preferred home for model-like files, schemas, seed data, and service contracts.
- Root-level compatibility files may re-export from a domain folder during migration, but new work should target the domain source directly.
- Examples:
  - `lib/ai/` for AI schemas, types, and services
  - `lib/jps/` for JPS data, profiles, schemas, and store logic
  - `lib/industry/` for industry config and service mappings
  - `lib/marketplace/` for marketplace and GoSellr data contracts

See: [docs/FOLDER_ARCHITECTURE.md](../../docs/FOLDER_ARCHITECTURE.md)
