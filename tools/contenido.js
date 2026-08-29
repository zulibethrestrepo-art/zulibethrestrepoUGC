/* Los videos del portafolio, en un solo lugar.
   'num' es el numero visible en la pagina y tambien el nombre del archivo:
   el 07 vive en uploads/video-07.mp4 y posters/video-07.jpg.
   Para cambiar un titulo, editalo aqui y corre:  node tools/rebuild.js  */
module.exports = {
  // Seccion 03 — Beauty & Lifestyle
  beauty: [
    { id: 'vid-1',  num: '01', title: 'Abib / Bloqueador Airy Sunstick' },
    { id: 'vid-2',  num: '02', title: 'Abib / Protectores solares' },
    { id: 'vid-3',  num: '03', title: 'Double Up Cream / Loción y tratamiento' },
    { id: 'vid-4',  num: '04', title: 'Rutina en dúo / Piel luminosa' },
    { id: 'vid-5',  num: '05', title: 'Mascarilla facial de oro' },
    { id: 'vid-6',  num: '06', title: 'Limpieza facial profesional' },
    { id: 'vid-7',  num: '07', title: 'Maybelline / Máscara Sky High' },
    { id: 'vid-8',  num: '08', title: 'Brujería Capilar / Mascarilla' },
    { id: 'vid-9',  num: '09', title: 'Unboxing YesStyle' },
    { id: 'vid-10', num: '10', title: 'Unboxing / Rizador de cabello' },
    { id: 'vid-11', num: '11', title: 'Unboxing sorpresa' },
    { id: 'vid-12', num: '12', title: 'Feria de Belleza y Salud' },
  ],
  // Seccion 04 — Productos para bebé (va de ultima)
  bebe: [
    { id: 'bebe-1', num: '13', title: 'Pañales Ekono Pants' },
    { id: 'bebe-2', num: '14', title: 'Pañitos húmedos Farmatodo' },
    { id: 'bebe-3', num: '15', title: 'Crema Almilpro' },
    { id: 'bebe-4', num: '16', title: 'Pañales Huggies DermaCare' },
  ],
};
