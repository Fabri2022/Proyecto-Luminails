import { iniciosLibres, formatearHora } from "./horarios.ts";
import assert from "node:assert/strict";

const f = (r: number[]) => r.map(formatearHora);
// Lunes 15:00–17:30: un Soft Gel (120) solo entra 15:00 y 15:30
assert.deepEqual(f(iniciosLibres({ desde: "15:00", hasta: "17:30" }, 120, [])), ["15:00", "15:30"]);
// Semipermanente (60) el mismo lunes
assert.deepEqual(f(iniciosLibres({ desde: "15:00", hasta: "17:30" }, 60, [])), ["15:00", "15:30", "16:00", "16:30"]);
// Turno ocupado 16:00–17:00 bloquea los que lo pisan
assert.deepEqual(f(iniciosLibres({ desde: "15:00", hasta: "18:00" }, 60, [{ inicio: 960, fin: 1020 }])), ["15:00", "17:00"]);
// Día sin franja (domingo) => nada
assert.deepEqual(iniciosLibres(undefined, 60, []), []);
// Hoy: no ofrecer horas pasadas
assert.deepEqual(f(iniciosLibres({ desde: "15:00", hasta: "18:00" }, 60, [], 16 * 60 + 1)), ["16:30", "17:00"]);
console.log("horarios: todos los tests OK");
