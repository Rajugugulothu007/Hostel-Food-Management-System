CREATE TABLE menu_item (
    id VARCHAR(20) PRIMARY KEY,
    item_name VARCHAR(200) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    quantity VARCHAR(100),
    dietary_tags VARCHAR(100),
    allergens VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

INSERT INTO menu_item (id, item_name, meal_type, quantity, dietary_tags, allergens, active) VALUES
    ('MEAL001', 'Idli + Sambar + Coconut Chutney',   'BREAKFAST', '4 pcs + 150ml + 50ml', 'veg,gluten-free', '',        TRUE),
    ('MEAL002', 'Upma + Coconut Chutney',             'BREAKFAST', '300g + 50ml',          'veg',             '',        TRUE),
    ('MEAL003', 'Masala Dosa + Sambar + Chutney',     'BREAKFAST', '2 pcs + 150ml + 50ml', 'veg',             '',        TRUE),
    ('MEAL004', 'Poha',                                'BREAKFAST', '300g',                 'veg,gluten-free', '',        TRUE),
    ('MEAL005', 'Aloo Paratha + Curd + Pickle',       'BREAKFAST', '2 pcs + 100g + 20g',   'veg,dairy',       'gluten',  TRUE),
    ('MEAL006', 'Puri + Aloo Sabzi',                  'BREAKFAST', '4 pcs + 200g',         'veg',             'gluten',  TRUE),
    ('MEAL007', 'Vegetable Uttapam + Chutney',        'BREAKFAST', '2 pcs + 50ml',         'veg',             '',        TRUE),
    ('MEAL008', 'Bread Omelette / Bread Jam',         'BREAKFAST', '2 slices + 2 eggs',    'veg-option',      'gluten,egg', TRUE),
    ('MEAL009', 'Rava Kesari + Chana Masala',         'BREAKFAST', '150g + 150g',          'veg',             '',        TRUE),
    ('MEAL010', 'Idiyappam + Vegetable Kurma',        'BREAKFAST', '200g + 150g',          'veg',             '',        TRUE),

    ('MEAL011', 'Steamed Rice + Sambar + Rasam + Poriyal', 'LUNCH', '250g + 150ml + 100ml + 100g', 'veg', '', TRUE),
    ('MEAL012', 'Chapati (4) + Dal Tadka + Mixed Veg',     'LUNCH', '4 pcs + 150ml + 150g',        'veg', 'gluten', TRUE),
    ('MEAL013', 'Veg Biryani + Raita + Salan',             'LUNCH', '300g + 100ml + 100ml',        'veg', '', TRUE),

    ('MEAL021', 'Chapati (4) + Dal Fry + Aloo Gobi', 'DINNER', '4 pcs + 150ml + 150g', 'veg', 'gluten', TRUE),
    ('MEAL022', 'Veg Fried Rice + Manchurian',        'DINNER', '300g + 4 pcs',         'veg', '', TRUE),
    ('MEAL023', 'Curd Rice + Vegetable Kootu',        'DINNER', '300g + 100g',          'veg,dairy', '', TRUE);