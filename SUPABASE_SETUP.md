## Supabase setup

1. Crea un archivo `.env` en raiz usando `.env.example` como base.

2. Usa solo:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (publishable)

3. Nunca pongas `sb_secret` en frontend.

4. En Supabase > SQL Editor ejecuta `supabase/schema.sql`.

5. Crea tu usuario con el formulario de Login (`Portal` en la web).

6. Asigna rol admin en SQL:

```sql
update public.profiles
set role = 'admin'
where id = '<TU_USER_UUID>';
```

7. Si compartiste una `sb_secret` en cualquier chat o repo, rotala en Supabase inmediatamente.
