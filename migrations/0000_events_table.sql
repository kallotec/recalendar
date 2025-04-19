CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`timezone` text NOT NULL,
	`start_datetime_utc` text NOT NULL,
	`end_datetime_utc` text NOT NULL
);
