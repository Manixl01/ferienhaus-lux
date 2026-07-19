FERIENHAUS LUX – WEBSITE VERSION 5 MIT GÄSTEASSISTENT

SOFORT LOKAL TESTEN
1. Ordner entpacken.
2. index.html doppelklicken.
3. Unten rechts auf „Fragen zum Haus?“ klicken.

Beim lokalen Öffnen läuft eine integrierte FAQ-Demo. Sie beantwortet bereits typische Fragen zu Gästezahl, Haustieren, WLAN, Parkplätzen, Garten und Lage. Dafür entstehen keine Kosten und es wird kein API-Schlüssel benötigt.

ECHTE KI AUF CLOUDFLARE PAGES AKTIVIEREN
Die Datei functions/api/chat.js ist bereits vorbereitet. Cloudflare Pages erkennt den Ordner /functions automatisch und stellt den Endpunkt /api/chat bereit.

1. Website als Cloudflare-Pages-Projekt bereitstellen.
2. In Cloudflare: Workers & Pages > dein Projekt > Settings > Variables and Secrets.
3. Secret anlegen:
   Name: OPENAI_API_KEY
   Wert: dein OpenAI-API-Schlüssel
4. Optional eine normale Variable setzen:
   Name: OPENAI_MODEL
   Wert: gpt-4.1-mini
5. Neu deployen.

Der API-Schlüssel steht ausschließlich als Secret auf Cloudflare und niemals im Browser-Code.

WISSEN DES ASSISTENTEN ÄNDERN
Die verlässlichen Hausinformationen stehen in:
functions/api/chat.js
im Abschnitt HOUSE_KNOWLEDGE.

Wichtig: Aktuell kennt der Assistent nur Informationen, die bereits auf der Website stehen. Check-in, Check-out, genaue Bettenaufteilung, Kontakt, Hausregeln und weitere Details sollten später ergänzt werden.

VOR VERÖFFENTLICHUNG
- Impressum vervollständigen
- Datenschutzerklärung um KI-Chat/OpenAI und Cloudflare ergänzen
- Datenschutzhinweis und Rechtsgrundlage prüfen
- Kostenlimit im OpenAI-Konto setzen
- Assistent ausführlich mit ungewöhnlichen Fragen testen
