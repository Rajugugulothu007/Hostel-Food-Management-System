-- ═══════════════════════════════════════════════════════════════
-- LUNCH — add 7 more items (MEAL014 through MEAL020)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO menu_item (id, item_name, meal_type, quantity, dietary_tags, allergens, active) VALUES
    ('MEAL014', 'Curd Rice + Pickle + Papad',       'LUNCH', '300g + 20g + 2 pcs', 'veg,dairy',   '',        TRUE),
    ('MEAL015', 'Rajma + Rice + Salad',              'LUNCH', '150g + 250g + 50g',  'veg',         '',        TRUE),
    ('MEAL016', 'Chole + Bhature (2 pcs)',           'LUNCH', '200g + 2 pcs',       'veg',         'gluten',  TRUE),
    ('MEAL017', 'Sambar Rice + Appalam + Curd',      'LUNCH', '300g + 2 pcs + 100g','veg,dairy',   '',        TRUE),
    ('MEAL018', 'Paneer Butter Masala + Chapati (4)','LUNCH', '150g + 4 pcs',       'veg,dairy',   'gluten',  TRUE),
    ('MEAL019', 'Lemon Rice + Vegetable Kurma',      'LUNCH', '250g + 150g',        'veg',         '',        TRUE),
    ('MEAL020', 'Veg Pulao + Boondi Raita',          'LUNCH', '300g + 100ml',       'veg,dairy',   '',        TRUE);

-- ═══════════════════════════════════════════════════════════════
-- DINNER — update MEAL023 + add 7 more items (MEAL024 through MEAL030)
-- ═══════════════════════════════════════════════════════════════

-- Fix MEAL023: was "Curd Rice + Vegetable Kootu" → "Pav Bhaji"
UPDATE menu_item
SET item_name = 'Pav Bhaji',
    quantity = '2 pavs + 200g bhaji'
WHERE id = 'MEAL023';

INSERT INTO menu_item (id, item_name, meal_type, quantity, dietary_tags, allergens, active) VALUES
    ('MEAL024', 'Roti (4) + Palak Paneer',           'DINNER', '4 pcs + 150g',       'veg,dairy',   'gluten',  TRUE),
    ('MEAL025', 'Khichdi + Papad + Ghee',            'DINNER', '300g + 2 pcs + 10g', 'veg,dairy',   '',        TRUE),
    ('MEAL026', 'Veg Noodles + Gobi Manchurian',     'DINNER', '250g + 100g',        'veg',         'gluten',  TRUE),
    ('MEAL027', 'Chapati (4) + Chana Masala',        'DINNER', '4 pcs + 150g',       'veg',         'gluten',  TRUE),
    ('MEAL028', 'Tomato Rice + Vadam (fried papad)', 'DINNER', '250g + 2 pcs',       'veg',         '',        TRUE),
    ('MEAL029', 'Veg Pongal + Sambar + Chutney',     'DINNER', '300g + 100ml + 50ml','veg',         '',        TRUE),
    ('MEAL030', 'Roti (4) + Mixed Dal + Bhindi Fry', 'DINNER', '4 pcs + 150ml + 100g','veg',        'gluten',  TRUE);