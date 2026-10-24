-- QuickDrop schema. Run the whole file in the Supabase SQL editor.
-- Safe to re-run: tables use IF NOT EXISTS and policies are recreated.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.zones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 100),
  center_lat  double precision not null check (center_lat between -90 and 90),
  center_lng  double precision not null check (center_lng between -180 and 180),
  radius_km   double precision not null check (radius_km > 0),
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 100),
  price       numeric(10, 2) not null check (price >= 0),
  quantity    integer not null check (quantity > 0),
  created_at  timestamptz not null default now()
);

-- Many-to-many: which zones a product is available in.
create table if not exists public.product_zones (
  product_id  uuid not null references public.products (id) on delete cascade,
  zone_id     uuid not null references public.zones (id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (product_id, zone_id)
);

create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id  uuid not null references public.products (id) on delete restrict,
  zone_id     uuid not null references public.zones (id) on delete restrict,
  quantity    integer not null check (quantity > 0),
  address     text check (address is null or char_length(address) <= 300),
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  created_at  timestamptz not null default now()
);

create index if not exists zones_user_id_idx         on public.zones (user_id);
create index if not exists products_user_id_idx      on public.products (user_id);
create index if not exists product_zones_user_id_idx on public.product_zones (user_id);
create index if not exists product_zones_zone_id_idx on public.product_zones (zone_id);
create index if not exists orders_user_id_idx        on public.orders (user_id);
create index if not exists orders_product_id_idx     on public.orders (product_id);
create index if not exists orders_zone_id_idx        on public.orders (zone_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: users read/write only their own rows
-- ---------------------------------------------------------------------------

alter table public.zones         enable row level security;
alter table public.products      enable row level security;
alter table public.product_zones enable row level security;
alter table public.orders        enable row level security;

-- zones
drop policy if exists "zones_select_own" on public.zones;
drop policy if exists "zones_insert_own" on public.zones;
drop policy if exists "zones_update_own" on public.zones;
drop policy if exists "zones_delete_own" on public.zones;

create policy "zones_select_own" on public.zones
  for select to authenticated using (user_id = (select auth.uid()));
create policy "zones_insert_own" on public.zones
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "zones_update_own" on public.zones
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "zones_delete_own" on public.zones
  for delete to authenticated using (user_id = (select auth.uid()));

-- products
drop policy if exists "products_select_own" on public.products;
drop policy if exists "products_insert_own" on public.products;
drop policy if exists "products_update_own" on public.products;
drop policy if exists "products_delete_own" on public.products;

create policy "products_select_own" on public.products
  for select to authenticated using (user_id = (select auth.uid()));
create policy "products_insert_own" on public.products
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "products_update_own" on public.products
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "products_delete_own" on public.products
  for delete to authenticated using (user_id = (select auth.uid()));

-- product_zones: the linked product and zone must also belong to the user
drop policy if exists "product_zones_select_own" on public.product_zones;
drop policy if exists "product_zones_insert_own" on public.product_zones;
drop policy if exists "product_zones_delete_own" on public.product_zones;

create policy "product_zones_select_own" on public.product_zones
  for select to authenticated using (user_id = (select auth.uid()));
create policy "product_zones_insert_own" on public.product_zones
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.products p where p.id = product_id and p.user_id = (select auth.uid()))
    and exists (select 1 from public.zones z where z.id = zone_id and z.user_id = (select auth.uid()))
  );
create policy "product_zones_delete_own" on public.product_zones
  for delete to authenticated using (user_id = (select auth.uid()));

-- orders: the product and zone must belong to the user
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_update_own" on public.orders;
drop policy if exists "orders_delete_own" on public.orders;

create policy "orders_select_own" on public.orders
  for select to authenticated using (user_id = (select auth.uid()));
create policy "orders_insert_own" on public.orders
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.products p where p.id = product_id and p.user_id = (select auth.uid()))
    and exists (select 1 from public.zones z where z.id = zone_id and z.user_id = (select auth.uid()))
  );
create policy "orders_update_own" on public.orders
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.products p where p.id = product_id and p.user_id = (select auth.uid()))
    and exists (select 1 from public.zones z where z.id = zone_id and z.user_id = (select auth.uid()))
  );
create policy "orders_delete_own" on public.orders
  for delete to authenticated using (user_id = (select auth.uid()));
