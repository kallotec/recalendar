CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_date` text NOT NULL,
	`end_time` text NOT NULL
);
