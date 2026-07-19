const header=document.getElementById('siteHeader');
const menuButton=document.getElementById('menuButton');
const nav=document.getElementById('mainNav');
const seasonButtons=[...document.querySelectorAll('.season-option')];
const modal=document.getElementById('contentModal');
const modalContent=document.getElementById('modalContent');
const lightbox=document.getElementById('lightbox');
const lightboxImage=document.getElementById('lightboxImage');

document.getElementById('year').textContent=new Date().getFullYear();
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30));
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const updateSeasonText=(season)=>{
  document.querySelectorAll('[data-summer][data-winter]').forEach(el=>{el.textContent=el.dataset[season];});
};
seasonButtons.forEach(btn=>btn.addEventListener('click',()=>{
  const season=btn.dataset.season;
  document.body.dataset.season=season;
  seasonButtons.forEach(b=>b.classList.toggle('active',b===btn));
  updateSeasonText(season);
  localStorage.setItem('ferienhausLuxSeason',season);
}));
const savedSeason=localStorage.getItem('ferienhausLuxSeason');
if(savedSeason&&['summer','winter'].includes(savedSeason))seasonButtons.find(b=>b.dataset.season===savedSeason)?.click();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.gallery-item img').forEach(img=>img.closest('button').addEventListener('click',()=>{lightboxImage.src=img.src;lightboxImage.alt=img.alt;lightbox.showModal();}));
lightbox.querySelector('.modal-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});

const content={
  wandern:{title:'Wandern rund um Öblarn',text:'Hier entstehen nach und nach persönliche Tourentipps – von leichten Spaziergängen bis zu längeren Bergtouren. Jede Empfehlung kann später mit Gehzeit, Höhenmetern, Schwierigkeit und direktem Routenlink ergänzt werden.'},
  garten:{title:'Zeit im Garten',text:'Der Garten und die Terrasse bieten viel Platz für Frühstück im Freien, entspannte Nachmittage und gemeinsame Grillabende.'},
  ausfluege:{title:'Ausflüge im Ennstal',text:'Geplant sind Empfehlungen für Badeseen, Schluchten, Almen, Familienziele, regionale Gastronomie und Schlechtwetterprogramme.'},
  winter:{title:'Winter rund um Öblarn',text:'Von Schladming-Dachstein bis zur Planneralm liegen mehrere Skigebiete gut erreichbar. Die genauen Fahrzeiten und persönlichen Empfehlungen ergänzen wir noch.'},
  winterwandern:{title:'Winterwandern',text:'Ruhige Wege und verschneite Landschaften bieten eine entspannte Alternative zum Skitag. Konkrete Routen werden mit den Winterbildern ergänzt.'},
  winteraktiv:{title:'Weitere Winteraktivitäten',text:'Langlaufen, Rodeln und Ausflüge in der verschneiten Region werden hier später übersichtlich zusammengefasst.'},
  impressum:{title:'Impressum',text:'Vor der Veröffentlichung müssen hier Name und Anschrift des Betreibers, Kontaktdaten sowie die gesetzlich erforderlichen Angaben ergänzt werden.'},
  datenschutz:{title:'Datenschutz',text:'Vor der Veröffentlichung wird eine vollständige Datenschutzerklärung ergänzt. Diese hängt davon ab, ob später Karten, Analysewerkzeuge, Kontaktformulare oder externe Inhalte eingebunden werden.'}
};
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();const item=content[btn.dataset.modal];if(!item)return;modalContent.innerHTML=`<p class="eyebrow">Ferienhaus Lux</p><h2>${item.title}</h2><p>${item.text}</p>`;modal.showModal();}));
modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});

// Digitaler Gästeassistent
(() => {
  const widget = document.getElementById('chatWidget');
  if (!widget) return;

  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeButton = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const suggestions = document.getElementById('chatSuggestions');
  const sendButton = form.querySelector('.chat-send');
  const bookingUrl = 'https://www.booking.com/hotel/at/ferienhaus-lux-260s.de.html';
  const history = [];

  const setOpen = (open) => {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => input.focus(), 80);
  };

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  const addMessage = (role, text, extraClass = '') => {
    const row = document.createElement('div');
    row.className = `chat-message ${role} ${extraClass}`.trim();
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  };

  const addTyping = () => {
    const row = document.createElement('div');
    row.className = 'chat-message assistant typing';
    row.innerHTML = '<div class="chat-bubble"><span></span><span></span><span></span></div>';
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  };

  const localAnswer = (question) => {
    const q = question.toLocaleLowerCase('de');
    if (/verfüg|frei|preis|kosten|buchen|buchung/.test(q)) return `Aktuelle Preise und freie Termine werden direkt auf Booking.com angezeigt: ${bookingUrl}`;
    if (/person|gast|gäste|schlaf|bett/.test(q)) return 'Im Ferienhaus Lux haben bis zu 8 Gäste Platz. Das Haus bietet rund 120 m² Wohnfläche und 3 Schlafzimmer.';
    if (/hund|haustier|tier/.test(q)) return 'Ja, Haustiere sind im Ferienhaus Lux willkommen.';
    if (/wlan|wifi|internet/.test(q)) return 'Kostenloses WLAN ist im gesamten Ferienhaus verfügbar.';
    if (/park|auto|stellplatz/.test(q)) return 'Direkt auf dem Grundstück stehen 3 Parkplätze zur Verfügung.';
    if (/garten|terrasse|grill/.test(q)) return 'Zum Haus gehören ein rund 800 m² großer Garten und eine Terrasse zur alleinigen Nutzung.';
    if (/schladming/.test(q)) return 'Schladming liegt laut Website rund 24 km vom Ferienhaus entfernt.';
    if (/bahnhof|zug/.test(q)) return 'Der nächste Bahnhof liegt rund 3 km entfernt.';
    if (/supermarkt|einkauf/.test(q)) return 'Ein Supermarkt befindet sich laut Website in rund 2,7 km Entfernung.';
    if (/badesee|schwimm|baden/.test(q)) return 'Das Freibad Öblarn liegt rund 3,5 km entfernt, der Badesee Aich rund 13 km.';
    if (/wo|lage|adresse|öblarn|anreise/.test(q)) return 'Das Ferienhaus liegt ruhig im Ortsteil Bach, rund 3 km von Öblarn und Stein an der Enns entfernt.';
    if (/englisch|english/.test(q)) return 'Of course — I can also answer questions in English. What would you like to know about Ferienhaus Lux?';
    return 'Dazu habe ich in der aktuellen Hausbeschreibung noch keine verlässliche Information. Für eine verbindliche Auskunft nutze bitte den Booking.com-Link oder kontaktiere den Gastgeber.';
  };

  const askAssistant = async (question) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: question, history: history.slice(-8)})
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.answer) throw new Error('Leere Antwort');
      return data.answer;
    } catch (error) {
      // Beim lokalen Öffnen oder vor Einrichtung des API-Schlüssels arbeitet der Assistent als FAQ-Demo.
      return localAnswer(question);
    }
  };

  const submitQuestion = async (question) => {
    const clean = question.trim();
    if (!clean || sendButton.disabled) return;
    addMessage('user', clean);
    history.push({role: 'user', content: clean});
    input.value = '';
    input.style.height = 'auto';
    sendButton.disabled = true;
    suggestions.hidden = true;
    const typing = addTyping();
    const answer = await askAssistant(clean);
    typing.remove();
    addMessage('assistant', answer);
    history.push({role: 'assistant', content: answer});
    sendButton.disabled = false;
    input.focus();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  });
  suggestions.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => submitQuestion(button.textContent));
  });
})();
