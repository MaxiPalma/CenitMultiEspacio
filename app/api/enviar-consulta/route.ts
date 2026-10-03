import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const datos = await request.formData();
  const token = datos.get("cf-turnstile-response");

  if (!token) {
    return NextResponse.json({ error: "Falta el captcha" }, { status: 400 });
  }

  const verificacion = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const resultado = await verificacion.json();

  if (!resultado.success) {
    return NextResponse.json({ error: "Captcha inválido" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { error } = await supabase.from("consultas").insert({
    nombre: datos.get("nombre"),
    telefono: datos.get("telefono"),
    tipo_evento: datos.get("tipo_evento"),
    fecha_tentativa: datos.get("fecha_tentativa") || null,
    mensaje: datos.get("mensaje"),
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}