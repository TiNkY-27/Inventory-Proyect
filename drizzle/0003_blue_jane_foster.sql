PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stock` (
	`producto_id` integer NOT NULL,
	`ubicacion_id` integer NOT NULL,
	`cantidad` integer NOT NULL,
	PRIMARY KEY(`producto_id`, `ubicacion_id`),
	FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "cantidad_positiva" CHECK("__new_stock"."cantidad" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_stock`("producto_id", "ubicacion_id", "cantidad") SELECT "producto_id", "ubicacion_id", "cantidad" FROM `stock`;--> statement-breakpoint
DROP TABLE `stock`;--> statement-breakpoint
ALTER TABLE `__new_stock` RENAME TO `stock`;--> statement-breakpoint
PRAGMA foreign_keys=ON;