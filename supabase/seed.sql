-- ══════════════════════════════════════════════════
-- PrioriTracker — Mock data pentru testare
-- Rulează în Supabase SQL Editor (o singură dată)
-- Colegi: BGN, Sanda, Prodi, Cristi, Octav
-- 10 priorități × 10-12 task-uri = ~110 task-uri
-- ══════════════════════════════════════════════════

DO $$
DECLARE
  p_efactura   UUID;
  p_dublin     UUID;
  p_ai         UUID;
  p_fact_mvp   UUID;
  p_cont_bono  UUID;
  p_engine     UUID;
  p_salarii    UUID;
  p_vertigo    UUID;
  p_design     UUID;
  p_waiting    UUID;
BEGIN

-- ─── 1. eFactura / SPV (BGN) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_design, role_implementare, role_review)
VALUES ('Core — Conta', 'eFactura / SPV', 'Analiză',
  'Integrare cu SPV pentru descărcarea automată a facturilor și răspunsuri la comunicări ANAF.',
  'BGN', 'Octav', 'Cristi', 'Sanda')
RETURNING id INTO p_efactura;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_efactura, 'Discovery cu 3 contabili: flow curent eFactura', 'BGN', 3, 'done', 'Planificare Analiză', '2026-04-06', 0),
  (p_efactura, 'Mapare endpoints SPV + limite API', 'Cristi', 4, 'done', 'Execuție Analiză', '2026-04-06', 1),
  (p_efactura, 'Documentație cerere token SPV', 'BGN', 2, 'inlucru', 'Execuție Analiză', '2026-04-13', 2),
  (p_efactura, 'Definire schemă bază de date pentru facturi', 'Cristi', 3, 'todo', 'Execuție Analiză', '2026-04-13', 3),
  (p_efactura, 'Wireframes ecran import facturi', 'Octav', 4, 'todo', 'Design', '2026-04-13', 4),
  (p_efactura, 'Review arhitectură cu Sanda', 'BGN', 1.5, 'todo', 'Review', '2026-04-20', 5),
  (p_efactura, 'Prototip POC descărcare facturi', 'Cristi', 6, 'todo', 'Implementare IT', '2026-04-20', 6),
  (p_efactura, 'Mock UI pentru validare cu contabili', 'Octav', 3, 'todo', 'Design', '2026-04-20', 7),
  (p_efactura, 'Test POC cu 10 facturi reale', 'Cristi', 2, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_efactura, 'Document decizii tehnice finale', 'BGN', 2, 'todo', 'Review', '2026-04-27', 9),
  (p_efactura, 'Prezentare echipă + sign-off', 'Sanda', 1, 'todo', 'Review', '2026-05-04', 10);

-- ─── 2. Dublin (dashboard client) (BGN) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_design, role_implementare, role_review)
VALUES ('Core — Non-Conta', 'Dublin (dashboard client)', 'Analiză',
  'Dashboard pentru clienți cu overview financiar și task-uri.',
  'BGN', 'Octav', 'Cristi', 'Prodi')
RETURNING id INTO p_dublin;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_dublin, 'Interviu 5 clienți despre nevoile lor', 'BGN', 5, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_dublin, 'Sinteză interviuri + job stories', 'BGN', 3, 'done', 'Planificare Analiză', '2026-04-06', 1),
  (p_dublin, 'Benchmark 5 competitori (Xero, QuickBooks, etc)', 'BGN', 4, 'inlucru', 'Planificare Analiză', '2026-04-13', 2),
  (p_dublin, 'Definire KPI-uri afișate în dashboard', 'Prodi', 2, 'todo', 'Planificare Analiză', '2026-04-13', 3),
  (p_dublin, 'Wireframes low-fi 3 variante', 'Octav', 6, 'todo', 'Design', '2026-04-13', 4),
  (p_dublin, 'Review wireframes cu 3 clienți', 'BGN', 3, 'todo', 'Design', '2026-04-20', 5),
  (p_dublin, 'Hi-fi mockup varianta finală', 'Octav', 8, 'todo', 'Design', '2026-04-20', 6),
  (p_dublin, 'Arhitectură tehnică + diagramă', 'Cristi', 3, 'todo', 'Execuție Analiză', '2026-04-20', 7),
  (p_dublin, 'Breakdown task-uri pentru implementare', 'BGN', 2, 'todo', 'Execuție Analiză', '2026-04-27', 8),
  (p_dublin, 'Estimare ore + alocare oameni', 'Prodi', 1.5, 'todo', 'Execuție Analiză', '2026-04-27', 9),
  (p_dublin, 'Sign-off analiză cu Prodi', 'BGN', 1, 'todo', 'Review', '2026-05-04', 10);

