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
  ('chapli-burgers', 'Chapli Burgers', 'chapli-burgers', 'Traditional chapli patties with fresh spices and house sauce.', 2),
  ('crunchy-burger', 'Crunchy Burger', 'crunchy-burger', 'Crispy chicken, house sauce, and fresh buns.', 3),
  ('wraps', 'Wraps', 'wraps', 'Portable favorites for solo cravings and late-night orders.', 4),
  ('appetizers', 'Appetizers', 'appetizers', 'Fries, nuggets, strips, dips, and crunchy sides.', 4),
  ('chunky-chicken', 'Chunky Chicken', 'chunky-chicken', 'Crispy chicken chunks with dipping sauce.', 5),
  ('wings', 'Wings', 'wings', 'Masala wings with green chutney and plain baked wings.', 6),
  ('deals', 'Deals', 'deals', 'Solo, buddy, family, couple, and midnight bundles.', 7),
  ('breads-drinks', 'Breads & Drinks', 'breads-drinks', 'Fresh roti, milky naan, cold drinks, and add-ons.', 8),
  ('tea', 'Tea', 'tea', 'Karak doodh patti, cardamom, ginger, and Zaiqa special tea.', 9)
on conflict (id) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

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
  ('velvety-shahi-handi-half', 'handi-karahi', 'Velvety Shahi Handi Half', 'velvety-shahi-handi-half', 'Creamy homemade chicken handi — Half portion (500g).', 1199, '/images/menu/shahi-handi-clean.webp', true, array['Gravy', 'Best seller', 'Dinner', 'Half'], 'medium', 35, 1),
  ('velvety-shahi-handi-full', 'handi-karahi', 'Velvety Shahi Handi Full', 'velvety-shahi-handi-full', 'Creamy homemade chicken handi — Full portion (1kg).', 2199, '/images/menu/shahi-handi-clean.webp', true, array['Gravy', 'Family', 'Dinner', 'Full'], 'medium', 45, 2),
  ('royal-gola-kabab-half', 'handi-karahi', 'Royal Gola Kabab Bowl Half', 'royal-gola-kabab-half', 'Tender gola kabab in a rich creamy bowl, built for sharing.', 1299, '/images/menu/gola-kabab-clean.webp', false, array['Kabab', 'Dinner'], 'medium', 35, 3),
  ('eco-crunch-patty-burger', 'burgers', 'Eco Crunch Patty Burger', 'eco-crunch-patty-burger', 'Juicy chicken breast with house-made sauce in a toasted bun.', 249, '/images/menu/eco-crunch.webp', true, array['Burger', 'Crunchy', 'Quick bite'], 'medium', 18, 4),
  ('zinger-booster', 'burgers', 'Zinger Booster', 'zinger-booster', 'Crispy zinger chicken, lettuce, and creamy house sauce.', 299, '/images/menu/zinger-burger.webp', true, array['Zinger', 'Best seller'], 'hot', 20, 5),
  ('zaiqa-double-decker', 'burgers', 'Zaiqa Double Decker', 'zaiqa-double-decker', 'Two crispy zinger layers with cheese-style sauce and crunchy lettuce.', 599, '/images/menu/double-decker.webp', false, array['Burger', 'Loaded', 'Double Decker'], 'hot', 24, 6),
  ('zaiqa-chapligar', 'burgers', 'Zaiqa Chapligar', 'zaiqa-chapligar', 'Traditional chapli patty with fresh spices and house sauce.', 249, '/images/menu/burger-plate.webp', false, array['Burger', 'Chapli', 'Patty'], 'medium', 18, 7),
  ('zaiqa-chapligar-twin-tower', 'burgers', 'Zaiqa Chapligar Twin Tower', 'zaiqa-chapligar-twin-tower', 'Double chapli patties stacked with cheese-style sauce and fresh toppings.', 449, '/images/menu/burger-plate.webp', false, array['Burger', 'Chapli', 'Twin Tower', 'Double Patty'], 'medium', 22, 8),
  ('zaiqa-wrap', 'wraps', 'Zaiqa Wrap', 'zaiqa-wrap', 'Soft wrap packed with crispy chicken, greens, and house sauce.', 399, '/images/menu/wrap.webp', false, array['Wrap', 'Lunch'], 'medium', 18, 9),
  ('king-crunch-wrap', 'wraps', 'King Crunch Wrap', 'king-crunch-wrap', 'A bigger wrap with extra crunch, sauce, and late-night energy.', 599, '/images/menu/wrap.webp', true, array['Wrap', 'Popular', 'Midnight'], 'hot', 22, 10),
  ('salty-plain-fries-half', 'appetizers', 'Salty Plain Fries Half', 'salty-plain-fries-half', 'Classic crisp fries, lightly salted — Half portion.', 199, '/images/menu/salty-plain-fries.webp', false, array['Fries', 'Snack', 'Half'], 'mild', 14, 11),
  ('salty-plain-fries-full', 'appetizers', 'Salty Plain Fries Full', 'salty-plain-fries-full', 'Classic crisp fries, lightly salted — Full portion.', 349, '/images/menu/salty-plain-fries.webp', false, array['Fries', 'Snack', 'Full'], 'mild', 14, 12),
  ('golden-hot-masala-fries-half', 'appetizers', 'Golden Hot Masala Fries Half', 'golden-hot-masala-fries-half', 'Crisp fries tossed in hot masala with house dip — Half portion.', 249, '/images/menu/masala-fries.webp', true, array['Fries', 'Spicy', 'Snack', 'Half'], 'hot', 14, 13),
  ('golden-hot-masala-fries-full', 'appetizers', 'Golden Hot Masala Fries Full', 'golden-hot-masala-fries-full', 'Crisp fries tossed in hot masala with house dip — Full portion.', 349, '/images/menu/masala-fries.webp', true, array['Fries', 'Spicy', 'Snack', 'Full'], 'hot', 14, 14),
  ('legend-loaded-fries-half', 'appetizers', 'The Legend Loaded Fries Half', 'legend-loaded-fries-half', 'Loaded fries layered with sauce, chicken bites, and spice — Half portion.', 299, '/images/menu/loaded-fries.webp', true, array['Loaded', 'Best seller', 'Half'], 'hot', 18, 15),
  ('legend-loaded-fries-full', 'appetizers', 'The Legend Loaded Fries Full', 'legend-loaded-fries-full', 'Loaded fries layered with sauce, chicken bites, and spice — Full portion.', 499, '/images/menu/loaded-fries.webp', true, array['Loaded', 'Best seller', 'Full'], 'hot', 18, 16),
  ('creamy-silky-pasta-half', 'appetizers', 'Creamy Silky Pasta Half', 'creamy-silky-pasta-half', 'Creamy silky pasta with rich white sauce — Half portion.', 299, '/images/menu/burger-plate.webp', false, array['Pasta', 'Creamy', 'Half'], 'mild', 20, 17),
  ('creamy-silky-pasta-full', 'appetizers', 'Creamy Silky Pasta Full', 'creamy-silky-pasta-full', 'Creamy silky pasta with rich white sauce — Full portion.', 549, '/images/menu/burger-plate.webp', false, array['Pasta', 'Creamy', 'Full'], 'mild', 25, 18),
  ('creamy-spicy-pasta-half', 'appetizers', 'Creamy Spicy Pasta Half', 'creamy-spicy-pasta-half', 'Creamy spicy pasta with bold flavors — Half portion.', 299, '/images/menu/burger-plate.webp', false, array['Pasta', 'Spicy', 'Half'], 'hot', 20, 19),
  ('creamy-spicy-pasta-full', 'appetizers', 'Creamy Spicy Pasta Full', 'creamy-spicy-pasta-full', 'Creamy spicy pasta with bold flavors — Full portion.', 549, '/images/menu/burger-plate.webp', false, array['Pasta', 'Spicy', 'Full'], 'hot', 25, 20),
  ('injected-nuggets-3pc', 'appetizers', 'Injected Nuggets 3 Pieces', 'injected-nuggets-3pc', 'Al-Baik style injected nuggets, crisp and tender — 3 pieces.', 249, '/images/menu/nuggets.webp', false, array['Nuggets', 'Injected', 'Kids', '3 Pcs'], 'mild', 16, 21),
  ('injected-nuggets-6pc', 'appetizers', 'Injected Nuggets 6 Pieces', 'injected-nuggets-6pc', 'Al-Baik style injected nuggets, crisp and tender — 6 pieces.', 449, '/images/menu/nuggets.webp', false, array['Nuggets', 'Injected', 'Kids', '6 Pcs'], 'mild', 16, 22),
  ('injected-nuggets-12pc', 'appetizers', 'Injected Nuggets 12 Pieces', 'injected-nuggets-12pc', 'Al-Baik style injected nuggets, crisp and tender — 12 pieces.', 899, '/images/menu/nuggets.webp', false, array['Nuggets', 'Injected', 'Shareable', '12 Pcs'], 'mild', 18, 23),
  ('tempura-nuggets-4pc', 'appetizers', 'Tempura Nuggets 4 Pieces', 'tempura-nuggets-4pc', 'Skin-on tempura nuggets with a light crunchy coating — 4 pieces.', 249, '/images/menu/nuggets.webp', false, array['Nuggets', 'Tempura', 'Skin-on', '4 Pcs'], 'mild', 16, 24),
  ('tempura-nuggets-8pc', 'appetizers', 'Tempura Nuggets 8 Pieces', 'tempura-nuggets-8pc', 'Skin-on tempura nuggets with a light crunchy coating — 8 pieces.', 549, '/images/menu/nuggets.webp', false, array['Nuggets', 'Tempura', 'Skin-on', '8 Pcs'], 'mild', 16, 25),
  ('tempura-nuggets-12pc', 'appetizers', 'Tempura Nuggets 12 Pieces', 'tempura-nuggets-12pc', 'Skin-on tempura nuggets with a light crunchy coating — 12 pieces.', 849, '/images/menu/nuggets.webp', false, array['Nuggets', 'Tempura', 'Skin-on', 'Shareable', '12 Pcs'], 'mild', 18, 26),
  ('crispy-chicken-strips-4pc', 'appetizers', 'Crispy Chicken Strips 4 Pieces', 'crispy-chicken-strips-4pc', 'Crispy golden chicken strips with dipping sauce — 4 pieces.', 399, '/images/menu/chicken-strips.webp', false, array['Strips', 'Crispy', '4 Pcs'], 'medium', 18, 27),
  ('crispy-chicken-strips-8pc', 'appetizers', 'Crispy Chicken Strips 8 Pieces', 'crispy-chicken-strips-8pc', 'Crispy golden chicken strips with dipping sauce — 8 pieces.', 749, '/images/menu/chicken-strips.webp', false, array['Strips', 'Crispy', 'Shareable', '8 Pcs'], 'medium', 20, 28),
  ('dip-sauce', 'appetizers', 'Dip Sauce', 'dip-sauce', 'House-made dipping sauce for nuggets, strips, and fries.', 69, '/images/menu/nuggets.webp', false, array['Dip', 'Sauce', 'Add-on'], 'mild', 5, 29),
  ('chunky-chicken-12pc', 'chunky-chicken', 'Chunky Chicken 12 Pieces', 'chunky-chicken-12pc', 'Twelve crispy chicken chunks with a dipping sauce.', 499, '/images/menu/chunky-chicken.webp', true, array['Chunky', 'Shareable', '12 Pcs'], 'medium', 20, 30),
  ('masala-wings', 'wings', 'Masala Wings', 'masala-wings', 'with green chutney', 449, '/images/menu/baked-wings.webp', true, array['Wings', 'Masala', 'Green Chutney'], 'hot', 22, 31),
  ('plain-baked-wings', 'wings', 'Plain Baked Wings', 'plain-baked-wings', 'plain', 449, '/images/menu/baked-wings.webp', false, array['Wings', 'Baked', 'Plain'], 'medium', 22, 32),
  ('solo-handi-deal', 'deals', 'Solo Handi Deal', 'solo-handi-deal', 'Quarter Handi (250g) + 2 Milky Naan + 1 Buddy Drink (350ml).', 649, '/images/menu/shahi-handi-clean.webp', true, array['Deal', 'Solo', 'Handi', 'Naan', 'Drink'], 'medium', 32, 35),
  ('solo-zinger-deal', 'deals', 'Solo Zinger Deal', 'solo-zinger-deal', '1 Zinger Booster + Half Golden Hot Masala Fries + 1 Drink (350ml).', 549, '/images/menu/zinger-burger.webp', true, array['Deal', 'Solo', 'Zinger', 'Fries', 'Drink'], 'hot', 22, 36),
  ('happy-family-deal', 'deals', 'Happy Family Deal', 'happy-family-deal', 'Half Velvety Shahi Handi (500g) + 8 Injected Nuggets + 12 Baked Wings + 6 Milky Naan + 1.5 Ltr Drink + Free Zinger Booster.', 2899, '/images/menu/shahi-handi-clean.webp', true, array['Deal', 'Family', 'Handi', 'Nuggets', 'Wings', 'Naan', 'Drink', 'Free Zinger'], 'medium', 48, 37),
  ('buddy-deal', 'deals', 'Buddy Deal', 'buddy-deal', '2 Zinger Boosters + Half Golden Hot Masala Fries + 2 Buddy Drinks (350ml each).', 949, '/images/menu/zinger-burger.webp', false, array['Deal', 'Two people', 'Zinger', 'Fries', 'Drinks'], 'hot', 28, 38),
  ('midnight-sharing-deal', 'deals', 'Midnight Sharing Deal', 'midnight-sharing-deal', '2 Zaiqa Wraps + 2 Buddy Drinks (350ml each). Available 11 PM to 1 AM.', 949, '/images/menu/wrap.webp', false, array['Deal', 'Midnight', 'Shareable', 'Wrap', 'Drinks'], 'medium', 24, 39),
  ('couple-deal', 'deals', 'Couple Deal', 'couple-deal', '2 Tempura Nuggets (4pc each) + 2 Injected Nuggets (3pc each) + 4 Baked Wings + Regular Salty Plain Fries (Half) + 2 Karak Doodh Patti or Drinks.', 899, '/images/menu/nuggets.webp', false, array['Deal', 'Couple', 'Nuggets', 'Wings', 'Fries', 'Tea', 'Drink'], 'medium', 30, 40),
  ('milky-naan', 'breads-drinks', 'Milky Naan', 'milky-naan', 'Soft naan for pairing with handi and karahi orders.', 50, '/images/menu/milky-naan.webp', false, array['Bread', 'Add-on', 'Naan'], 'mild', 8, 41),
  ('drink-350ml', 'breads-drinks', 'Drink (350ml)', 'drink-350ml', 'Cold soft drink in a 350ml bottle.', 80, '/images/menu/elaichi-chai.webp', false, array['Drink', 'Cold', 'Add-on'], 'mild', 2, 42),
  ('zaiqa-doodh-patti', 'tea', 'Zaiqa Doodh Patti', 'zaiqa-doodh-patti', 'Rich karak doodh patti brewed with milk and tea leaves.', 120, '/images/menu/elaichi-chai.webp', false, array['Tea', 'Doodh Patti', 'Karak', 'Hot'], 'mild', 10, 43),
  ('cardamom-tea', 'tea', 'Cardamom Tea', 'cardamom-tea', 'Warm cardamom chai for pickup or evening delivery orders.', 120, '/images/menu/elaichi-chai.webp', false, array['Tea', 'Cardamom', 'Chai', 'Hot'], 'mild', 10, 44),
  ('zaiqa-tea', 'tea', 'Zaiqa Tea', 'zaiqa-tea', 'Zaiqa special tea with a unique house blend.', 120, '/images/menu/elaichi-chai.webp', false, array['Tea', 'Special', 'Zaiqa', 'Hot'], 'mild', 10, 45),
  ('ginger-tea', 'tea', 'Ginger Tea', 'ginger-tea', 'Fresh ginger tea with a warm, spicy kick.', 120, '/images/menu/elaichi-chai.webp', false, array['Tea', 'Ginger', 'Chai', 'Hot'], 'mild', 10, 46)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  is_popular = excluded.is_popular,
  tags = excluded.tags,
  spice_level = excluded.spice_level,
  prep_time_minutes = excluded.prep_time_minutes,
  sort_order = excluded.sort_order;

insert into public.reviews (id, name, rating, quote, source, image_url, approved, created_at) values
  ('review-1', 'Areeba K.', 5, 'The Shahi Handi tasted homemade but packed like a premium order. Naan arrived soft and warm.', 'WhatsApp', '/images/menu/shahi-handi-clean.webp', true, '2026-05-29T18:45:00.000Z'),
  ('review-2', 'Hamza M.', 5, 'Zinger Booster and loaded fries were better than my usual delivery app order. Direct WhatsApp confirmation was fast.', 'Website', '/images/menu/zinger-burger.webp', true, '2026-05-31T21:10:00.000Z'),
  ('review-3', 'Nimra S.', 5, 'Family deal was enough for everyone and the gravy had that fresh kitchen flavor.', 'Foodpanda', '/images/menu/shahi-handi-clean.webp', true, '2026-06-02T20:18:00.000Z'),
  ('review-4', 'Bilal R.', 4, 'Masala fries were crisp, spicy, and still hot when delivered. Will order again.', 'Instagram', '/images/menu/masala-fries.webp', true, '2026-06-03T23:35:00.000Z')
on conflict (id) do nothing;
