USE cafeos;

-- =====================
-- TABLES (Meja 1 - 10)
-- =====================
INSERT INTO tables (table_number, status, capacity) VALUES
(1, 'available', 4),
(2, 'available', 4),
(3, 'available', 2),
(4, 'available', 6),
(5, 'available', 4),
(6, 'available', 2),
(7, 'available', 8),
(8, 'available', 4),
(9, 'available', 4),
(10, 'available', 6);

-- =============================================
-- MENU ITEMS
-- =============================================

-- 1. Coffee - Espresso Based
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('esp-001', 'coffee-espresso', 'Espresso',           'Single shot espresso dengan crema sempurna',                    18000, 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop', 1, 0),
('esp-002', 'coffee-espresso', 'Americano',           'Espresso dengan air panas, rasa bold dan clean',               22000, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&h=400&fit=crop', 1, 0),
('esp-003', 'coffee-espresso', 'Cappuccino',          'Espresso, steamed milk & foam lembut dengan latte art',        28000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 1, 1),
('esp-004', 'coffee-espresso', 'Café Latte',          'Espresso dengan susu steamed creamy, favorit sepanjang masa',  28000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 1, 1),
('esp-005', 'coffee-espresso', 'Mocha',               'Perpaduan espresso, cokelat premium & susu steamed',           32000, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop', 1, 0),
('esp-006', 'coffee-espresso', 'Caramel Macchiato',   'Vanilla, susu steamed, espresso & drizzle karamel',            32000, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', 1, 1),
('esp-007', 'coffee-espresso', 'Affogato',            'Scoop vanilla gelato disiram espresso panas',                  35000, 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=400&h=400&fit=crop', 1, 0),
('esp-008', 'coffee-espresso', 'Iced Spanish Latte',  'Espresso, susu kental manis & susu segar di atas es',          30000, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop', 1, 1);

-- 2. Manual Brew
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('mb-001', 'manual-brew', 'V60 Pour Over',    'Single origin diseduh manual dengan V60, rasa jernih & fruity',    30000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 1, 1),
('mb-002', 'manual-brew', 'Chemex',            'Brew bersih & bright dengan filter tebal Chemex',                  32000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop', 1, 0),
('mb-003', 'manual-brew', 'French Press',      'Full-bodied coffee dengan metode immersion klasik',                28000, 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=400&fit=crop', 1, 0),
('mb-004', 'manual-brew', 'Aeropress',         'Smooth & versatile, metode brew modern favorit barista',           28000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop', 1, 0),
('mb-005', 'manual-brew', 'Cold Brew',         'Diseduh dingin 18 jam, rasa smooth tanpa pahit',                   28000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 1, 1),
('mb-006', 'manual-brew', 'Kopi Tubruk',       'Kopi tradisional Indonesia, diseduh langsung dalam gelas',         15000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop', 1, 0);

-- 3. Non Coffee
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('nc-001', 'non-coffee', 'Matcha Latte',       'Uji matcha premium dari Jepang dengan susu steamed',              30000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop', 1, 1),
('nc-002', 'non-coffee', 'Hot Chocolate',      'Cokelat Belgia premium dengan susu creamy',                        28000, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop', 1, 0),
('nc-003', 'non-coffee', 'Taro Latte',         'Ubi ungu alami blend dengan susu, creamy & manis lembut',          28000, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop', 1, 0),
('nc-004', 'non-coffee', 'Red Velvet Latte',   'Red velvet cream cheese dengan susu steamed',                      30000, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', 1, 0),
('nc-005', 'non-coffee', 'Thai Tea',           'Teh Thailand klasik dengan susu kental manis',                     25000, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 1, 1),
('nc-006', 'non-coffee', 'Lemon Tea',          'Teh hitam segar dengan perasan lemon & madu',                      20000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', 1, 0);

-- 4. Mocktail & Juice
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('mj-001', 'mocktail-juice', 'Lemon Squash',       'Perasan lemon segar dengan soda & simple syrup',               22000, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', 1, 0),
('mj-002', 'mocktail-juice', 'Mango Smoothie',     'Mangga matang di-blend dengan yogurt & madu',                   28000, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop', 1, 1),
('mj-003', 'mocktail-juice', 'Berry Blast',        'Mix berry segar: strawberry, blueberry, raspberry',             30000, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop', 1, 0),
('mj-004', 'mocktail-juice', 'Virgin Mojito',      'Lime, mint segar & soda, refreshing tanpa alkohol',             25000, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop', 1, 1),
('mj-005', 'mocktail-juice', 'Orange Juice',       'Jeruk segar diperas langsung, kaya vitamin C',                  22000, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', 1, 0),
('mj-006', 'mocktail-juice', 'Tropical Sunset',    'Mangga, passion fruit & nanas, rasa tropis segar',              30000, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', 1, 0);

-- 5. Pastry & Bakery
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('pb-001', 'pastry-bakery', 'Butter Croissant',     'Croissant renyah berlapis mentega Perancis premium',            25000, 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=400&fit=crop', 1, 1),
('pb-002', 'pastry-bakery', 'Banana Bread',         'Roti pisang homemade, lembut & harum kayu manis',               22000, 'https://images.unsplash.com/photo-1605090930601-312b2b6d6240?w=400&h=400&fit=crop', 1, 0),
('pb-003', 'pastry-bakery', 'Double Choco Brownies','Brownies cokelat tebal, fudgy & decadent',                      28000, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', 1, 1),
('pb-004', 'pastry-bakery', 'Cheesecake',           'New York cheesecake creamy dengan berry compote',                35000, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=400&fit=crop', 1, 0),
('pb-005', 'pastry-bakery', 'Cinnamon Roll',        'Roti gulung kayu manis dengan cream cheese glaze',              25000, 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', 1, 0),
('pb-006', 'pastry-bakery', 'Tiramisu',             'Ladyfinger, espresso & mascarpone cream berlapis',              38000, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', 1, 1);

-- 6. Main Course
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('mc-001', 'main-course', 'Nasi Goreng Spesial',       'Nasi goreng dengan telur, ayam, kerupuk & acar',             35000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', 1, 1),
('mc-002', 'main-course', 'Chicken Katsu Rice',        'Ayam katsu crispy dengan nasi Jepang & salad',               42000, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop', 1, 1),
('mc-003', 'main-course', 'Spaghetti Aglio Olio',     'Pasta dengan bawang putih, cabai & olive oil',                38000, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop', 1, 0),
('mc-004', 'main-course', 'Club Sandwich',             'Triple decker: ayam, telur, bacon, selada & tomat',           38000, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', 1, 0),
('mc-005', 'main-course', 'Beef Burger',               'Wagyu patty, cheddar, selada, tomat & special sauce',         45000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 1, 1),
('mc-006', 'main-course', 'Chicken Quesadilla',        'Tortilla crispy berisi ayam, keju & salsa',                   35000, 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=400&fit=crop', 1, 0);

-- 7. Snacks
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('sn-001', 'snacks', 'French Fries',        'Kentang goreng crispy dengan saus pilihan',                      22000, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', 1, 0),
('sn-002', 'snacks', 'Chicken Wings',       '6 pcs sayap ayam crispy, pilih saus: BBQ / buffalo / honey',     35000, 'https://images.unsplash.com/photo-1608039829572-9b0189e0d161?w=400&h=400&fit=crop', 1, 1),
('sn-003', 'snacks', 'Nachos Grande',       'Tortilla chips dengan keju, salsa, guacamole & sour cream',      32000, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop', 1, 0),
('sn-004', 'snacks', 'Roti Bakar',          'Roti bakar dengan selai cokelat-keju atau strawberry',            18000, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop', 1, 0),
('sn-005', 'snacks', 'Pisang Goreng Keju',  'Pisang goreng crispy tabur keju & susu kental manis',             20000, 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&h=400&fit=crop', 1, 0),
('sn-006', 'snacks', 'Dimsum Platter',      'Aneka dimsum: siomay, hakau & lumpia udang (6 pcs)',              35000, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop', 1, 1);