-- ─── 3. Logica interpretare AI (Sanda) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_implementare, role_review)
VALUES ('Core — Conta', 'Logica interpretare AI', 'Analiză',
  'Motor AI pentru interpretarea automată a documentelor contabile.',
  'Sanda', 'Cristi', 'BGN')
RETURNING id INTO p_ai;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_ai, 'Test 3 modele LLM pe factura sample', 'Sanda', 6, 'done', 'Execuție Analiză', '2026-04-06', 0),
  (p_ai, 'Benchmark Gemini vs Claude vs GPT-4', 'Sanda', 4, 'done', 'Execuție Analiză', '2026-04-06', 1),
  (p_ai, 'Definire set 100 facturi gold-standard', 'Cristi', 5, 'inlucru', 'Execuție Analiză', '2026-04-13', 2),
  (p_ai, 'Prompt engineering iterație 1', 'Sanda', 4, 'inlucru', 'Execuție Analiză', '2026-04-13', 3),
  (p_ai, 'Măsurare acuratețe pe setul gold', 'Sanda', 3, 'todo', 'Execuție Analiză', '2026-04-13', 4),
  (p_ai, 'Prompt iterație 2 + fine-tune', 'Sanda', 5, 'todo', 'Execuție Analiză', '2026-04-20', 5),
  (p_ai, 'Integrare API în pipeline existent', 'Cristi', 6, 'todo', 'Implementare IT', '2026-04-20', 6),
  (p_ai, 'Test end-to-end cu 500 facturi', 'Cristi', 4, 'todo', 'Implementare IT', '2026-04-27', 7),
  (p_ai, 'Document limitări + edge cases', 'Sanda', 2, 'todo', 'Review', '2026-04-27', 8),
  (p_ai, 'Calcul cost/factură la scale', 'BGN', 2, 'todo', 'Review', '2026-05-04', 9),
  (p_ai, 'Decizie GO/NO-GO cu BGN', 'Sanda', 1, 'todo', 'Review', '2026-05-04', 10);

-- ─── 4. Facturare MVP (Sanda) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_design, role_implementare, role_review)
VALUES ('Core — Conta', 'Facturare MVP', 'Implementare',
  'Modul de facturare minimal viabil pentru primul pilot.',
  'Sanda', 'Octav', 'Cristi', 'BGN')
RETURNING id INTO p_fact_mvp;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_fact_mvp, 'User stories + acceptance criteria', 'Sanda', 4, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_fact_mvp, 'Wireframes ecran emitere factură', 'Octav', 5, 'done', 'Design', '2026-04-06', 1),
  (p_fact_mvp, 'Hi-fi mockups + prototype', 'Octav', 6, 'done', 'Design', '2026-04-06', 2),
  (p_fact_mvp, 'DB schema + migrări', 'Cristi', 3, 'done', 'Implementare IT', '2026-04-13', 3),
  (p_fact_mvp, 'Backend: endpoint create invoice', 'Cristi', 5, 'inlucru', 'Implementare IT', '2026-04-13', 4),
  (p_fact_mvp, 'Backend: endpoint list + filter', 'Cristi', 4, 'inlucru', 'Implementare IT', '2026-04-13', 5),
  (p_fact_mvp, 'Frontend: form emitere', 'Octav', 6, 'todo', 'Implementare IT', '2026-04-20', 6),
  (p_fact_mvp, 'Frontend: listă facturi + filtre', 'Octav', 4, 'todo', 'Implementare IT', '2026-04-20', 7),
  (p_fact_mvp, 'Generare PDF factură', 'Cristi', 4, 'todo', 'Implementare IT', '2026-04-20', 8),
  (p_fact_mvp, 'Test pe 3 clienți beta', 'Sanda', 3, 'todo', 'Review', '2026-04-27', 9),
  (p_fact_mvp, 'Fix bug-uri din beta', 'Cristi', 4, 'todo', 'Implementare IT', '2026-04-27', 10),
  (p_fact_mvp, 'Launch intern + docs', 'BGN', 2, 'todo', 'Review', '2026-05-04', 11);

