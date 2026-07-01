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
  variant_label text,
  options_hint text,
  options jsonb check (options is null or jsonb_typeof(options) = 'array'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deals (
  menu_item_id text primary key references public.menu_items(id) on delete cascade,
  handi_quantity integer not null default 0 check (handi_quantity >= 0),
  handi_size text not null default '',
  appetizer_count integer not null default 0 check (appetizer_count >= 0),
  appetizer_types jsonb not null default '[]'::jsonb check (jsonb_typeof(appetizer_types) = 'array'),
  naan_quantity integer not null default 0 check (naan_quantity >= 0),
  drink_volume_ml integer not null default 0 check (drink_volume_ml >= 0),
  free_items jsonb not null default '[]'::jsonb check (jsonb_typeof(free_items) = 'array'),
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
alter table public.deals enable row level security;
alter table public.delivery_areas enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;

create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read available menu items" on public.menu_items for select using (is_available = true);
create policy "Public can read deal specifications" on public.deals for select using (true);
create policy "Public can read active delivery areas" on public.delivery_areas for select using (active = true);
create policy "Public can read approved reviews" on public.reviews for select using (approved = true);
create policy "Public can create reviews" on public.reviews for insert with check (true);
create policy "Public can create orders" on public.orders for insert with check (true);
create policy "Public can create order items" on public.order_items for insert with check (true);

insert into public.categories (id, name, slug, description, sort_order) values
  ('handi-karahi', 'Handi & Karahi', 'handi-karahi', 'Slow-cooked gravies with naan, roti, and family portions.', 1),
  ('chapli-burger', 'Chapli Burger', 'chapli-burger', 'Chapli patties with Single and Twin Tower double-patty options.', 2),
  ('zinger', 'Zinger', 'zinger', 'Crispy chicken burgers, including the Double Decker.', 3),
  ('wraps', 'Wraps', 'wraps', 'Portable favorites for solo cravings and late-night orders.', 4),
  ('appetizers', 'Appetizers', 'appetizers', 'Fries, pasta, chicken strips, dips, and crunchy sides.', 5),
  ('golden-nuggets', 'Golden Nuggets', 'golden-nuggets', 'Injected Al-Baik-style and skin-on Tempura nugget varieties.', 6),
  ('chunky-chicken', 'Chunky Chicken', 'chunky-chicken', 'Crispy chicken chunks with dipping sauce.', 7),
  ('wings', 'Wings', 'wings', 'Masala wings with green chutney and plain baked wings.', 8),
  ('deals', 'Deals', 'deals', 'Solo, buddy, family, couple, and midnight bundles.', 9),
  ('breads-drinks', 'Breads & Drinks', 'breads-drinks', 'Fresh roti, milky naan, cold drinks, and add-ons.', 10),
  ('tea', 'Tea', 'tea', 'Karak doodh patti, cardamom, ginger, and Zaiqa special tea.', 11);

insert into public.delivery_areas (id, name, fee, eta, minimum_order) values
  ('shah-shams', 'Shah Shams / Gulgasht / Nearby', 80, '20-30 min', 499),
  ('city-housing', 'City Housing / Bosan Road', 120, '30-40 min', 599),
  ('multan-cantt', 'Cantt / Multan City', 150, '35-45 min', 699),
  ('wapda-bahadurpur', 'WAPDA Town / Bahadurpur', 180, '40-50 min', 799),
  ('pickup', 'Pickup — Shah Shams Kitchen', 0, 'Ready in 20-30 min', 0);

insert into public.coupons (code, description, percent_off, amount_off, minimum_subtotal) values
  ('ZAIQA15', 'Opening direct-order offer', 15, null, 999),
  ('FIRSTORDER', 'First direct website order', 10, null, 699),
  ('FAMILY100', 'Family bundle discount', null, 100, 1999);

insert into public.menu_items
  (id, category_id, name, slug, description, price, image_url, is_popular, tags, meal_time, spice_level, prep_time_minutes, variant_label, options_hint, options, sort_order)
values
  ('velvety-shahi-handi', 'handi-karahi', 'Velvety Shahi Handi', 'velvety-shahi-handi', 'Creamy homemade chicken handi; choose Half or Full.', 1199, '/images/menu/shahi-handi-clean.webp', true, array['Gravy', 'Best seller', 'Dinner'], 'dinner', 'medium', 40, null, 'Half / Full', '[{"id":"half","label":"Half (500g)","price":1199},{"id":"full","label":"Full (1kg)","price":2199}]'::jsonb, 1),
  ('royal-gola-kabab-half', 'handi-karahi', 'Royal Gola Kabab Bowl Half', 'royal-gola-kabab-half', 'Tender gola kabab in a rich creamy bowl, built for sharing.', 1299, '/images/menu/gola-kabab-clean.webp', false, array['Kabab', 'Dinner'], 'dinner', 'medium', 35, null, null, null, 2),
  ('eco-crunch-patty-burger', 'zinger', 'Eco Crunch Patty Burger', 'eco-crunch-patty-burger', 'Juicy chicken breast with house-made sauce in a toasted bun.', 249, '/images/menu/eco-crunch-patty.jpg', true, array['Burger', 'Crunchy', 'Quick bite'], 'lunch', 'medium', 18, 'Crunchy Patty', null, null, 3),
  ('zinger-booster', 'zinger', 'Zinger Booster', 'zinger-booster', 'Crispy zinger chicken, lettuce, and creamy house sauce.', 299, '/images/menu/zinger-burger.webp', true, array['Zinger', 'Best seller'], 'dinner', 'hot', 20, 'Classic Zinger', null, null, 4),
  ('zaiqa-double-decker', 'zinger', 'Zaiqa Double Decker', 'zaiqa-double-decker', 'Two crispy zinger layers with cheese-style sauce and crunchy lettuce.', 599, '/images/menu/double-decker.webp', false, array['Burger', 'Loaded', 'Double Decker'], 'dinner', 'hot', 24, 'Double Decker', null, null, 5),
  ('zaiqa-chapligar', 'chapli-burger', 'Zaiqa Chapligar', 'zaiqa-chapligar', 'Traditional chapli patty with fresh spices and house sauce.', 249, '/images/menu/eco-crunch.webp', false, array['Burger', 'Chapli', 'Patty'], 'lunch', 'medium', 18, 'Single', null, null, 6),
  ('zaiqa-chapligar-twin-tower', 'chapli-burger', 'Zaiqa Chapligar Twin Tower', 'zaiqa-chapligar-twin-tower', 'Double chapli patties stacked with cheese-style sauce and fresh toppings.', 449, '/images/menu/burger-plate.webp', false, array['Burger', 'Chapli', 'Twin Tower', 'Double Patty'], 'dinner', 'medium', 22, 'Twin Tower', null, null, 7),
  ('zaiqa-wrap', 'wraps', 'Zaiqa Wrap', 'zaiqa-wrap', 'Soft wrap packed with crispy chicken, greens, and house sauce.', 399, '/images/menu/zaiqa-wrap.jpg', false, array['Wrap', 'Lunch'], 'lunch', 'medium', 18, null, null, null, 8),
  ('king-crunch-wrap', 'wraps', 'King Crunch Wrap', 'king-crunch-wrap', 'A bigger wrap with extra crunch, sauce, and late-night energy.', 599, '/images/menu/king-crunch-wrap.jpg', true, array['Wrap', 'Popular', 'Midnight'], 'dinner', 'hot', 22, null, null, null, 9),
  ('salty-plain-fries', 'appetizers', 'Salty Plain Fries', 'salty-plain-fries', 'Classic crisp fries, lightly salted.', 199, '/images/menu/salty-plain-fries.webp', false, array['Fries', 'Snack'], 'lunch', 'mild', 14, null, 'Half / Full', '[{"id":"half","label":"Half","price":199},{"id":"full","label":"Full","price":349}]'::jsonb, 10),
  ('golden-hot-masala-fries', 'appetizers', 'Golden Hot Masala Fries', 'golden-hot-masala-fries', 'Crisp fries tossed in hot masala with house dip.', 249, '/images/menu/masala-fries.webp', true, array['Fries', 'Spicy', 'Snack'], 'lunch', 'hot', 14, null, 'Half / Full', '[{"id":"half","label":"Half","price":249},{"id":"full","label":"Full","price":349}]'::jsonb, 11),
  ('legend-loaded-fries', 'appetizers', 'The Legend Loaded Fries', 'legend-loaded-fries', 'Loaded fries layered with sauce, chicken bites, and spice.', 299, '/images/menu/loaded-fries.webp', true, array['Loaded', 'Best seller', 'Fries'], 'lunch', 'hot', 18, null, 'Half / Full', '[{"id":"half","label":"Half","price":299},{"id":"full","label":"Full","price":499}]'::jsonb, 12),
  ('creamy-silky-pasta', 'appetizers', 'Creamy Silky Pasta', 'creamy-silky-pasta', 'Creamy silky pasta with a rich white sauce.', 299, '/images/menu/creamy-silky-pasta.jpg', false, array['Pasta', 'Creamy'], 'lunch', 'mild', 20, null, 'Half / Full', '[{"id":"half","label":"Half","price":299},{"id":"full","label":"Full","price":549}]'::jsonb, 13),
  ('creamy-spicy-pasta', 'appetizers', 'Creamy Spicy Pasta', 'creamy-spicy-pasta', 'Creamy pasta with a bold, spicy sauce.', 299, '/images/menu/creamy-spicy-pasta.jpg', false, array['Pasta', 'Spicy'], 'lunch', 'hot', 20, null, 'Half / Full', '[{"id":"half","label":"Half","price":299},{"id":"full","label":"Full","price":549}]'::jsonb, 14),
  ('crispy-chicken-strips', 'appetizers', 'Crispy Chicken Strips', 'crispy-chicken-strips', 'Crispy golden chicken breast strips with dipping sauce.', 399, '/images/menu/chicken-strips.webp', false, array['Strips', 'Crispy', 'Chicken'], 'lunch', 'medium', 18, null, '4 / 8 pcs', '[{"id":"4pc","label":"4 Pieces","price":399},{"id":"8pc","label":"8 Pieces","price":749}]'::jsonb, 15),
  ('dip-sauce', 'appetizers', 'Dip Sauce', 'dip-sauce', 'House-made dipping sauce for nuggets, strips, and fries.', 69, '/images/whatsapp/zaiqa-13.jpg', false, array['Dip', 'Sauce', 'Add-on'], 'lunch', 'mild', 5, null, null, null, 16),
  ('injected-nuggets', 'golden-nuggets', 'Injected Nuggets', 'injected-nuggets', 'Al-Baik style injected nuggets with a crisp coating and tender center.', 249, '/images/whatsapp/zaiqa-09.jpg', false, array['Nuggets', 'Injected', 'Al-Baik style'], 'lunch', 'mild', 16, 'Injected', '3 / 6 / 12 pcs', '[{"id":"3pc","label":"3 Pieces","price":249},{"id":"6pc","label":"6 Pieces","price":449},{"id":"12pc","label":"12 Pieces","price":899}]'::jsonb, 17),
  ('tempura-nuggets', 'golden-nuggets', 'Tempura Nuggets', 'tempura-nuggets', 'Skin-on tempura nuggets with a light, crunchy coating.', 249, '/images/menu/tempura-nuggets.jpg', false, array['Nuggets', 'Tempura', 'Skin-on'], 'lunch', 'mild', 16, 'Tempura', '4 / 8 / 12 pcs', '[{"id":"4pc","label":"4 Pieces","price":249},{"id":"8pc","label":"8 Pieces","price":549},{"id":"12pc","label":"12 Pieces","price":849}]'::jsonb, 18),
  ('chunky-chicken-12pc', 'chunky-chicken', 'Chunky Chicken 12 Pieces', 'chunky-chicken-12pc', 'Twelve crispy chicken chunks with a dipping sauce.', 499, '/images/whatsapp/zaiqa-12.jpg', true, array['Chunky', 'Shareable', '12 Pcs'], 'lunch', 'medium', 20, null, null, null, 19),
  ('masala-wings', 'wings', 'Masala Wings', 'masala-wings', 'Masala wings served with green chutney.', 299, '/images/menu/masala-wings.jpg', true, array['Wings', 'Masala', 'Green Chutney'], 'dinner', 'hot', 22, 'Masala Wings', '4 / 8 pcs', '[{"id":"4pc","label":"4 Pieces","price":299},{"id":"8pc","label":"8 Pieces","price":599}]'::jsonb, 20),
  ('plain-baked-wings', 'wings', 'Baked Wings', 'plain-baked-wings', 'Plain baked wings with a crisp, seasoned finish.', 299, '/images/menu/baked-wings-plain.jpg', false, array['Wings', 'Baked', 'Plain'], 'dinner', 'medium', 22, 'Baked Wings', '4 / 8 pcs', '[{"id":"4pc","label":"4 Pieces","price":299},{"id":"8pc","label":"8 Pieces","price":599}]'::jsonb, 21),
  ('solo-handi-deal', 'deals', 'Solo Handi Deal', 'solo-handi-deal', 'Quarter Handi (250g) + 2 Milky Naan + 1 Buddy Drink (350ml).', 649, '/images/menu/deal-solo-handi-v2.jpg', true, array['Deal', 'Solo', 'Handi', 'Naan', 'Drink'], 'dinner', 'medium', 32, null, null, null, 22),
  ('solo-zinger-deal', 'deals', 'Solo Zinger Deal', 'solo-zinger-deal', '1 Zinger Booster + Half Golden Hot Masala Fries + 1 Drink (350ml).', 549, '/images/menu/deal-solo-zinger-v2.jpg', true, array['Deal', 'Solo', 'Zinger', 'Fries', 'Drink'], 'dinner', 'hot', 22, null, null, null, 23),
  ('happy-family-deal', 'deals', 'Happy Family Deal', 'happy-family-deal', 'Half Velvety Shahi Handi (500g) + 8 Injected Nuggets + 12 Baked Wings + 6 Milky Naan + 1.5 Ltr Drink + Free Zinger Booster.', 2899, '/images/menu/deal-happy-family-v2.jpg', true, array['Deal', 'Family', 'Handi', 'Nuggets', 'Wings', 'Naan', 'Drink', 'Free Zinger'], 'dinner', 'medium', 48, null, null, null, 24),
  ('buddy-deal', 'deals', 'Buddy Deal', 'buddy-deal', '2 Zinger Boosters + Half Golden Hot Masala Fries + 2 Buddy Drinks (350ml each).', 949, '/images/menu/deal-buddy-v2.jpg', false, array['Deal', 'Two people', 'Zinger', 'Fries', 'Drinks'], 'dinner', 'hot', 28, null, null, null, 25),
  ('midnight-sharing-deal', 'deals', 'Midnight Sharing Deal', 'midnight-sharing-deal', '2 Zaiqa Wraps + 2 Buddy Drinks (350ml each). Available 11 PM to 1 AM.', 949, '/images/menu/deal-midnight-sharing-v2.jpg', false, array['Deal', 'Midnight', 'Shareable', 'Wrap', 'Drinks'], 'dinner', 'medium', 24, null, null, null, 26),
  ('couple-deal', 'deals', 'Couple Deal', 'couple-deal', '2 Tempura Nuggets + 2 Injected Nuggets + 4 Baked Wings + Regular Fries + 2 Karak Doodh Patti or Drinks.', 899, '/images/menu/deal-couple.jpg', false, array['Deal', 'Couple', 'Nuggets', 'Wings', 'Fries', 'Tea', 'Drink'], 'dinner', 'medium', 30, null, null, null, 27),
  ('milky-naan', 'breads-drinks', 'Milky Naan', 'milky-naan', 'Soft naan for pairing with handi and karahi orders.', 50, '/images/menu/milky-naan-v2.png', false, array['Bread', 'Add-on', 'Naan'], 'dinner', 'mild', 8, null, null, null, 28),
  ('drink-350ml', 'breads-drinks', 'Drink (350ml)', 'drink-350ml', 'Cold soft drink in a 350ml bottle.', 80, '/images/menu/drink-350ml-v2.jpg', false, array['Drink', 'Cold', 'Add-on'], 'lunch', 'mild', 2, null, null, null, 29),
  ('zaiqa-doodh-patti', 'tea', 'Zaiqa Doodh Patti', 'zaiqa-doodh-patti', 'Rich karak doodh patti brewed with milk and tea leaves.', 120, '/images/whatsapp/zaiqa-04.jpg', false, array['Tea', 'Doodh Patti', 'Karak', 'Hot'], 'beverages', 'mild', 10, null, null, null, 30),
  ('cardamom-tea', 'tea', 'Cardamom Tea', 'cardamom-tea', 'Warm cardamom chai for pickup or evening delivery orders.', 120, '/images/whatsapp/zaiqa-05.jpg', false, array['Tea', 'Cardamom', 'Chai', 'Hot'], 'beverages', 'mild', 10, null, null, null, 31),
  ('zaiqa-tea', 'tea', 'Zaiqa Tea', 'zaiqa-tea', 'Zaiqa special tea with a unique house blend.', 120, '/images/whatsapp/zaiqa-06.jpg', false, array['Tea', 'Special', 'Zaiqa', 'Hot'], 'beverages', 'mild', 10, null, null, null, 32),
  ('ginger-tea', 'tea', 'Ginger Tea', 'ginger-tea', 'Fresh ginger tea with a warm, spicy kick.', 120, '/images/whatsapp/zaiqa-07.jpg', false, array['Tea', 'Ginger', 'Chai', 'Hot'], 'beverages', 'mild', 10, null, null, null, 33);

insert into public.deals
  (menu_item_id, handi_quantity, handi_size, appetizer_count, appetizer_types, naan_quantity, drink_volume_ml, free_items)
values
  ('solo-handi-deal', 1, '250g', 0, '[]'::jsonb, 2, 350, '[]'::jsonb),
  ('solo-zinger-deal', 0, '', 1, '["Golden Hot Masala Fries (Half serving)"]'::jsonb, 0, 350, '[]'::jsonb),
  ('happy-family-deal', 1, '500g', 20, '["Injected Nuggets (8 pieces)","Baked Wings (12 pieces)"]'::jsonb, 6, 1500, '["Zinger Booster"]'::jsonb),
  ('buddy-deal', 0, '', 1, '["Golden Hot Masala Fries (Half serving)"]'::jsonb, 0, 700, '[]'::jsonb),
  ('midnight-sharing-deal', 0, '', 0, '[]'::jsonb, 0, 700, '[]'::jsonb),
  ('couple-deal', 0, '', 9, '["Tempura Nuggets (2 pieces)","Injected Nuggets (2 pieces)","Baked Wings (4 pieces)","Regular Fries (1 serving)"]'::jsonb, 0, 700, '[]'::jsonb);

insert into public.reviews (id, name, rating, quote, source, image_url, approved, created_at) values
  ('review-1', 'Areeba K.', 5, 'The Shahi Handi tasted homemade but packed like a premium order. Naan arrived soft and warm.', 'WhatsApp', '/images/menu/shahi-handi-clean.webp', true, '2026-05-29T18:45:00.000Z'),
  ('review-2', 'Hamza M.', 5, 'Zinger Booster and loaded fries were better than my usual delivery app order. Direct WhatsApp confirmation was fast.', 'Website', '/images/menu/zinger-burger.webp', true, '2026-05-31T21:10:00.000Z'),
  ('review-3', 'Nimra S.', 5, 'Family deal was enough for everyone and the gravy had that fresh kitchen flavor.', 'Foodpanda', '/images/menu/shahi-handi-clean.webp', true, '2026-06-02T20:18:00.000Z'),
  ('review-4', 'Bilal R.', 4, 'Masala fries were crisp, spicy, and still hot when delivered. Will order again.', 'Instagram', '/images/menu/masala-fries.webp', true, '2026-06-03T23:35:00.000Z');
