
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR (80) UNIQUE NOT NULL,
	"password" VARCHAR (1000) NOT NULL,
	"phone_number" VARCHAR (12) NOT NULL
);	


CREATE TABLE "avoid_place" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (255) NOT NULL,
	"latitude" DECIMAL(8,6) NOT NULL,
	"longitude" DECIMAL (9,6) NOT NULL,
	"google_place_id" VARCHAR(255) UNIQUE
);


CREATE TABLE "user_avoidplace" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user"(id),
	"avoid_place_id" INT REFERENCES avoid_place(id),
	"visit_count" INT DEFAULT 0,
	"visit_limit" INT NOT NULL,
	"active" BOOLEAN DEFAULT TRUE,
	"created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"next_reset_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP+INTERVAL '7 days',
	"user_id_CONCAT_avoid_place_id" VARCHAR(255) UNIQUE NOT NULL,
	"currently_visiting" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user_location" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user"(id) UNIQUE NOT NULL,
	"current_latitude" DECIMAL(8,6) NOT NULL,
	"current_longitude" DECIMAL (9,6) NOT NULL
);

CREATE TABLE "messages" (
	"id" SERIAL PRIMARY KEY,
	"body" VARCHAR(1000),
	"severity" INT
);

INSERT INTO "messages" (body,severity)
VALUES
	(', enjoy',1),
	(', have a good time at',1),
	(', you are doing GREAT!! Enjoy',1 ),
	(', this is your last time at',2),
	(', you may want to think about this. It is expensive at',2),
	(', are you sure you want to go to',2),
	(', you have to stop !!!! Avoid',3),
	(', get out of there !!! Run from',3),
	(', you are spending too much, leave ',3);

 CREATE TABLE "trigger_sms" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user"(id),
	"avoid_place_id" INT REFERENCES avoid_place(id),
	"created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"message_id" INT REFERENCES messages(id)
		);