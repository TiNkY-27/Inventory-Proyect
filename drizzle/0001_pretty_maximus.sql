CREATE TABLE `nombres_nivel` (
	`nivel` integer PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ubicaciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`nivel` integer NOT NULL,
	`padre_id` integer,
	FOREIGN KEY (`padre_id`) REFERENCES `ubicaciones`(`id`) ON UPDATE no action ON DELETE no action
);
