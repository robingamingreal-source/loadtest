import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  // Schnellerer Anstieg auf 3.000 Benutzer innerhalb von nur 2 Minuten
  stages: [
    { duration: '30s', target: 1000 },   // In nur 30 Sekunden auf 1.000 User
    { duration: '30s', target: 2000 },   // Nach weiterer halben Minute auf 2.000 User
    { duration: '1m', target: 3000 },    // Schnell weiter auf das Ziel von 3.000 Usern
    { duration: '5m', target: 3000 },    // Die 3.000 Benutzer für 5 Minuten stabil halten
    { duration: '1m', target: 0 },       // Schneller Ausklingen-Lauf (Cool-down)
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1200'], // 95% der Requests unter 1.2 Sekunden unter Last
    'http_req_failed': ['rate<0.02'],   // Fehlerrate unter 2%
  },
};

const BASE_URL = 'http://192.168.178.77:30027';

export default function () {

  // 1. Dashboard öffnen
  group('01. Dashboard & Start', function () {
    let res = http.get(`${BASE_URL}/index.php/apps/dashboard/`);
    check(res, {
      'dashboard loaded': (r) => r.status === 200 || r.status === 302,
    });
    sleep(5 + Math.random() * 7); // Realistische Denkpause
  });

  // 2. Dateien-Ansicht durchstöbern
  group('02. Files & Navigation', function () {
    let res = http.get(`${BASE_URL}/index.php/apps/files/`);
    check(res, {
      'files app loaded': (r) => r.status === 200 || r.status === 302,
    });
    sleep(8 + Math.random() * 10); // Realistische Denkpause
  });

  // 3. Memories / Mediathek
  group('03. Memories / Media Gallery', function () {
    let res = http.get(`${BASE_URL}/index.php/apps/memories/`);
    check(res, {
      'memories loaded': (r) => r.status === 200 || r.status === 302,
    });
    sleep(10 + Math.random() * 15); // Realistische Denkpause
  });
}
