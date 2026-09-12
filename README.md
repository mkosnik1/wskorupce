# wskorupce.pl

Statyczna strona typu landing page i link-in-bio dla pracowni artystycznej wskorupce.pl.

## GitHub Pages

Strona publikuje się automatycznie z katalogu `dist` po każdym pushu do gałęzi `main`. W ustawieniach repozytorium wybierz `Settings → Pages → Source: GitHub Actions`, jeśli opcja nie ustawi się automatycznie.

## Lokalny podgląd

Otwórz plik `dist/index.html` w przeglądarce lub uruchom dowolny prosty serwer HTTP w katalogu `dist`.

## Synchronizacja Instagrama

Workflow `Sync Instagram posts` pobiera trzy najnowsze posty co 6 godzin. Zdjęcia są zapisywane lokalnie w `dist/assets/instagram`, więc token Instagrama nigdy nie trafia do kodu strony.

W repozytorium dodaj dwa sekrety Actions:

- `INSTAGRAM_ACCESS_TOKEN` z długoterminowym tokenem konta firmowego;
- `INSTAGRAM_USER_ID` z identyfikatorem konta Instagram Professional.

Po dodaniu sekretów uruchom workflow ręcznie w zakładce Actions. Jeśli synchronizacja nie jest skonfigurowana lub chwilowo nie działa, strona zachowa obecne zdjęcia zastępcze.
