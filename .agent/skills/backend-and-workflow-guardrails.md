# Backend & Workflow Guardrails

## C# / .NET 8+ Directives
- **Zero AutoMapper**: NEVER use AutoMapper or reflection-based magic mappers. Always write explicit, compile-time safe extension methods for DTO projection (e.g. `entity.ToDto()`).
- **Read-Only Performance**: Always append `.AsNoTracking()` to read-only Entity Framework queries to eliminate unnecessary change tracking overhead.
- **CancellationToken Propagation**: Always accept and propagate `CancellationToken cancellationToken` through controllers, services, and repository layers down to async EF Core methods.
- **Clean Architecture Boundaries**: Keep domain entities isolated from API contracts. Controllers only accept and return DTOs/records.

## Supabase & SQL Guardrails
- **No Wildcard Queries**: Never execute `select('*')`. Always select explicitly named columns (e.g. `select('id, name, created_at')`) to minimize bandwidth and preserve index efficiency.
- **Row Level Security (RLS)**: Enforce RLS on every table. Provide explicit security policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **Strict Error Handling**: Always check and handle `{ data, error }` returns from Supabase queries. Never assume queries succeed.
