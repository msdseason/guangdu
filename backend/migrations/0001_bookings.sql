CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`slot` text NOT NULL,
	`name` text NOT NULL,
	`mode` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_slot_unique` ON `bookings` (`slot`);