-- ─── 5. cont.bono.ro (Prodi) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_implementare, role_review)
VALUES ('Core — Non-Conta', 'cont.bono.ro', 'Analiză',
  'Landing + flow onboarding pentru contul BONO.',
  'Prodi', 'Prodi', 'BGN')
RETURNING id INTO p_cont_bono;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_cont_bono, 'Audit landing actual + metrics', 'Prodi', 3, 'done', 'Planificare Analiză', '2026-04-06', 0),
  (p_cont_bono, 'Competitor analysis (5 concurenți)', 'Prodi', 4, 'done', 'Planificare Analiză', '2026-04-06', 1),
  (p_cont_bono, 'Redefinire value proposition', 'Prodi', 3, 'inlucru', 'Planificare Analiză', '2026-04-13', 2),
  (p_cont_bono, 'Wireframe landing nou', 'Octav', 5, 'todo', 'Design', '2026-04-13', 3),
  (p_cont_bono, 'Copy draft pentru toate secțiunile', 'Prodi', 4, 'todo', 'Execuție Analiză', '2026-04-13', 4),
  (p_cont_bono, 'Hi-fi design landing', 'Octav', 7, 'todo', 'Design', '2026-04-20', 5),
  (p_cont_bono, 'Flow onboarding step-by-step', 'Prodi', 4, 'todo', 'Execuție Analiză', '2026-04-20', 6),
  (p_cont_bono, 'A/B test plan pentru landing', 'Prodi', 2, 'todo', 'Execuție Analiză', '2026-04-27', 7),
  (p_cont_bono, 'Implementare landing (Next.js)', 'Cristi', 8, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_cont_bono, 'Review BGN + ajustări', 'BGN', 2, 'todo', 'Review', '2026-05-04', 9),
  (p_cont_bono, 'Deploy + analytics setup', 'Prodi', 3, 'todo', 'Implementare IT', '2026-05-04', 10);

-- ─── 6. Engine contabilitate (Prodi) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_implementare, role_review)
VALUES ('Core — Conta', 'Engine contabilitate', 'Analiză',
  'Motor central pentru înregistrări contabile și closings lunare.',
  'Prodi', 'BGN', 'Cristi')
RETURNING id INTO p_engine;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_engine, 'Research Saga, SmartBill, alte engine-uri', 'Prodi', 5, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_engine, 'Interviu 2 contabili seniori despre pain', 'BGN', 3, 'done', 'Planificare Analiză', '2026-04-06', 1),
  (p_engine, 'Definire tipuri tranzacții suportate', 'Prodi', 4, 'inlucru', 'Execuție Analiză', '2026-04-13', 2),
  (p_engine, 'Data model preliminar', 'BGN', 4, 'inlucru', 'Execuție Analiză', '2026-04-13', 3),
  (p_engine, 'Spec validări automate închidere lunară', 'Prodi', 3, 'todo', 'Execuție Analiză', '2026-04-20', 4),
  (p_engine, 'Wireframe ecran journal entries', 'Octav', 4, 'todo', 'Design', '2026-04-20', 5),
  (p_engine, 'Calcul impact migrare din Saga', 'Prodi', 3, 'todo', 'Execuție Analiză', '2026-04-20', 6),
  (p_engine, 'POC engine cu 100 tranzacții', 'BGN', 6, 'todo', 'Implementare IT', '2026-04-27', 7),
  (p_engine, 'Benchmark performanță la 10k tranzacții', 'BGN', 4, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_engine, 'Review arhitectură cu Cristi', 'Cristi', 2, 'todo', 'Review', '2026-05-04', 9),
  (p_engine, 'Decizie build vs integrare Saga', 'Prodi', 2, 'todo', 'Review', '2026-05-04', 10);

-- ─── 7. Salarizare (Cristi) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_implementare, role_review)
VALUES ('Core — Conta', 'Salarizare', 'Analiză',
  'Modul salarizare cu calcul automat taxe și declarații.',
  'Cristi', 'Prodi', 'BGN')
