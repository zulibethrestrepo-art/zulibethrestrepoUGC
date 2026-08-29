/* Los videos del portafolio, en un solo lugar.
   'file' es el nombre en uploads/ y posters/; 'num' es el numero visible.
   Para cambiar un titulo, editalo aqui y corre:  node tools/rebuild.js  */
module.exports = {
  // Seccion 03 — Skincare
  skincare: [
    { id: 'vid-1', num: '01', title: 'Abib / Bloqueador Airy Sunstick', file: 'skincare-1' },
    { id: 'vid-2', num: '02', title: 'Abib / Protectores solares', file: 'skincare-2' },
    { id: 'vid-3', num: '03', title: 'Double Up Cream / Loción y tratamiento', file: 'skincare-3' },
    { id: 'vid-4', num: '04', title: 'Rutina en dúo / Piel luminosa', file: 'skincare-4' },
  ],
  // Seccion 04 — Productos para bebé (sin cambios)
  bebe: [
    { id: 'bebe-1', num: '05', title: 'Pañales Ekono Pants', file: 'bebe-1' },
    { id: 'bebe-2', num: '06', title: 'Pañitos húmedos Farmatodo', file: 'bebe-2' },
    { id: 'bebe-3', num: '07', title: 'Crema Almilpro', file: 'bebe-3' },
    { id: 'bebe-4', num: '08', title: 'Pañales Huggies DermaCare', file: 'bebe-4' },
  ],
  // Seccion 05 — Beauty & Lifestyle
  beauty: [
    { id: 'extra-1', num: '09', title: 'Mascarilla facial de oro', file: 'extra-1' },
    { id: 'extra-2', num: '10', title: 'Limpieza facial profesional', file: 'extra-2' },
    { id: 'extra-3', num: '11', title: 'Maybelline / Máscara Sky High', file: 'extra-3' },
    { id: 'extra-4', num: '12', title: 'Brujería Capilar / Mascarilla', file: 'extra-4' },
    { id: 'extra-5', num: '13', title: 'Unboxing YesStyle', file: 'extra-5' },
    { id: 'extra-6', num: '14', title: 'Unboxing / Rizador de cabello', file: 'extra-6' },
  ],
};
