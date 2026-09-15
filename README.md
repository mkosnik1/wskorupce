# wskorupce.pl

Statyczna strona typu landing page i link-in-bio dla pracowni artystycznej wskorupce.pl.

## GitHub Pages

Strona publikuje się automatycznie z katalogu `dist` po każdym pushu do gałęzi `main`. W ustawieniach repozytorium wybierz `Settings → Pages → Source: GitHub Actions`, jeśli opcja nie ustawi się automatycznie.

## Lokalny podgląd

Otwórz plik `dist/index.html` w przeglądarce lub uruchom dowolny prosty serwer HTTP w katalogu `dist`.

## Portfolio

Galeria jest częścią strony i nie wymaga tokenu ani połączenia z API Instagrama. Dzięki temu jej układ, podpisy i jakość zdjęć pozostają pod pełną kontrolą.

Aby dodać pracę, skopiuj zoptymalizowane zdjęcie do `dist/assets`, a następnie dodaj kolejną kartę `.gallery-card` w `dist/index.html`. Instagram pozostaje linkiem do bieżących kadrów z pracowni i kanałem kontaktu.
