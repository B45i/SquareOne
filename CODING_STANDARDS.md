# Coding Standards

## Files & Naming

- All filenames use `kebab-case`
- One component per file
- Utility functions in their own dedicated file

## Components

- Max **300 lines** per component
- Components own their data — fetch and mutate internally, do not receive data via props from a parent or bubble events up to trigger parent mutations
- No custom svg, only use icon pack (lucide-react) or available svg files, do not write inline svg files.

## Data Fetching

- Fetch data with **React Query** (`useQuery`)
- Write data with **React Query mutations** (`useMutation`)
- All query keys must be defined in `src/lib/query-keys.ts` — never declare inline `queryKey` arrays in components
- All forms must use **react-hook-form** with **zod** schema validation via `@hookform/resolvers/zod`. Never use uncontrolled inputs or manual `useState` form state. Use `Controller` to integrate non-native inputs (comboboxes, pickers, etc.)

## Project Structure

- Follow **co-location** — keep related files (component, query, types, styles) together near the feature they belong to
