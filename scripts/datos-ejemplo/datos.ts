// Datos de ejemplo de una ferretería. Fijos: cada ejecución carga exactamente esto.

export const nombresNivel: [string, string, string] = ['Pasillo', 'Estantería', 'Estante'];

type Estanteria = { nombre: string; estantes: string[] };
type Pasillo = { nombre: string; estanterias: Estanteria[] };

const estantes = ['Estante 1', 'Estante 2', 'Estante 3'];

export const ubicaciones: Pasillo[] = [
	{
		nombre: 'Pasillo A',
		estanterias: [
			{ nombre: 'Estantería 1', estantes },
			{ nombre: 'Estantería 2', estantes },
			{ nombre: 'Estantería 3', estantes }
		]
	},
	{
		nombre: 'Pasillo B',
		estanterias: [
			{ nombre: 'Estantería 1', estantes },
			{ nombre: 'Estantería 2', estantes },
			{ nombre: 'Estantería 3', estantes }
		]
	}
];

// Cada entrada de stock es [ruta del estante, cantidad]; la ruta usa los nombres de arriba.
type Producto = {
	nombre: string;
	marca?: string;
	categoria: string;
	stock: [string, number][];
};

export const productos: Producto[] = [
	// Pasillo A > Estantería 1: herramientas manuales
	{
		nombre: 'Martillo carpintero 16 oz',
		marca: 'Stanley',
		categoria: 'Herramientas manuales',
		stock: [
			['Pasillo A > Estantería 1 > Estante 1', 12],
			['Pasillo A > Estantería 1 > Estante 2', 6]
		]
	},
	{
		nombre: 'Destornillador plano 6 mm',
		marca: 'Stanley',
		categoria: 'Herramientas manuales',
		stock: [['Pasillo A > Estantería 1 > Estante 2', 25]]
	},
	{
		nombre: 'Destornillador Phillips PH2',
		marca: 'Bahco',
		categoria: 'Herramientas manuales',
		stock: [
			['Pasillo A > Estantería 1 > Estante 2', 20],
			['Pasillo A > Estantería 1 > Estante 3', 10]
		]
	},
	{
		nombre: 'Pinza universal 8"',
		marca: 'Bahco',
		categoria: 'Herramientas manuales',
		stock: [['Pasillo A > Estantería 1 > Estante 3', 15]]
	},
	{
		nombre: 'Llave francesa 10"',
		marca: 'Bahco',
		categoria: 'Herramientas manuales',
		stock: [['Pasillo A > Estantería 1 > Estante 1', 8]]
	},
	{
		nombre: 'Juego de llaves Allen',
		marca: 'Tramontina',
		categoria: 'Herramientas manuales',
		stock: [['Pasillo A > Estantería 1 > Estante 3', 18]]
	},

	// Pasillo A > Estantería 2: herramientas eléctricas
	{
		nombre: 'Taladro percutor 13 mm',
		marca: 'Bosch',
		categoria: 'Herramientas eléctricas',
		stock: [['Pasillo A > Estantería 2 > Estante 1', 4]]
	},
	{
		nombre: 'Amoladora angular 115 mm',
		marca: 'Bosch',
		categoria: 'Herramientas eléctricas',
		stock: [['Pasillo A > Estantería 2 > Estante 1', 3]]
	},
	{
		nombre: 'Atornillador inalámbrico 12 V',
		marca: 'Black+Decker',
		categoria: 'Herramientas eléctricas',
		stock: [['Pasillo A > Estantería 2 > Estante 2', 5]]
	},
	{
		nombre: 'Sierra caladora',
		marca: 'Black+Decker',
		categoria: 'Herramientas eléctricas',
		stock: []
	},
	{
		nombre: 'Juego de mechas para metal',
		marca: 'Bosch',
		categoria: 'Herramientas eléctricas',
		stock: [
			['Pasillo A > Estantería 2 > Estante 3', 14],
			['Pasillo A > Estantería 3 > Estante 3', 6]
		]
	},

	// Pasillo A > Estantería 3: medición y corte
	{
		nombre: 'Cinta métrica 5 m',
		marca: 'Stanley',
		categoria: 'Medición y corte',
		stock: [
			['Pasillo A > Estantería 3 > Estante 1', 22],
			['Pasillo A > Estantería 1 > Estante 1', 5]
		]
	},
	{
		nombre: 'Nivel de burbuja 60 cm',
		marca: 'Stanley',
		categoria: 'Medición y corte',
		stock: [['Pasillo A > Estantería 3 > Estante 1', 7]]
	},
	{
		nombre: 'Serrucho 20"',
		marca: 'Tramontina',
		categoria: 'Medición y corte',
		stock: [['Pasillo A > Estantería 3 > Estante 2', 9]]
	},
	{
		nombre: 'Discos de corte 115 mm',
		marca: 'Bosch',
		categoria: 'Medición y corte',
		stock: [['Pasillo A > Estantería 3 > Estante 3', 40]]
	},

	// Pasillo B > Estantería 1: fijaciones
	{
		nombre: 'Tornillos autoperforantes 8 x 1/2" (caja 100)',
		categoria: 'Fijaciones',
		stock: [
			['Pasillo B > Estantería 1 > Estante 1', 40],
			['Pasillo B > Estantería 1 > Estante 2', 20]
		]
	},
	{
		nombre: 'Tarugos 8 mm (bolsa 100)',
		marca: 'Fischer',
		categoria: 'Fijaciones',
		stock: [['Pasillo B > Estantería 1 > Estante 1', 30]]
	},
	{
		nombre: 'Tarugos con tope 6 mm (bolsa 100)',
		marca: 'Fischer',
		categoria: 'Fijaciones',
		stock: [
			['Pasillo B > Estantería 1 > Estante 3', 50],
			['Pasillo B > Estantería 1 > Estante 1', 15]
		]
	},
	{
		nombre: 'Clavos punta París 2" (1 kg)',
		categoria: 'Fijaciones',
		stock: [['Pasillo B > Estantería 1 > Estante 2', 25]]
	},
	{
		nombre: 'Arandelas planas 1/4" (bolsa 50)',
		categoria: 'Fijaciones',
		stock: [['Pasillo B > Estantería 1 > Estante 3', 35]]
	},
	{
		nombre: 'Bulones 1/4" x 2" (bolsa 20)',
		categoria: 'Fijaciones',
		stock: []
	},

	// Pasillo B > Estantería 2: pinturas y adhesivos
	{
		nombre: 'Látex interior blanco 4 L',
		marca: 'Alba',
		categoria: 'Pinturas',
		stock: [
			['Pasillo B > Estantería 2 > Estante 1', 10],
			['Pasillo B > Estantería 2 > Estante 2', 4]
		]
	},
	{
		nombre: 'Esmalte sintético negro 1 L',
		marca: 'Alba',
		categoria: 'Pinturas',
		stock: [['Pasillo B > Estantería 2 > Estante 1', 8]]
	},
	{
		nombre: 'Rodillo de lana 22 cm',
		marca: 'El Galgo',
		categoria: 'Pinturas',
		stock: [['Pasillo B > Estantería 2 > Estante 2', 12]]
	},
	{
		nombre: 'Lija al agua grano 180',
		marca: '3M',
		categoria: 'Pinturas',
		stock: []
	},
	{
		nombre: 'Cinta de papel 24 mm',
		marca: '3M',
		categoria: 'Adhesivos',
		stock: [['Pasillo B > Estantería 2 > Estante 3', 30]]
	},
	{
		nombre: 'Adhesivo epoxi 2 componentes',
		marca: 'Poxipol',
		categoria: 'Adhesivos',
		stock: [['Pasillo B > Estantería 2 > Estante 3', 20]]
	},

	// Pasillo B > Estantería 3: electricidad y plomería
	{
		nombre: 'Cinta aisladora 20 m',
		marca: '3M',
		categoria: 'Electricidad',
		stock: [['Pasillo B > Estantería 3 > Estante 1', 40]]
	},
	{
		nombre: 'Lámpara LED 9 W',
		marca: 'Philips',
		categoria: 'Electricidad',
		stock: [
			['Pasillo B > Estantería 3 > Estante 2', 30],
			['Pasillo B > Estantería 3 > Estante 3', 10]
		]
	},
	{
		nombre: 'Cinta de teflón 3/4"',
		categoria: 'Plomería',
		stock: [['Pasillo B > Estantería 3 > Estante 2', 50]]
	}
];