RETURNING id INTO p_salarii;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_salarii, 'Research legislație actuală taxe salarii', 'Cristi', 4, 'done', 'Planificare Analiză', '2026-04-06', 0),
  (p_salarii, 'Mapare flow salarizare la 3 firme', 'Cristi', 5, 'inlucru', 'Planificare Analiză', '2026-04-13', 1),
  (p_salarii, 'Definire edge cases (concediu, bonus, etc)', 'Cristi', 4, 'todo', 'Execuție Analiză', '2026-04-13', 2),
  (p_salarii, 'Data model pentru contracte + pontaje', 'Prodi', 3, 'todo', 'Execuție Analiză', '2026-04-13', 3),
  (p_salarii, 'Wireframe ecran stat plată', 'Octav', 4, 'todo', 'Design', '2026-04-20', 4),
  (p_salarii, 'Spec export declarații (D112)', 'Cristi', 3, 'todo', 'Execuție Analiză', '2026-04-20', 5),
  (p_salarii, 'Integrare cu Revisal', 'Prodi', 5, 'todo', 'Execuție Analiză', '2026-04-20', 6),
  (p_salarii, 'Calcul taxe: algoritm + unit tests', 'Cristi', 6, 'todo', 'Implementare IT', '2026-04-27', 7),
  (p_salarii, 'POC end-to-end cu 10 salariați', 'Prodi', 5, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_salarii, 'Review cu BGN', 'BGN', 2, 'todo', 'Review', '2026-05-04', 9),
  (p_salarii, 'Document decizii + hand-off', 'Cristi', 2, 'todo', 'Review', '2026-05-04', 10);

-- ─── 8. Vertigo (ERP) (Cristi) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_design, role_implementare, role_review)
VALUES ('Core — Non-Conta', 'Vertigo (ERP)', 'Analiză',
  'Modul ERP pentru clienți care vin din zona de producție.',
  'Cristi', 'Octav', 'Prodi', 'BGN')
RETURNING id INTO p_vertigo;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_vertigo, 'Interviu 3 clienți din producție', 'Cristi', 5, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_vertigo, 'Identificare top 5 pain points', 'Cristi', 3, 'done', 'Planificare Analiză', '2026-04-06', 1),
  (p_vertigo, 'Scoping modules (stocuri, producție, BOM)', 'Prodi', 6, 'inlucru', 'Execuție Analiză', '2026-04-13', 2),
  (p_vertigo, 'Research competitor (SAP B1, Odoo)', 'Cristi', 4, 'inlucru', 'Planificare Analiză', '2026-04-13', 3),
  (p_vertigo, 'Data model stocuri + mișcări', 'Prodi', 5, 'todo', 'Execuție Analiză', '2026-04-20', 4),
  (p_vertigo, 'Wireframe 3 ecrane cheie', 'Octav', 6, 'todo', 'Design', '2026-04-20', 5),
  (p_vertigo, 'Matrix features MVP vs v2', 'Cristi', 3, 'todo', 'Execuție Analiză', '2026-04-20', 6),
  (p_vertigo, 'Hi-fi design ecran stocuri', 'Octav', 5, 'todo', 'Design', '2026-04-27', 7),
  (p_vertigo, 'POC calcul cost producție', 'Prodi', 6, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_vertigo, 'Estimare ore totale implementare', 'Cristi', 2, 'todo', 'Execuție Analiză', '2026-05-04', 9),
  (p_vertigo, 'Sign-off BGN pe scope MVP', 'BGN', 2, 'todo', 'Review', '2026-05-04', 10);

-- ─── 9. Design System (Johnny) (Octav) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_design, role_implementare, role_review)
VALUES ('Core — Non-Conta', 'Design System (Johnny)', 'Implementare',
  'Sistem de design unificat pentru toate produsele BONO.',
  'Octav', 'Octav', 'BGN', 'Sanda')
RETURNING id INTO p_design;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_design, 'Audit componente existente în app-uri', 'Octav', 6, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_design, 'Definire tokens (culori, spacing, type)', 'Octav', 5, 'done', 'Design', '2026-04-06', 1),
  (p_design, 'Librărie Figma componente v1', 'Octav', 8, 'done', 'Design', '2026-04-06', 2),
  (p_design, 'Buton + variante (10 stări)', 'Octav', 4, 'done', 'Implementare IT', '2026-04-13', 3),
  (p_design, 'Input + form components', 'Octav', 6, 'inlucru', 'Implementare IT', '2026-04-13', 4),
  (p_design, 'Modal + Overlay components', 'BGN', 4, 'inlucru', 'Implementare IT', '2026-04-13', 5),
  (p_design, 'Table + List components', 'BGN', 5, 'todo', 'Implementare IT', '2026-04-20', 6),
  (p_design, 'Navigation + Tabs', 'Octav', 4, 'todo', 'Implementare IT', '2026-04-20', 7),
  (p_design, 'Storybook setup + documentation', 'BGN', 6, 'todo', 'Implementare IT', '2026-04-27', 8),
  (p_design, 'Migrare PrioriTracker la Johnny', 'BGN', 6, 'todo', 'Implementare IT', '2026-04-27', 9),
  (p_design, 'Review Sanda + feedback', 'Sanda', 2, 'todo', 'Review', '2026-05-04', 10),
  (p_design, 'v1 public launch intern', 'Octav', 2, 'todo', 'Review', '2026-05-04', 11);

