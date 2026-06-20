create extension if not exists "pgcrypto";

create type order_status as enum (
  'whatsapp_pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled'
);

create type payment_method as enum (
  'cash_on_delivery',
  'bank_transfer',
  'easypaisa_jazzcash'
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  loyalty_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  is_popular boolean not null default false,
  tags text[] not null default '{}',
  meal_time text check (meal_time in ('breakfast', 'lunch', 'dinner', 'desserts', 'beverages')),
  spice_level text not null default 'medium' check (spice_level in ('mild', 'medium', 'hot')),
  prep_time_minutes integer not null default 20,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_areas (
  id text primary key,
  name text not null,
  fee numeric(10, 2) not null default 0,
  eta text not null default '30-45 min',
  minimum_order numeric(10, 2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id text primary key,
  user_id uuid references public.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  delivery_area_id text references public.delivery_areas(id) on delete set null,
  delivery_area_name text not null,
  delivery_fee numeric(10, 2) not null default 0,
  subtotal numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  coupon_code text,
  loyalty_points_earned integer not null default 0,
  payment_method payment_method not null default 'cash_on_delivery',
  notes text,
  status order_status not null default 'whatsapp_pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text not null,
  price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.reviews (
  id text primary key,
  user_id uuid references public.users(id) on delete set null,
  order_id text references public.orders(id) on delete set null,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  quote text not null,
  source text not null default 'Website' check (source in ('Website', 'WhatsApp', 'Foodpanda', 'Instagram')),
  image_url text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.coupons (
  code text primary key,
  description text not null,
  percent_off integer check (percent_off is null or percent_off between 1 and 100),
  amount_off numeric(10, 2) check (amount_off is null or amount_off >= 0),
  minimum_subtotal numeric(10, 2) not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (percent_off is not null or amount_off is not null)
);

create index menu_items_category_idx on public.menu_items(category_id);
create index menu_items_available_idx on public.menu_items(is_available);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);
create index reviews_approved_idx on public.reviews(approved);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.delivery_areas enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;

create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read available menu items" on public.menu_items for select using (is_available = true);
create policy "Public can read active delivery areas" on public.delivery_areas for select using (active = true);
create policy "Public can read approved reviews" on public.reviews for select using (approved = true);
create policy "Public can create reviews" on public.reviews for insert with check (true);
create policy "Public can create orders" on public.orders for insert with check (true);
create policy "Public can create order items" on public.order_items for insert with check (true);

insert into public.categories (id, name, slug, description, sort_order) values
  ('handi-karahi', 'Handi & Karahi', 'handi-karahi', 'Slow-cooked gravies with naan, roti, and family portions.', 1),
  ('burgers', 'Burgers', 'burgers', 'Crispy chicken, house sauce, and fresh buns.', 2),
  ('wraps', 'Wraps', 'wraps', 'Portable favorites for solo cravings and late-night orders.', 3),
  ('appetizers', 'Appetizers', 'appetizers', 'Fries, nuggets, wings, dips, and crunchy sides.', 4),
  ('deals', 'Deals', 'deals', 'Solo, buddy, family, and midnight bundles.', 5),
  ('breads-drinks', 'Breads & Drinks', 'breads-drinks', 'Fresh roti, milky naan, chai, and add-ons.', 6)
on conflict (id) do nothing;

insert into public.delivery_areas (id, name, fee, eta, minimum_order) values
  ('shah-shams', 'Shah Shams / Gulgasht / Nearby', 80, '20-30 min', 499),
  ('city-housing', 'City Housing / Bosan Road', 120, '30-40 min', 599),
  ('multan-cantt', 'Cantt / Multan City', 150, '35-45 min', 699),
  ('wapda-bahadurpur', 'WAPDA Town / Bahadurpur', 180, '40-50 min', 799),
  ('pickup', 'Pickup — Shah Shams Kitchen', 0, 'Ready in 20-30 min', 0)
on conflict (id) do nothing;

insert into public.coupons (code, description, percent_off, amount_off, minimum_subtotal) values
  ('ZAIQA15', 'Opening direct-order offer', 15, null, 999),
  ('FIRSTORDER', 'First direct website order', 10, null, 699),
  ('FAMILY100', 'Family bundle discount', null, 100, 1999)
on conflict (code) do nothing;

insert into public.menu_items
  (id, category_id, name, slug, description, price, image_url, is_popular, tags, spice_level, prep_time_minutes, sort_order)
values
  ('velvety-shahi-handi-half', 'handi-karahi', 'Velvety Shahi Handi Half', 'velvety-shahi-handi-half', 'Creamy homemade chicken handi with soft spices and fresh garnish.', 1249, '/images/whatsapp/zaiqa-17.jpg', true, array['Gravy','Best seller','Dinner'], 'medium', 35, 1),
  ('velvety-shahi-handi-full', 'handi-karahi', 'Velvety Shahi Handi Full', 'velvety-shahi-handi-full', 'A generous family portion of the signature shahi handi.', 2399, '/images/whatsapp/zaiqa-18.jpg', true, array['Family','Gravy','Fresh naan pairing'], 'medium', 45, 2),
  ('royal-gola-kabab-half', 'handi-karahi', 'Royal Gola Kabab Bowl Half', 'royal-gola-kabab-half', 'Tender gola kabab in a rich creamy bowl, built for sharing.', 1299, '/images/whatsapp/zaiqa-18.jpg', false, array['Kabab','Dinner'], 'medium', 35, 3),
  ('zaiqa-eco-crunch', 'burgers', 'Zaiqa Eco Crunch', 'zaiqa-eco-crunch', 'Juicy chicken breast with house-made sauce in a toasted bun.', 329, '/images/whatsapp/zaiqa-08.jpg', true, array['Burger','Crunchy','Quick bite'], 'medium', 18, 4),
  ('zinger-booster', 'burgers', 'Zinger Booster', 'zinger-booster', 'Crispy zinger chicken, lettuce, and creamy house sauce.', 349, '/images/whatsapp/zaiqa-15.jpg', true, array['Zinger','Best seller'], 'hot', 20, 5),
  ('zaiqa-double-decker', 'burgers', 'Zaiqa Double Decker', 'zaiqa-double-decker', 'Two crispy layers with cheese-style sauce and crunchy lettuce.', 749, '/images/whatsapp/zaiqa-03.jpg', false, array['Burger','Loaded'], 'hot', 24, 6),
  ('zaiqa-wrap', 'wraps', 'Zaiqa Wrap', 'zaiqa-wrap', 'Soft wrap packed with crispy chicken, greens, and house sauce.', 499, '/images/whatsapp/zaiqa-19.jpg', false, array['Wrap','Lunch'], 'medium', 18, 7),
  ('king-crunch-wrap', 'wraps', 'King Crunch Wrap', 'king-crunch-wrap', 'A bigger wrap with extra crunch, sauce, and late-night energy.', 699, '/images/whatsapp/zaiqa-19.jpg', true, array['Wrap','Popular','Midnight'], 'hot', 22, 8),
  ('zaiqa-chunky-chicken', 'appetizers', 'Zaiqa Chunky Chicken', 'zaiqa-chunky-chicken', 'Twelve crispy chicken chunks with a dipping sauce.', 599, '/images/whatsapp/zaiqa-12.jpg', true, array['Appetizer','Shareable'], 'medium', 20, 9),
  ('golden-nuggets', 'appetizers', 'Golden Nuggets', 'golden-nuggets', 'Six golden nuggets, crisp outside and tender inside.', 499, '/images/whatsapp/zaiqa-09.jpg', false, array['Nuggets','Kids'], 'mild', 16, 10),
  ('golden-hot-masala-fries', 'appetizers', 'Golden Hot Masala Fries', 'golden-hot-masala-fries', 'Crisp fries tossed in hot masala with house dip.', 499, '/images/whatsapp/zaiqa-16.jpg', true, array['Fries','Spicy','Snack'], 'hot', 14, 11),
  ('legend-loaded-fries', 'appetizers', 'The Legend Loaded Fries', 'legend-loaded-fries', 'Loaded fries layered with sauce, chicken bites, and spice.', 599, '/images/whatsapp/zaiqa-01.jpg', true, array['Loaded','Best seller'], 'hot', 18, 12),
  ('solo-handi-deal', 'deals', 'Solo Handi Deal', 'solo-handi-deal', 'Quarter handi, two naan, and a buddy drink.', 699, '/images/whatsapp/zaiqa-20.jpg', true, array['Deal','Solo'], 'medium', 32, 13),
  ('solo-zinger-deal', 'deals', 'Solo Zinger Deal', 'solo-zinger-deal', 'One Zinger Booster with half fries and drink.', 599, '/images/whatsapp/zaiqa-03.jpg', true, array['Deal','Burger'], 'hot', 22, 14),
  ('happy-family-deal', 'deals', 'Happy Family Deal', 'happy-family-deal', 'Half Shahi Handi, half Royal Gola Kabab, six milky naan, and 1.5L drink.', 2999, '/images/whatsapp/zaiqa-20.jpg', true, array['Family','Bundle'], 'medium', 48, 15),
  ('buddy-deal', 'deals', 'Buddy Deal', 'buddy-deal', 'Two Zinger Boosters, golden hot masala fries half, and buddy drinks.', 999, '/images/whatsapp/zaiqa-03.jpg', false, array['Deal','Two people'], 'hot', 28, 16),
  ('midnight-sharing-deal', 'deals', 'Midnight Sharing Deal', 'midnight-sharing-deal', 'Two Zaiqa wraps and two buddy drinks, available 11 PM to 1 AM.', 999, '/images/whatsapp/zaiqa-19.jpg', false, array['Midnight','Shareable'], 'medium', 24, 17),
  ('milky-naan', 'breads-drinks', 'Milky Naan', 'milky-naan', 'Soft naan for pairing with handi and karahi orders.', 50, '/images/whatsapp/zaiqa-18.jpg', false, array['Bread','Add-on'], 'mild', 8, 18),
  ('elaichi-chai', 'breads-drinks', 'Elaichi Chai', 'elaichi-chai', 'Warm cardamom chai for pickup or evening delivery orders.', 180, '/images/whatsapp/zaiqa-05.jpg', false, array['Chai','Drink'], 'mild', 10, 19)
on conflict (id) do nothing;

insert into public.reviews (id, name, rating, quote, source, image_url, approved, created_at) values
  ('review-1', 'Areeba K.', 5, 'The Shahi Handi tasted homemade but packed like a premium order. Naan arrived soft and warm.', 'WhatsApp', '/images/whatsapp/zaiqa-17.jpg', true, '2026-05-29T18:45:00.000Z'),
  ('review-2', 'Hamza M.', 5, 'Zinger Booster and loaded fries were better than my usual delivery app order. Direct WhatsApp confirmation was fast.', 'Website', '/images/whatsapp/zaiqa-15.jpg', true, '2026-05-31T21:10:00.000Z'),
  ('review-3', 'Nimra S.', 5, 'Family deal was enough for everyone and the gravy had that fresh kitchen flavor.', 'Foodpanda', '/images/whatsapp/zaiqa-20.jpg', true, '2026-06-02T20:18:00.000Z'),
  ('review-4', 'Bilal R.', 4, 'Masala fries were crisp, spicy, and still hot when delivered. Will order again.', 'Instagram', '/images/whatsapp/zaiqa-16.jpg', true, '2026-06-03T23:35:00.000Z')
on conflict (id) do nothing;
