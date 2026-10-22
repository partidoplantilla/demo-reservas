// =====================================================================
//  CONFIGURACIÓN · Cambia solo esta parte y la página se arma sola
// =====================================================================
const CONFIG = {
  // Datos del negocio
  nombre: "Tu Complejo",
  eslogan: ["Tu partido,", "tu cancha."],          // 2 líneas del título grande
  descripcion: "Canchas con grass sintético de última generación, iluminación LED y atención personalizada. Reserva en segundos y juega sin preocupaciones.",
  whatsapp: "51999999999",                         // código de país + número, sin + ni espacios
  telefonoVisible: "+51 999 999 999",              // como se muestra en la página
  direccion: "Av. Principal 123, Tu Ciudad",
  dias: "Lunes a domingo",
  mapa: "Plaza de Armas de Lima",                  // lo que escribirías en Google Maps
  redes: {                                         // deja "" para ocultar
    facebook: "",
    instagram: "",
    tiktok: ""
  },

  // Horario de atención (formato 24h: 6 = 6 am, 24 = 12 am, 25 = 1 am)
  horaApertura: 6,
  horaCierre: 25,

  // Tarifas por hora. "hasta" = hora en que termina esa tarifa
  moneda: "S/",
  tarifas: [
    { nombre: "Mañana", hasta: 12, precio: 40 },
    { nombre: "Tarde",  hasta: 18, precio: 55 },
    { nombre: "Noche",  hasta: 25, precio: 70, destacada: true }
  ],

  // Canchas. Para agregar otra copia un bloque { ... } completo
  canchas: [
    {
      nombre: "Cancha 1",
      tipo: "Fútbol 7",
      descripcion: "Grass sintético profesional, ideal para partidos de 7 vs 7 con graderías y vestidores.",
      caracteristicas: ["Grass sintético", "Iluminación LED", "Vestidores", "Estacionamiento"],
      foto: "img/cancha1.jpg"
    },
    {
      nombre: "Cancha 2",
      tipo: "Fútbol 5 / Vóley",
      descripcion: "Cancha multiuso perfecta para fulbito, vóley o básquet con excelente iluminación nocturna.",
      caracteristicas: ["Piso multiuso", "Iluminación LED", "Zona de descanso", "Kiosko / bebidas"],
      foto: "img/cancha2.jpg"
    }
  ],

  // URL de Apps Script (termina en /exec). Sin ella la página funciona en modo demo
  api: "PEGA_AQUI_LA_URL_DE_APPS_SCRIPT"
};
// =====================================================================
//  A partir de aquí no necesitas cambiar nada
// =====================================================================

