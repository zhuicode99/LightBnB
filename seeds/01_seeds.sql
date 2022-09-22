INSERT INTO users (name, email, password) 
VALUES ('mcdonald', 'mc@donald.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('kfc', 'kfc@chicken.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('pizzapizza', 'pizza@pizza.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, 
  title, 
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active) 
VALUES (1, 'Super Hotel', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5166610/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
21, 3, 1, 2, 'Canada', 'Soft Ave', 'lin', 'BC', 'L4C2D3', TRUE),
(2, 'Appleby Farm', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5166710/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
22, 4, 1, 2, 'Canada', 'Milk street', 'cun', 'BC', 'L7C6J2', TRUE),
(3, 'Banana Farm', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5166810/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
23, 2, 2, 1, 'Canada', 'Cook Ave', 'van', 'BC', 'C5C2J3', FALSE);


INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-01', 1, 2),
('2021-10-01', '2021-10-14', 2, 1);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (3, 2, 1, 3, 'message'),
(2, 2, 3, 5, 'message'),
(2, 1, 2, 3, 'message');