-- ─── 10. Waiting List (Octav) ───
INSERT INTO priorities (modul, name, status, description, role_owner, role_review)
VALUES ('Bono (Company)', 'Waiting List', 'Review',
  'Landing waiting list pentru lansarea BONO + CRM integration.',
  'Octav', 'BGN')
RETURNING id INTO p_waiting;

INSERT INTO tasks (priority_id, name, owner, hours, status, phase, week, sort_order) VALUES
  (p_waiting, 'Research 5 waiting list-uri de succes', 'Octav', 3, 'done', 'Planificare Analiză', '2026-03-30', 0),
  (p_waiting, 'Copy + valoare pentru waitlist', 'Sanda', 3, 'done', 'Execuție Analiză', '2026-03-30', 1),
  (p_waiting, 'Design landing cu form', 'Octav', 5, 'done', 'Design', '2026-04-06', 2),
  (p_waiting, 'Implementare form + validare email', 'Cristi', 4, 'done', 'Implementare IT', '2026-04-06', 3),
  (p_waiting, 'Integrare cu HubSpot CRM', 'Cristi', 5, 'done', 'Implementare IT', '2026-04-13', 4),
  (p_waiting, 'Email welcome + nurture sequence', 'Prodi', 4, 'inlucru', 'Execuție Analiză', '2026-04-13', 5),
  (p_waiting, 'Setup analytics (conversion rate)', 'Octav', 3, 'inlucru', 'Implementare IT', '2026-04-13', 6),
  (p_waiting, 'A/B test landing variante', 'Octav', 4, 'todo', 'Review', '2026-04-20', 7),
  (p_waiting, 'Referral program pentru waitlist', 'Prodi', 5, 'todo', 'Execuție Analiză', '2026-04-20', 8),
  (p_waiting, 'Dashboard metrici (signups/săpt)', 'Cristi', 3, 'todo', 'Implementare IT', '2026-04-27', 9),
  (p_waiting, 'Review BGN + optimizări finale', 'BGN', 2, 'todo', 'Review', '2026-05-04', 10);

-- ─── Comentarii sample pentru 2 priorități ───
INSERT INTO comments (priority_id, author, body) VALUES
  (p_efactura, 'Sanda', 'Cristi, ai verificat dacă SPV are rate limit pe IP? Am avut probleme acum câteva luni.'),
  (p_efactura, 'Cristi', 'Da, 1000 req/zi per firmă. Tot nu e ideal dar e gestionabil cu cache agresiv.'),
  (p_efactura, 'BGN', 'Super. Să vedem dacă putem prelua async de pe noapte.'),
  (p_dublin, 'Prodi', 'Am impresia că ar trebui să ne uităm și la Causal + Runway pentru benchmark.'),
  (p_dublin, 'BGN', 'Bună idee, adaug în task-ul de benchmark.');

-- ─── Link-uri sample ───
INSERT INTO links (priority_id, url, label) VALUES
  (p_efactura, 'https://static.anaf.ro/static/10/Anaf/Informatii_R/API/efactura.pdf', 'Documentație SPV'),
  (p_dublin, 'https://www.xero.com/us/features/', 'Xero feature list'),
  (p_ai, 'https://arxiv.org/abs/2305.13245', 'Paper LLM extraction invoices'),
  (p_design, 'https://www.figma.com/design/johnny', 'Figma Library Johnny');

END $$;

-- Verificare rapidă
SELECT
  (SELECT COUNT(*) FROM priorities) AS priorities,
  (SELECT COUNT(*) FROM tasks) AS tasks,
  (SELECT COUNT(*) FROM comments) AS comments,
  (SELECT COUNT(*) FROM links) AS links;
