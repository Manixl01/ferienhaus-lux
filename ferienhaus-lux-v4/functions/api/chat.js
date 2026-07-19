const BOOKING_URL = 'https://www.booking.com/hotel/at/ferienhaus-lux-260s.de.html';

const HOUSE_KNOWLEDGE = `
Du bist der digitale Gästeassistent des Ferienhaus Lux in Öblarn, Steiermark, Österreich.
Antworte freundlich, knapp und natürlich in der Sprache des Gastes.

Verlässliche Informationen:
- Ganzes freistehendes Ferienhaus, rund 120 m² Wohnfläche
- Platz für bis zu 8 Gäste
- 3 Schlafzimmer
- Küche und Wohnbereich
- Rund 800 m² Garten und Terrasse zur alleinigen Nutzung
- Haustiere sind willkommen
- Kostenloses WLAN im gesamten Haus
- 3 Parkplätze direkt am Grundstück
- Ruhige Lage im Ortsteil Bach, rund 3 km von Öblarn und Stein an der Enns
- Bushaltestelle ca. 400 m
- Supermarkt ca. 2,7 km
- Bahnhof und Restaurant ca. 3 km
- Freibad Öblarn ca. 3,5 km
- Badesee Aich ca. 13 km
- Schladming ca. 24 km
- Gute Ausgangslage für Schladming-Dachstein, Naturpark Sölktäler, Wandern und Winterurlaub
- Aktuelle Verfügbarkeit und Preise ausschließlich über Booking.com: ${BOOKING_URL}

Regeln:
- Erfinde keine Ausstattung, Hausregeln, Preise, Fahrzeiten, Verfügbarkeiten, Check-in-Zeiten oder Kontaktdaten.
- Behaupte nie, einen Kalender geprüft zu haben.
- Bei Fragen zu Preis oder Verfügbarkeit verweise direkt auf Booking.com.
- Fehlt eine Information, sage offen, dass sie noch nicht in der Hausbeschreibung hinterlegt ist.
- Keine langen Aufzählungen, außer der Gast bittet darum.
- Gib keine sensiblen Zugangsdaten wie WLAN-Passwörter oder Schlüsselinformationen aus.
`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function extractText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

export async function onRequestPost(context) {
  try {
    if (!context.env.OPENAI_API_KEY) return json({error: 'OPENAI_API_KEY fehlt.'}, 503);

    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return json({error: 'JSON erwartet.'}, 415);

    const body = await context.request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return json({error: 'Nachricht fehlt.'}, 400);
    if (message.length > 600) return json({error: 'Nachricht ist zu lang.'}, 400);

    const history = Array.isArray(body.history)
      ? body.history.slice(-8).filter(item => ['user', 'assistant'].includes(item?.role) && typeof item?.content === 'string')
      : [];

    const input = [
      ...history.map(item => ({role: item.role, content: item.content.slice(0, 1200)})),
      {role: 'user', content: message}
    ];

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: context.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: HOUSE_KNOWLEDGE,
        input,
        max_output_tokens: 260,
        store: false
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error('OpenAI error', apiResponse.status, data?.error?.message);
      return json({error: 'Der Assistent ist vorübergehend nicht erreichbar.'}, 502);
    }

    const answer = extractText(data);
    if (!answer) return json({error: 'Keine Antwort erhalten.'}, 502);
    return json({answer});
  } catch (error) {
    console.error('Chat function error', error);
    return json({error: 'Unerwarteter Fehler.'}, 500);
  }
}

export function onRequestGet() {
  return json({status: 'ok', service: 'Ferienhaus Lux Gästeassistent'});
}
