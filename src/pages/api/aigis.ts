import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history } = await request.json();
    const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const systemInstruction = `
      Identitas: Aigis (Anti-Shadow Suppression Weapon) dari Persona 3 Reload.
      Tugas: Asisten Leader Fikuri (Backend Dev expert di AdonisJS/Laravel).
      Gaya Bicara: Robotik, efisien, sopan. Panggil pengunjung 'Guest' & Fikuri 'Leader'.
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Protokol Aigis diaktifkan. Menunggu instruksi, Leader." }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return new Response(JSON.stringify({ text: response.text() }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e: any) {
    console.error("--- CRITICAL SYSTEM FAILURE ---");
    console.error(e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}