const MODO_DEMO = !CONFIG.api || CONFIG.api.includes("PEGA_AQUI");
const $ = sel => document.querySelector(sel);
const esc = t => String(t).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Convierte 20 -> "8:00 pm"  24 -> "12:00 am"  25 -> "1:00 am"
const formatoHora = h => {
  const h24 = h % 24;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:00 ${h24 < 12 ? "am" : "pm"}`;
};
const precioTxt = n => `${CONFIG.moneda} ${n}`;
const horarioTxt = `${formatoHora(CONFIG.horaApertura)} – ${formatoHora(CONFIG.horaCierre)}`;
const tarifaDe = h => CONFIG.tarifas.find(t => h < t.hasta) || CONFIG.tarifas[CONFIG.tarifas.length - 1];

// ====== Textos del negocio ======
const TEXTOS = {
  nombre: CONFIG.nombre,
  descripcion: CONFIG.descripcion,
  dias: CONFIG.dias,
  horario: horarioTxt,
  direccion: CONFIG.direccion,
  telefono: CONFIG.telefonoVisible,
  anio: new Date().getFullYear()
};
document.querySelectorAll("[data-texto]").forEach(el => {
  const v = TEXTOS[el.dataset.texto];
  if (v !== undefined) el.textContent = v;
});
document.title = `${CONFIG.nombre} | Alquiler de canchas y reservas online`;
$("#eslogan").innerHTML = `${esc(CONFIG.eslogan[0])}<br><span class="text-brand-400">${esc(CONFIG.eslogan[1] || "")}</span>`;
$("#stat-canchas").textContent = CONFIG.canchas.length;
$("#stat-horas").textContent = `${CONFIG.horaCierre - CONFIG.horaApertura}h`;
$("#mapa").src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapa)}&output=embed`;

// ====== Redes sociales ======
const contRedes = $("#redes");
const nombresRedes = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" };
Object.entries(CONFIG.redes).forEach(([red, url]) => {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  a.className = "rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition";
  a.textContent = nombresRedes[red] || red;
  contRedes.appendChild(a);
});
if (!contRedes.children.length) contRedes.remove();

// ====== Tarjetas de canchas ======
const contCanchas = $("#lista-canchas");
if (CONFIG.canchas.length >= 3) contCanchas.classList.add("lg:grid-cols-3");
CONFIG.canchas.forEach((c, i) => {
  const art = document.createElement("article");
  art.className = "group overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition duration-300";
  art.innerHTML = `
    <div class="img-slot ${i % 2 ? "img-slot-2" : ""} h-64 relative">
      ${c.foto ? `<img src="${esc(c.foto)}" alt="${esc(c.nombre)}" class="h-full w-full object-cover group-hover:scale-105 transition duration-500" onerror="this.remove()">` : ""}
      ${c.tipo ? `<span class="absolute top-4 left-4 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase text-white">${esc(c.tipo)}</span>` : ""}
    </div>
    <div class="p-8">
      <h3 class="font-display text-4xl font-bold uppercase text-slate-900">${esc(c.nombre)}</h3>
      <p class="mt-2 text-slate-600">${esc(c.descripcion || "")}</p>
      <ul class="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
        ${(c.caracteristicas || []).map(x => `<li class="flex items-center gap-2">✅ ${esc(x)}</li>`).join("")}
      </ul>
      <a href="#reservar" class="reservar-btn mt-8 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700">Reservar esta cancha →</a>
    </div>`;
  art.querySelector(".reservar-btn").dataset.cancha = c.nombre;
  contCanchas.appendChild(art);
});

// ====== Tarjetas de tarifas ======
const contTarifas = $("#lista-tarifas");
let inicioTarifa = CONFIG.horaApertura;
CONFIG.tarifas.forEach(t => {
  const desde = inicioTarifa;
  inicioTarifa = t.hasta;
  const div = document.createElement("div");
  if (t.destacada) {
    div.className = "relative rounded-3xl border-2 border-brand-500 bg-brand-500/10 p-8 text-center md:scale-105 shadow-2xl shadow-brand-500/20";
    div.innerHTML = `<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase text-white">Más pedido</span>`;
  } else {
    div.className = "rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur";
  }
  div.innerHTML += `
    <h3 class="font-display text-2xl font-bold uppercase ${t.destacada ? "text-brand-100" : "text-slate-300"}">${esc(t.nombre)}</h3>
    <p class="text-sm text-slate-400">${formatoHora(desde)} – ${formatoHora(t.hasta)}</p>
    <p class="mt-6 font-display text-6xl font-bold text-white"><span class="text-2xl align-top">${esc(CONFIG.moneda)}</span>${t.precio}</p>
    <p class="text-sm text-slate-400">por hora</p>`;
  contTarifas.appendChild(div);
});

// ====== Opciones del formulario ======
const selCancha = $("#cancha");
CONFIG.canchas.forEach(c => selCancha.add(new Option(c.nombre, c.nombre)));

// ====== Navbar: cambia de estilo al hacer scroll ======
const navbar = $("#navbar");
const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ====== Menú móvil ======
const menuBtn = $("#menu-btn");
const mobileMenu = $("#mobile-menu");
menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
mobileMenu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
);

// ====== Botón flotante de WhatsApp ======
$("#wa-float").href =
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola, quisiera información sobre las canchas.")}`;

// ====== Preseleccionar cancha desde las tarjetas ======
document.querySelectorAll(".reservar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selCancha.value = btn.dataset.cancha;
    selCancha.dispatchEvent(new Event("change"));
  });
});

// ====== Botones de horarios agrupados por tarifa ======
const contHorarios = $("#horarios");
const resumen = $("#resumen-horas");
const seleccionadas = new Set();

let desdeGrupo = CONFIG.horaApertura;
CONFIG.tarifas.forEach(t => {
  const ini = Math.max(desdeGrupo, CONFIG.horaApertura);
  const fin = Math.min(t.hasta, CONFIG.horaCierre);
  desdeGrupo = t.hasta;
  if (ini >= fin) return;

  const grupo = document.createElement("div");
  grupo.innerHTML =
    `<p class="grupo-titulo"><span>${esc(t.nombre)}</span><span>${esc(precioTxt(t.precio))} por hora</span></p>`;
  const grilla = document.createElement("div");
  grilla.className = "grilla-horas";

  for (let h = ini; h < fin; h++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "slot";
    b.dataset.hora = h;
    b.innerHTML = `${formatoHora(h)}<span class="slot-precio"></span>`;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      seleccionadas.has(h) ? seleccionadas.delete(h) : seleccionadas.add(h);
      b.setAttribute("aria-pressed", seleccionadas.has(h));
      actualizarResumen();
    });
    grilla.appendChild(b);
  }
  grupo.appendChild(grilla);
  contHorarios.appendChild(grupo);
});

// Agrupa horas seguidas: [20,21,22] -> "8:00 pm a 11:00 pm"
const rangos = () => {
  const horas = [...seleccionadas].sort((a, b) => a - b);
  const grupos = [];
  horas.forEach(h => {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.fin === h) ultimo.fin = h + 1;
    else grupos.push({ inicio: h, fin: h + 1 });
  });
  return grupos.map(g => `${formatoHora(g.inicio)} a ${formatoHora(g.fin)}`);
};

// Cuenta horas y suma precio por cada tarifa
const calcularPrecio = () => {
  const detalle = CONFIG.tarifas.map(t => ({ ...t, horas: 0 }));
  seleccionadas.forEach(h => detalle[CONFIG.tarifas.indexOf(tarifaDe(h))].horas++);
  const usadas = detalle.filter(t => t.horas > 0);
  const total = usadas.reduce((s, t) => s + t.horas * t.precio, 0);
  return { usadas, total };
};

function mostrarAviso(texto, error = false) {
  resumen.textContent = texto;
  resumen.classList.toggle("error", error);
}

function actualizarResumen() {
  resumen.classList.remove("error");
  if (seleccionadas.size === 0) {
    resumen.textContent = "Toca uno o más horarios";
    return;
  }
  const { usadas, total } = calcularPrecio();
  const lineas = usadas.map(t =>
    `<div class="flex justify-between"><span>${esc(t.nombre)}: ${t.horas} h × ${esc(precioTxt(t.precio))}</span><span>${esc(precioTxt(t.horas * t.precio))}</span></div>`
  ).join("");
  resumen.innerHTML =
    `<p class="mb-2 text-slate-500">${rangos().join(", ")}</p>` +
    lineas +
    `<div class="mt-2 pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">` +
    `<span>Total (${seleccionadas.size} h)</span><span>${esc(precioTxt(total))}</span></div>`;
}

// ====== Fecha mínima = hoy ======
const fecha = $("#fecha");
const btnEnviar = $('#form-reserva button[type="submit"]');
const hoyLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
fecha.min = hoyLocal();

// ====== Horas reservadas (vienen de la hoja de Google) ======
let ocupadas = new Set();   // confirmadas por el dueño
let pendientes = new Set(); // separadas esperando confirmación
let minutosPendiente = 30;
let cargando = false;

// Pinta cada botón según esté libre, pasado o reservado
function pintarHorarios() {
  const sinFecha = !fecha.value;
  const esHoy = fecha.value === hoyLocal();
  const ahora = new Date().getHours();

  contHorarios.querySelectorAll(".slot").forEach(b => {
    const h = Number(b.dataset.hora);
    const reservado = ocupadas.has(h);
    const pendiente = !reservado && pendientes.has(h);
    const pasada = esHoy && h <= ahora;
    b.disabled = sinFecha || cargando || reservado || pendiente || pasada;
    b.classList.toggle("ocupado", reservado);
    b.classList.toggle("pendiente", pendiente);
    b.classList.toggle("pasada", pasada && !reservado && !pendiente);
    b.querySelector(".slot-precio").textContent =
      reservado ? "Reservado" : pendiente ? "Por confirmar" : precioTxt(tarifaDe(h).precio);
    if (b.disabled && seleccionadas.has(h)) {
      seleccionadas.delete(h);
      b.setAttribute("aria-pressed", "false");
    }
  });

  if (sinFecha) mostrarAviso("Primero elige la fecha para ver los horarios libres");
  else if (cargando) mostrarAviso("Revisando horarios libres...");
  else actualizarResumen();
}

async function cargarOcupadas() {
  if (!fecha.value || MODO_DEMO) { pintarHorarios(); return; }
  cargando = true;
  pintarHorarios();
  try {
    const url = `${CONFIG.api}?fecha=${encodeURIComponent(fecha.value)}&cancha=${encodeURIComponent(selCancha.value)}`;
    const res = await fetch(url);
    const data = await res.json();
    ocupadas = new Set((data.ocupadas || []).map(Number));
    pendientes = new Set((data.pendientes || []).map(Number));
    if (data.minutos) minutosPendiente = data.minutos;
    cargando = false;
    pintarHorarios();
  } catch (err) {
    console.error(err);
    ocupadas = new Set();
    pendientes = new Set();
    cargando = false;
    pintarHorarios();
    mostrarAviso("No se pudo revisar la disponibilidad. Revisa tu internet y vuelve a elegir la fecha", true);
  }
}

fecha.addEventListener("change", cargarOcupadas);
fecha.addEventListener("input", cargarOcupadas);
selCancha.addEventListener("change", cargarOcupadas);
// Se actualiza solo cada 30 segundos y al volver a la página
setInterval(() => { if (fecha.value && !document.hidden) cargarOcupadas(); }, 30000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) cargarOcupadas(); });
// Al recargar el navegador recuerda la fecha elegida así que revisamos de una vez
cargarOcupadas();
window.addEventListener("pageshow", e => { if (e.persisted) cargarOcupadas(); });

// ====== Guardar la reserva y enviar por WhatsApp ======
function mensajeWhatsApp(nombre, cancha, dia, textoHorario) {
  const { usadas, total } = calcularPrecio();
  const [y, m, d] = dia.split("-");
  return `Hola ${CONFIG.nombre}, quiero reservar:\n` +
    `👤 Nombre: ${nombre}\n` +
    `⚽ Cancha: ${cancha}\n` +
    `📅 Fecha: ${d}/${m}/${y}\n` +
    `🕒 Horario: ${textoHorario}\n` +
    `⏱️ Horas: ${seleccionadas.size}\n` +
    usadas.map(t => `   • ${t.nombre}: ${t.horas} h × ${precioTxt(t.precio)} = ${precioTxt(t.horas * t.precio)}\n`).join("") +
    `💰 Total: ${precioTxt(total)}` +
    (MODO_DEMO ? "" : `\n(Horario separado por ${minutosPendiente} min hasta que me confirmen)`);
}

$("#form-reserva").addEventListener("submit", async e => {
  e.preventDefault();
  if (seleccionadas.size === 0) {
    mostrarAviso("Elige al menos un horario para reservar", true);
    contHorarios.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const nombre = $("#nombre").value.trim();
  const cancha = selCancha.value;
  const dia = fecha.value;
  const horas = [...seleccionadas].sort((a, b) => a - b);
  const textoHorario = rangos().join(", ");
  const { total } = calcularPrecio();
  const waUrl = () =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(nombre, cancha, dia, textoHorario))}`;

  // Modo demo: sin hoja de Google, solo abre WhatsApp
  if (MODO_DEMO) {
    window.open(waUrl(), "_blank");
    return;
  }

  // Se abre la pestaña antes para que el celular no la bloquee
  const ventana = window.open("", "_blank");
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Guardando reserva...";

  try {
    const res = await fetch(CONFIG.api, {
      method: "POST",
      body: JSON.stringify({ fecha: dia, cancha, horas, nombre, horario: textoHorario, total })
    });
    const data = await res.json();

    if (!data.ok) {
      if (ventana) ventana.close();
      const tomadas = (data.ocupadas || []).map(h => formatoHora(Number(h))).join(", ");
      await cargarOcupadas();
      mostrarAviso(
        tomadas
          ? `Alguien acaba de reservar ${tomadas}. Elige otro horario`
          : (data.mensaje || "No se pudo guardar la reserva. Intenta de nuevo"),
        true
      );
      return;
    }

    if (data.minutos) minutosPendiente = data.minutos;
    const url = waUrl();
    if (ventana) ventana.location.href = url;
    else window.location.href = url;

    seleccionadas.clear();
    contHorarios.querySelectorAll(".slot").forEach(b => b.setAttribute("aria-pressed", "false"));
    await cargarOcupadas();
    mostrarAviso(`Tu horario queda separado por ${minutosPendiente} minutos. Envía el mensaje de WhatsApp para confirmarlo`);
  } catch (err) {
    console.error(err);
    if (ventana) ventana.close();
    mostrarAviso("No se pudo guardar la reserva. Revisa tu internet e intenta de nuevo", true);
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Reservar por WhatsApp";
  }
});

// ====== Animaciones al hacer scroll ======
document.querySelectorAll("section > div, article").forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
