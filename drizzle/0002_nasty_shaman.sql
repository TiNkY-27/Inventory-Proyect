CREATE TABLE `stock` (
	`producto_id` integer NOT NULL,
	`ubicacion_id` integer NOT NULL,
	`cantidad` integer NOT NULL,
	PRIMARY KEY(`producto_id`, `ubicacion_id`),
	FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "cantidad_positiva" CHECK("stock"."cantidad" > 0)
);
