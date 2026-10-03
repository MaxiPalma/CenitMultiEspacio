"use client";

import { useState, type SubmitEvent } from "react";

const campo = "rounded border border-white/20 bg-white/5 p-3 text-white";

export default function FormularioConsulta() {
  const [estado, setEstado] = useState<"reposo" | "enviando" | "ok" | "error">("reposo");

  async function enviar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");

    const formulario = e.currentTarget;
    const datos = new FormData(formulario);

    const respuesta = await fetch("/api/enviar-consulta", {
      method: "POST",
      body: datos,
    });

    if (!respuesta.ok) {
      setEstado("error");
    } else {
      setEstado("ok");
      formulario.reset();
    }
  }

  return (
    <form onSubmit={enviar} className="flex w-full max-w-md flex-col gap-4">
      <input name="nombre" required placeholder="Nombre y apellido" className={campo} />
      <input name="telefono" required placeholder="Teléfono" className={campo} />
      <select name="tipo_evento" className={campo}>
        <option value="Casamiento">Casamiento</option>
        <option value="XV">XV años</option>
        <option value="Cumpleaños">Cumpleaños</option>
        <option value="Evento de empresa">Evento de empresa</option>
      </select>
      <input name="fecha_tentativa" type="date" className={campo} />
      <textarea name="mensaje" rows={3} placeholder="Contanos sobre tu evento" className={campo} />
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="rounded bg-teal-400 p-3 font-semibold text-black disabled:opacity-50"
      >
        {estado === "enviando" ? "Enviando..." : "Enviar consulta"}
      </button>
      {estado === "ok" && <p className="text-teal-400">¡Gracias! Te contactamos pronto.</p>}
      {estado === "error" && <p className="text-red-400">Algo salió mal. Probá de nuevo.</p>}
    </form>
  );
}