CREATE TABLE IF NOT EXISTS product
(
    product_id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(50) NOT NULL,
    brand varchar(50) NOT NULL,
    category varchar(50) NOT NULL,
    description varchar(255) NOT NULL,
    price integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review
(
    review_id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    comment varchar(255) NOT NULL,
    rate integer,
    product_id integer REFERENCES product,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS image
(
    image_id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    image_url varchar(2083) NOT NULL,
    product_id integer REFERENCES product
);

-- CREATE TABLE IF NOT EXISTS category
-- (
--     category_id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY
--     category_name varchar(50) NOT NULL,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );