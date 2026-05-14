/**
 * Recetario Salsa AMBROSIA — 20 recetas firmadas
 * Fuente: bma monterrey/recetario_salsa_ambrosia_20_recetas.md
 *
 * Imagenes:
 *   web/public/recetas/<slug>.webp        (800×800, card del grid)
 *   web/public/recetas/<slug>-hero.webp   (1600×1000, hero del detalle)
 * Generadas por scripts/optimize-recetas.mjs desde los PNGs originales.
 * Las recetas se muestran en /recetario y /recetario/[slug].
 */

export type Categoria =
  | 'desayunos'
  | 'entradas'
  | 'pescados'
  | 'carnes'
  | 'vegetales'
  | 'bases';

export interface CategoriaInfo {
  key: Categoria;
  label_es: string;
  label_en: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { key: 'desayunos', label_es: 'Desayunos',         label_en: 'Breakfast' },
  { key: 'entradas',  label_es: 'Entradas',          label_en: 'Starters' },
  { key: 'pescados',  label_es: 'Pescados y mariscos', label_en: 'Fish & seafood' },
  { key: 'carnes',    label_es: 'Carnes',            label_en: 'Meats' },
  { key: 'vegetales', label_es: 'Vegetales y quesos', label_en: 'Vegetables & cheese' },
  { key: 'bases',     label_es: 'Bases y derivados', label_en: 'Bases & derivatives' },
];

export interface Receta {
  /** kebab-case slug, usado en /recetario/[slug] y nombre del PNG */
  slug: string;
  /** numero 01..20 dentro del recetario */
  numero: string;
  titulo: string;
  categoria: Categoria;
  /** ej. "10 min", "1 h 15 min" */
  tiempo: string;
  /** porciones (string para soportar "250 g", "150 ml") */
  rinde: string;
  ingredientes: string[];
  procedimiento: string[];
  /** ruta absoluta dentro de public/ */
  imagen: string;
  /** notas o sugerencias breves (opcional) */
  nota?: string;
}

export const recetas: Receta[] = [
  // ─── I · Desayunos y huevos ───
  {
    slug: 'huevos-al-sarten',
    numero: '01',
    titulo: 'Huevos al sarten con AMBROSIA',
    categoria: 'desayunos',
    tiempo: '10 min',
    rinde: '4 personas',
    ingredientes: [
      '8 huevos',
      '30 g de mantequilla',
      'Sal de mar',
      '1 cucharadita de AMBROSIA por huevo',
      'Pan rustico tostado, para acompanar',
    ],
    procedimiento: [
      'Cocer los huevos en mantequilla noisette a fuego bajo hasta que la clara cuaje y la yema quede liquida.',
      'Servir directo del sarten con una gota de AMBROSIA sobre cada yema y pan rustico tostado al lado.',
    ],
    imagen: '/recetas/huevos-al-sarten.webp',
  },
  {
    slug: 'tostada-aguacate-burrata',
    numero: '02',
    titulo: 'Tostada de aguacate y burrata con AMBROSIA',
    categoria: 'desayunos',
    tiempo: '8 min',
    rinde: '2 personas',
    ingredientes: [
      '2 rebanadas de pan de masa madre',
      '1 aguacate',
      '100 g de burrata',
      'Ralladura de limon amarillo',
      'Aceite de oliva',
      '½ cucharadita de AMBROSIA por tostada',
      'Sal al gusto',
    ],
    procedimiento: [
      'Tostar el pan.',
      'Untar el aguacate machacado con sal y limon.',
      'Abrir la burrata encima.',
      'Terminar con un hilo de aceite de oliva, ralladura de limon amarillo y la salsa en gotas.',
    ],
    imagen: '/recetas/tostada-aguacate-burrata.webp',
  },
  {
    slug: 'chilaquiles-rojos',
    numero: '03',
    titulo: 'Chilaquiles rojos elevados',
    categoria: 'desayunos',
    tiempo: '25 min',
    rinde: '4 personas',
    ingredientes: [
      '250 g de totopos de maiz nixtamalizado',
      '4 jitomates asados',
      '1 chile guajillo',
      'Ajo',
      'Cebolla',
      '4 huevos estrellados',
      'Queso fresco',
      '2 cucharaditas de AMBROSIA',
    ],
    procedimiento: [
      'Preparar una salsa de jitomate y guajillo recien hecha.',
      'Salsear los totopos, colocar los huevos estrellados encima.',
      'Agregar queso fresco desmoronado y rematar con AMBROSIA justo antes de servir.',
    ],
    imagen: '/recetas/chilaquiles-rojos.webp',
  },

  // ─── II · Entradas y botanas ───
  {
    slug: 'tuetano-asado',
    numero: '04',
    titulo: 'Tuetano asado con sal Maldon y AMBROSIA',
    categoria: 'entradas',
    tiempo: '30 min',
    rinde: '2 personas',
    ingredientes: [
      '4 huesos de tuetano partidos a lo largo',
      'Sal Maldon',
      'Perejil picado',
      'Pan tostado',
      '1 cucharadita de AMBROSIA por hueso',
    ],
    procedimiento: [
      'Hornear el tuetano a 220 °C durante 15 a 20 minutos, hasta que dore.',
      'Servir con pan tostado, perejil y AMBROSIA aparte para que cada comensal dosifique la salsa.',
    ],
    imagen: '/recetas/tuetano-asado.webp',
  },
  {
    slug: 'aguachile-rojo',
    numero: '05',
    titulo: 'Aguachile rojo de camaron',
    categoria: 'entradas',
    tiempo: '20 min',
    rinde: '4 personas',
    ingredientes: [
      '400 g de camaron limpio',
      'Jugo de 6 limones',
      '½ pepino',
      '¼ de cebolla morada',
      'Cilantro',
      '1 cucharada de AMBROSIA',
      'Tostadas, para acompanar',
    ],
    procedimiento: [
      'Curar el camaron en limon durante 5 minutos.',
      'Mezclar con pepino, cebolla morada, cilantro y AMBROSIA.',
      'Servir frio con tostadas.',
    ],
    nota: 'La AMBROSIA sustituye al chile fresco y aporta profundidad ahumada.',
    imagen: '/recetas/aguachile-rojo.webp',
  },
  {
    slug: 'carpaccio-de-res',
    numero: '06',
    titulo: 'Carpaccio de res con AMBROSIA y parmesano',
    categoria: 'entradas',
    tiempo: '15 min',
    rinde: '4 personas',
    ingredientes: [
      '200 g de filete laminado fino',
      'Alcaparras',
      'Arugula',
      'Parmesano en lascas',
      'Aceite de oliva',
      'Jugo de limon',
      '½ cucharadita de AMBROSIA',
    ],
    procedimiento: [
      'Acomodar el carpaccio sobre un plato frio.',
      'Distribuir arugula, alcaparras y parmesano.',
      'Anadir aceite de oliva, limon y terminar con gotas de AMBROSIA siguiendo el circulo del plato.',
    ],
    imagen: '/recetas/carpaccio-de-res.webp',
  },
  {
    slug: 'esquites-cremosos',
    numero: '07',
    titulo: 'Esquites cremosos con AMBROSIA',
    categoria: 'entradas',
    tiempo: '20 min',
    rinde: '4 personas',
    ingredientes: [
      '4 elotes desgranados',
      'Mayonesa',
      'Queso cotija',
      'Jugo de limon',
      'Epazote',
      '1 cucharadita de AMBROSIA por taza',
    ],
    procedimiento: [
      'Saltear los granos de elote hasta dorar.',
      'Mezclar con mayonesa, queso cotija, limon y epazote.',
      'Servir caliente y coronar con AMBROSIA.',
    ],
    imagen: '/recetas/esquites-cremosos.webp',
  },

  // ─── III · Pescados y mariscos ───
  {
    slug: 'pescado-a-la-sal',
    numero: '08',
    titulo: 'Pescado a la sal con AMBROSIA',
    categoria: 'pescados',
    tiempo: '45 min',
    rinde: '4 personas',
    ingredientes: [
      '1 huachinango entero de 1.2 kg',
      '2 kg de sal gruesa',
      '2 claras de huevo',
      'Romero',
      'Limon',
      '2 cucharaditas de AMBROSIA',
    ],
    procedimiento: [
      'Cubrir el pescado con la mezcla de sal gruesa y claras.',
      'Hornear a 200 °C durante 30 minutos.',
      'Romper la costra en mesa y servir con limon y AMBROSIA aparte.',
    ],
    nota: 'Idealmente en cuchara de plata o hueso.',
    imagen: '/recetas/pescado-a-la-sal.webp',
  },
  {
    slug: 'pulpo-a-las-brasas',
    numero: '09',
    titulo: 'Pulpo a las brasas con AMBROSIA',
    categoria: 'pescados',
    tiempo: '1 h 30 min',
    rinde: '4 personas',
    ingredientes: [
      '1 pulpo de 1.5 kg cocido',
      'Aceite de oliva',
      'Pimenton ahumado',
      'Papas cambray',
      '1 cucharada de AMBROSIA',
    ],
    procedimiento: [
      'Asar los tentaculos cocidos hasta que queden marcados.',
      'Acompanar con papas cambray.',
      'Rociar con aceite de oliva, pimenton ahumado y gotas de AMBROSIA.',
    ],
    imagen: '/recetas/pulpo-a-las-brasas.webp',
  },
  {
    slug: 'tartar-de-atun',
    numero: '10',
    titulo: 'Tartar de atun con AMBROSIA y aguacate',
    categoria: 'pescados',
    tiempo: '15 min',
    rinde: '2 personas',
    ingredientes: [
      '200 g de atun calidad sashimi',
      '1 aguacate',
      '1 cucharadita de aceite de ajonjoli',
      'Cebollin',
      'Jugo de limon',
      '½ cucharadita de AMBROSIA',
    ],
    procedimiento: [
      'Cortar el atun en cubos pequenos y mezclar con aceite de ajonjoli, cebollin, limon y AMBROSIA.',
      'Moldear en aro sobre una cama de aguacate machacado.',
    ],
    nota: 'La AMBROSIA reemplaza al sriracha.',
    imagen: '/recetas/tartar-de-atun.webp',
  },

  // ─── IV · Carnes ───
  {
    slug: 'cordero-al-horno',
    numero: '11',
    titulo: 'Cordero al horno con costra de hierbas y AMBROSIA',
    categoria: 'carnes',
    tiempo: '3 h',
    rinde: '6 personas',
    ingredientes: [
      '1 paletilla de cordero de 2 kg',
      'Romero',
      'Tomillo',
      'Ajo',
      'Vino tinto',
      '2 cucharadas de AMBROSIA para glasear al final',
    ],
    procedimiento: [
      'Marinar el cordero con hierbas, ajo y vino tinto.',
      'Hornear cubierto a 160 °C durante 2.5 horas.',
      'Retirar la cubierta, pintar con AMBROSIA mezclada con su jugo y dorar 20 minutos mas.',
    ],
    imagen: '/recetas/cordero-al-horno.webp',
  },
  {
    slug: 'costilla-de-res',
    numero: '12',
    titulo: 'Costilla de res estilo AMBROSIA',
    categoria: 'carnes',
    tiempo: '4 h',
    rinde: '6 personas',
    ingredientes: [
      '2 kg de costilla short rib',
      'Vino tinto',
      'Cebolla',
      'Zanahoria',
      'Ajo',
      'Caldo',
      '3 cucharadas de AMBROSIA',
    ],
    procedimiento: [
      'Sellar la costilla.',
      'Deglasear con vino tinto, agregar verduras, caldo y AMBROSIA.',
      'Cocinar lentamente durante 3.5 horas a 150 °C.',
    ],
    nota: 'La AMBROSIA actua como umami y profundidad de sabor.',
    imagen: '/recetas/costilla-de-res.webp',
  },
  {
    slug: 'tacos-de-cochinita',
    numero: '13',
    titulo: 'Tacos de cochinita con AMBROSIA',
    categoria: 'carnes',
    tiempo: '4 h + una noche de marinado',
    rinde: '6 personas',
    ingredientes: [
      '1.5 kg de pierna de cerdo',
      'Achiote',
      'Jugo de naranja',
      'Vinagre',
      'Cebolla morada curtida',
      'Tortillas de maiz',
      'AMBROSIA al gusto',
    ],
    procedimiento: [
      'Marinar la pierna de cerdo con achiote, jugo de naranja y vinagre durante una noche.',
      'Hornear envuelta en hoja de platano durante 3 horas.',
      'Servir desmenuzada en tacos con cebolla morada y AMBROSIA como sustituto refinado del habanero.',
    ],
    imagen: '/recetas/tacos-de-cochinita.webp',
  },
  {
    slug: 'pollo-asado',
    numero: '14',
    titulo: 'Pollo asado con mantequilla de AMBROSIA',
    categoria: 'carnes',
    tiempo: '1 h 15 min',
    rinde: '4 personas',
    ingredientes: [
      '1 pollo entero de 1.6 kg',
      '80 g de mantequilla',
      '2 cucharaditas de AMBROSIA',
      'Ajo',
      'Romero',
      'Sal',
    ],
    procedimiento: [
      'Mezclar la mantequilla con AMBROSIA, ajo, romero y sal.',
      'Colocar la mantequilla bajo la piel del pollo.',
      'Hornear a 200 °C durante 1 hora, banando con su jugo cada 15 minutos.',
    ],
    imagen: '/recetas/pollo-asado.webp',
  },
  {
    slug: 'hamburguesa-queso-azul',
    numero: '15',
    titulo: 'Hamburguesa con queso azul y AMBROSIA',
    categoria: 'carnes',
    tiempo: '25 min',
    rinde: '4 personas',
    ingredientes: [
      '600 g de carne molida 80/20',
      '100 g de queso azul',
      '4 panes brioche',
      'Cebolla caramelizada',
      'Arugula',
      '1 cucharadita de AMBROSIA por hamburguesa',
    ],
    procedimiento: [
      'Sellar las hamburguesas dejandolas ligeramente rosadas.',
      'Montar con queso azul, cebolla caramelizada, arugula y AMBROSIA untada en la tapa superior del pan.',
    ],
    imagen: '/recetas/hamburguesa-queso-azul.webp',
  },

  // ─── V · Vegetales y quesos ───
  {
    slug: 'coliflor-asada',
    numero: '16',
    titulo: 'Coliflor entera asada con AMBROSIA',
    categoria: 'vegetales',
    tiempo: '1 h',
    rinde: '4 personas',
    ingredientes: [
      '1 coliflor entera',
      'Aceite de oliva',
      'Sal',
      'Curcuma',
      '1 cucharada de AMBROSIA',
      'Yogur griego para acompanar',
    ],
    procedimiento: [
      'Hervir la coliflor durante 8 minutos.',
      'Secarla, untarla con aceite de oliva, sal y curcuma.',
      'Asar a 200 °C durante 40 minutos.',
      'Servir entera con yogur griego y AMBROSIA al lado.',
    ],
    imagen: '/recetas/coliflor-asada.webp',
  },
  {
    slug: 'tabla-de-quesos',
    numero: '17',
    titulo: 'Tabla de quesos anejos con AMBROSIA',
    categoria: 'vegetales',
    tiempo: '5 min',
    rinde: '4 personas',
    ingredientes: [
      '200 g de manchego curado',
      '150 g de gorgonzola',
      '150 g de comte',
      'Pan rustico',
      'Nueces tostadas',
      'Miel',
      'AMBROSIA aparte',
    ],
    procedimiento: [
      'Montar los quesos, pan rustico, nueces y miel en una tabla.',
      'Servir AMBROSIA aparte como reemplazo del chutney.',
    ],
    nota: 'Funciona especialmente bien con quesos azules y quesos de pasta dura.',
    imagen: '/recetas/tabla-de-quesos.webp',
  },
  {
    slug: 'risotto-de-hongos',
    numero: '18',
    titulo: 'Risotto de hongos con AMBROSIA',
    categoria: 'vegetales',
    tiempo: '35 min',
    rinde: '4 personas',
    ingredientes: [
      '320 g de arroz arborio',
      '300 g de hongos mixtos',
      'Caldo de pollo',
      'Vino blanco',
      'Cebolla',
      'Parmesano',
      'Mantequilla',
      '1 cucharadita de AMBROSIA al final',
    ],
    procedimiento: [
      'Preparar un risotto clasico con cebolla, vino blanco, caldo, hongos y arroz arborio.',
      'Al apagar el fuego, incorporar mantequilla, parmesano y AMBROSIA.',
      'Reposar 2 minutos antes de servir.',
    ],
    imagen: '/recetas/risotto-de-hongos.webp',
  },

  // ─── VI · Bases y derivados ───
  {
    slug: 'mayonesa-de-ambrosia',
    numero: '19',
    titulo: 'Mayonesa de AMBROSIA',
    categoria: 'bases',
    tiempo: '5 min',
    rinde: '250 g',
    ingredientes: [
      '1 yema',
      '200 ml de aceite neutro',
      '1 cucharadita de mostaza Dijon',
      'Jugo de ½ limon',
      'Sal',
      '2 cucharaditas de AMBROSIA',
    ],
    procedimiento: [
      'Emulsionar todos los ingredientes en un frasco con licuadora de inmersion.',
    ],
    nota: 'Usar para sandwiches, papas, mariscos frios y crudites.',
    imagen: '/recetas/mayonesa-de-ambrosia.webp',
  },
  {
    slug: 'vinagreta-de-ambrosia',
    numero: '20',
    titulo: 'Vinagreta de AMBROSIA para ensaladas robustas',
    categoria: 'bases',
    tiempo: '3 min',
    rinde: '150 ml',
    ingredientes: [
      '90 ml de aceite de oliva extra virgen',
      '30 ml de vinagre de Jerez',
      '1 cucharadita de miel',
      '1 cucharadita de mostaza',
      '½ cucharadita de AMBROSIA',
      'Sal',
    ],
    procedimiento: [
      'Agitar todos los ingredientes en un frasco hasta integrar.',
    ],
    nota: 'Ideal para ensaladas con betabel asado, queso de cabra, jamon serrano o pera.',
    imagen: '/recetas/vinagreta-de-ambrosia.webp',
  },
];

/**
 * Devuelve las recetas destacadas (3 platos para RecipeTeaser en home).
 */
export function recetasDestacadas(): Receta[] {
  // Una de cada tipo de uso: desayuno, carne, vegetal — para mostrar versatilidad.
  return [
    recetas.find((r) => r.slug === 'huevos-al-sarten')!,
    recetas.find((r) => r.slug === 'cordero-al-horno')!,
    recetas.find((r) => r.slug === 'risotto-de-hongos')!,
  ];
}

/**
 * Recetas agrupadas por categoria — para /recetario index.
 */
export function recetasPorCategoria(): Record<Categoria, Receta[]> {
  const out: Record<Categoria, Receta[]> = {
    desayunos: [],
    entradas: [],
    pescados: [],
    carnes: [],
    vegetales: [],
    bases: [],
  };
  for (const r of recetas) out[r.categoria].push(r);
  return out;
}

/**
 * Anterior / siguiente dentro del array global — para RecipeNav.
 */
export function adyacentes(slug: string): { prev: Receta | null; next: Receta | null } {
  const idx = recetas.findIndex((r) => r.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? recetas[idx - 1] : null,
    next: idx < recetas.length - 1 ? recetas[idx + 1] : null,
  };
}
