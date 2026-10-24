-- QuickDrop demo data for test@quickdrop.app.
-- 1. Create the user first (sign up in the app, or Supabase → Authentication → Add user).
-- 2. Run supabase/schema.sql, then run this whole file in the SQL editor.
-- Re-runnable: it first clears this demo user's existing zones, products and orders.

do $$
declare
  uid uuid;
  z_maarif uuid;
  z_aindiab uuid;
  z_centre uuid;
  p_pizza uuid;
  p_tacos uuid;
  p_msemen uuid;
  p_burger uuid;
  p_jus uuid;
begin
  select id into uid from auth.users where email = 'test@quickdrop.app';
  if uid is null then
    raise exception 'User test@quickdrop.app not found. Create it in Authentication first.';
  end if;

  -- Reset this demo user's data (orders first: they restrict product/zone deletes).
  delete from public.orders   where user_id = uid;
  delete from public.products where user_id = uid; -- cascades product_zones
  delete from public.zones    where user_id = uid;

  -- Zones (Casablanca)
  insert into public.zones (user_id, name, center_lat, center_lng, radius_km)
    values (uid, 'Maarif', 33.5800, -7.6320, 1.5) returning id into z_maarif;
  insert into public.zones (user_id, name, center_lat, center_lng, radius_km)
    values (uid, 'Ain Diab', 33.5930, -7.6750, 2.0) returning id into z_aindiab;
  insert into public.zones (user_id, name, center_lat, center_lng, radius_km)
    values (uid, 'Casa Centre', 33.5950, -7.6180, 2.0) returning id into z_centre;

  -- Products (prices in MAD)
  insert into public.products (user_id, name, price, quantity)
    values (uid, 'Pizza Margherita', 65.00, 40) returning id into p_pizza;
  insert into public.products (user_id, name, price, quantity)
    values (uid, 'Tacos Poulet', 45.00, 60) returning id into p_tacos;
  insert into public.products (user_id, name, price, quantity)
    values (uid, 'Msemen', 8.00, 100) returning id into p_msemen;
  insert into public.products (user_id, name, price, quantity)
    values (uid, 'Burger', 55.00, 50) returning id into p_burger;
  insert into public.products (user_id, name, price, quantity)
    values (uid, 'Jus d''orange', 15.00, 80) returning id into p_jus;

  -- Availability
  insert into public.product_zones (user_id, product_id, zone_id) values
    (uid, p_pizza,  z_maarif), (uid, p_pizza,  z_centre),
    (uid, p_tacos,  z_maarif), (uid, p_tacos,  z_aindiab), (uid, p_tacos, z_centre),
    (uid, p_msemen, z_centre),
    (uid, p_burger, z_maarif), (uid, p_burger, z_aindiab),
    (uid, p_jus,    z_aindiab), (uid, p_jus,    z_centre);

  -- Orders: each point is inside its zone (checked with haversine), and the
  -- zone is the nearest matching center among the product's zones.
  insert into public.orders (user_id, product_id, zone_id, quantity, lat, lng, address, created_at) values
    (uid, p_pizza,  z_maarif,  2, 33.5815, -7.6345, 'Bd Zerktouni, near Twin Center', now() - interval '2 days'),
    (uid, p_tacos,  z_aindiab, 3, 33.5925, -7.6790, 'Corniche, Ain Diab',             now() - interval '1 day 5 hours'),
    (uid, p_msemen, z_centre,  6, 33.5940, -7.6150, 'Place Mohammed V',               now() - interval '1 day'),
    (uid, p_burger, z_aindiab, 1, 33.5880, -7.6620, 'Bd de l''Océan Atlantique',      now() - interval '6 hours'),
    (uid, p_jus,    z_centre,  4, 33.5985, -7.6230, 'Bd Mohammed V, 3rd floor',       now() - interval '1 hour');
end $$;
