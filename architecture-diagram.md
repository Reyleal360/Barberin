# Architecture Diagram

## Current Architecture (Using localStorage)

```mermaid
graph TD
    A[HTML Pages] --> B[JavaScript Files]
    B --> C[localStorage]
    C --> D[Students Data]
    C --> E[Courses Data]
    C --> F[Absences Data]
    C --> G[Users Data]
```

## New Architecture (Using JSON File)

```mermaid
graph TD
    A[HTML Pages] --> B[JavaScript Files]
    B --> H[DataManager Class]
    H --> I[data.json]
    I --> J[All Application Data]
```

## Benefits of New Architecture

1. **Centralized Data Storage**: All data is stored in a single JSON file
2. **Easier Management**: Data can be easily backed up or migrated
3. **Consistent Interface**: DataManager provides a consistent API for data operations
4. **Better Organization**: Clear separation between data management and business logic