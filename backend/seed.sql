USE cafeos;

-- Clear existing data (in correct order)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;
DELETE FROM categories;
DELETE FROM tables;
DELETE FROM users;

-- 1. Seed Tables (Meja 1-10)
INSERT INTO tables (id, table_number, capacity, status) VALUES
(1, 1, 4, 'available'),
(2, 2, 4, 'available'),
(3, 3, 6, 'available'),
(4, 4, 4, 'available'),
(5, 5, 4, 'available'),
(6, 6, 6, 'available'),
(7, 7, 4, 'available'),
(8, 8, 4, 'available'),
(9, 9, 2, 'available'),
(10, 10, 2, 'available');

-- 2. Seed Categories
INSERT INTO categories (id, name, description) VALUES
('cat-1', 'Makanan', 'Hidangan utama yang lezat dan mengenyangkan'),
('cat-2', 'Minuman', 'Berbagai pilihan minuman segar dingin dan hangat'),
('cat-3', 'Camilan', 'Kudapan ringan untuk menemani santai Anda'),
('cat-4', 'Dessert', 'Pencuci mulut manis sebagai penutup hidangan');

-- 3. Seed Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES
('item-1', 'cat-1', 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam suwir, dan sambal spesial chef.', 35000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', 1, 1),
('item-2', 'cat-1', 'Mie Ayam Bakso', 'Mie ayam segar dengan bakso sapi jumbo dan kuah kaldu gurih.', 30000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', 1, 0),
('item-3', 'cat-1', 'Ayam Bakar Madu', 'Ayam bakar dengan bumbu madu dan rempah pilihan, disajikan dengan lalapan.', 45000, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80', 1, 1),
('item-4', 'cat-1', 'Pasta Carbonara', 'Pasta creamy dengan saus carbonara autentik, bacon, dan parmesan.', 48000, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80', 0, 0),
('item-5', 'cat-2', 'Kopi Susu Gula Aren', 'Espresso double shot dengan susu segar dan gula aren asli.', 28000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', 1, 1),
('item-6', 'cat-2', 'Matcha Latte', 'Matcha premium Jepang dengan steamed milk yang creamy.', 32000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80', 1, 0),
('item-7', 'cat-2', 'Jus Alpukat', 'Jus alpukat segar dengan susu kental manis dan es batu.', 25000, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&q=80', 1, 0),
('item-8', 'cat-2', 'Es Teh Manis', 'Teh hitam dingin dengan gula aren, segar dan menyegarkan.', 12000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', 1, 0),
('item-9', 'cat-3', 'Kentang Goreng', 'Kentang goreng crispy dengan bumbu tabur keju dan mayo dip.', 22000, 'https://images.unsplash.com/photo-1576107232684-1279f8be9d38?w=400&q=80', 1, 0),
('item-10', 'cat-3', 'Roti Bakar Coklat', 'Roti bakar tebal dengan selai coklat Nutella dan taburan keju.', 18000, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80', 1, 0),
('item-11', 'cat-4', 'Pisang Bakar Keju', 'Pisang kepok bakar dengan lelehan keju mozzarella dan saus coklat.', 20000, 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&q=80', 1, 0),
('item-12', 'cat-4', 'Es Krim Vanilla', '2 scoop es krim vanilla premium dengan topping sprinkle dan waffle.', 25000, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', 1, 0);

-- 4. Seed Users (Bcrypt hash for password 'admin123' and '123456')
-- admin password: admin123
-- kitchen PIN:    123456
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$Uz0Zzah0Z/4pnn4bbqVnNey2cL54T8T2Qp9K8Qz7HNZ6FTlI1zn0S', 'admin'),
('kitchen', '$2a$10$JicgOagwEZW7smE3Dl3Z9uD9TBEFfInCELWPV/ByCtEHv0bPliYMu', 'kitchen');
