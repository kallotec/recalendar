ALTER TABLE `events` RENAME COLUMN "start_date" TO "start_date_utc";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "start_time" TO "start_time_utc";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "end_date" TO "end_date_utc";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "end_time" TO "end_time_utc";