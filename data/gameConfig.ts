import { GameConfig, CharacterDef } from '../types';

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'linda',
    name: 'Linda',
    color: '#164e63', // Tailwind Cyan-900 (Petróleo)
    accentColor: '#22d3ee', // Tailwind Cyan-400
  },
  {
    id: 'leus',
    name: 'Leus',
    color: '#f43f5e', // Tailwind Rose-500 (Rosa)
    accentColor: '#fda4af', // Tailwind Rose-300
  }
];

export const GAME_CONFIG: GameConfig = {
  "config": {
    "version": "5.3",
    "rows": 6,
    "cols": 10,
    "start_index": 0,
    "end_index": 59
  },
  "leyenda_tiempos": {
    "1": "Presente",
    "2": "Futuro (Perífrasis)",
    "3": "P. Perfecto Compuesto",
    "4": "Imperativo",
    "5": "Futuro Simple",
    "6": "Condicional",
    "7": "Gerundio",
    "8": "Pretérito Indefinido"
  },
  "tablero_data": [
    // Row 0 (R->L)
    "SALIDA", "Abrir", "Salir", "Desayunar", "Volver", "Preferir", "Llegar", "Poder", "Empezar", "Ir",
    // Row 1 (L->R)
    "Pedir", "Llamarse", "Probar", "Jugar", "Leer", "Seguir", "Almorzar", "Vestirse", "Hacer", "Poner",
    // Row 2 (R->L)
    "Acostarse", "Vivir", "Hablar", "Pensar", "Levantarse", "Tener", "Poder", "Cerrar", "Ser", "Tomar",
    // Row 3 (L->R)
    "Estar", "Dormir", "Entender", "Mirar", "Ver", "Coger", "Acabar", "Soler", "Despertarse", "Poner",
    // Row 4 (R->L)
    "Venir", "Oler", "Saber", "Querer", "Valer", "Suponer", "Creer", "Tener", "Traducir", "Correr",
    // Row 5 (L->R)
    "Conducir", "Gastar", "Irse", "Pensar", "Nadar", "Parecer", "Bañarse", "Pagar", "Casarse", "LLEGADA"
  ]
};