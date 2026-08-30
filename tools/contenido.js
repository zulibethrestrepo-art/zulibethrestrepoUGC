/* Los videos del portafolio, en un solo lugar.
   'num' es el numero visible en la pagina y tambien el nombre del archivo:
   el 07 vive en uploads/video-07.mp4 y posters/video-07.jpg.
   Para cambiar un titulo, editalo aqui y corre:  node tools/rebuild.js  */
module.exports = {
  // Seccion 03 — Beauty y Skin Care
  beauty: [
    { id: 'vid-1',  num: '01', title: 'Feria de Belleza y Salud' },
    { id: 'vid-2',  num: '02', title: 'Abib / Bloqueador Airy Sunstick' },
    { id: 'vid-3',  num: '03', title: 'Abib / Protectores solares' },
    { id: 'vid-4',  num: '04', title: 'Epii / Double Up Cream' },
    { id: 'vid-5',  num: '05', title: 'Epii / Rutina en dúo' },
    { id: 'vid-6',  num: '06', title: 'Mascarilla facial de oro' },
    { id: 'vid-7',  num: '07', title: 'Limpieza facial profesional' },
    { id: 'vid-8',  num: '08', title: 'Pestañina / heavy full figure' },
    { id: 'vid-9',  num: '09', title: 'Vive Beauty / Mantequilla' },
    { id: 'vid-10', num: '10', title: 'Unboxing YesStyle' },
    { id: 'vid-11', num: '11', title: 'Unboxing / Epii' },
    { id: 'vid-12', num: '12', title: 'Unboxing sorpresa' },
  ],
  // Seccion 04 — Productos para bebé (va de ultima)
  bebe: [
    { id: 'bebe-1', num: '13', title: 'Pañales Ekono Pants' },
    { id: 'bebe-2', num: '14', title: 'Pañales Huggies DermaCare' },
    { id: 'bebe-3', num: '15', title: 'Almipro / Ungüento' },
    { id: 'bebe-4', num: '16', title: "Johnson's baby / Shampoo" },
  ],
};
