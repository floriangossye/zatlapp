# Zatlapp

Een kleine, speelse webapp voor spelletjes aan tafel. De eerste speelbare versie bevat een spellenhub, een lokale spelerslijst en **3-man** met twee digitale of echte dobbelstenen. De zachte kleuren en het zwevende dobbeleiland zijn geïnspireerd op de aangeleverde game-artreferentie. Alle illustraties zijn eigen SVG/CSS; er zijn geen externe beeldassets.

## Lokaal spelen

Geen installatie of build nodig. Met Python 3 en Node.js 22 of nieuwer:

```sh
python3 -m http.server 5173 --directory public
# Open http://localhost:5173
npm test
```

`public/` is de volledige website. De app gebruikt native JavaScript-modules, HTML en CSS. De pure spelregels staan in `public/game.js`; de browser-interface in `public/app.js`.

## Cloudflare — persoonlijk account Florian Gossye

**Gebruik het persoonlijke Cloudflare-account van Florian Gossye, niet Kzalagonemmen.** Repository: `floriangossye/zatlapp`. Productiedomein: `zatlapp.be` (pas activeren na controle van het juiste account en de bestaande DNS).

### Workers met GitHub-koppeling

1. Open Workers & Pages in het persoonlijke Cloudflare-account.
2. Maak een Worker aan via **Import a repository** / **Connect Git** en kies `floriangossye/zatlapp`.
3. Productiebranch: `main`. Root: `/`. Geen build command nodig.
4. Deploy command: `npx wrangler deploy`. De meegeleverde `wrangler.jsonc` publiceert `public/` als statische assets. Er is geen Worker-code, D1, R2, secret of backend nodig.
5. Test eerst de toegewezen `workers.dev`-URL. Koppel daarna `zatlapp.be` via de custom-domain-instelling van de Worker. Controleer bestaande records voordat je DNS aanpast.
6. Pushes naar `main` publiceren daarna automatisch via Workers Builds.

Als alternatief kan Cloudflare Pages dezelfde repo hosten: framework **None**, geen build command, outputmap `public`, productiebranch `main`. Gebruik één hostingroute, niet beide.

De hosting is nog niet geactiveerd vanuit deze checkout: aanmelden en het juiste persoonlijke Cloudflare-account verifiëren zijn nodig. Geen tokens opnemen in GitHub, broncode of README.

## Regels in deze POC

| Worp | Opdracht |
| --- | --- |
| Dubbel | Aantal ogen van één dobbelsteen uitdelen; 4+4 = 4 slokken |
| 2–1 of 1–2 | Gooier wordt 3-man |
| Bestaande 3-man gooit opnieuw 2–1 | Dubbel 3-man, maximaal ×2 |
| Totaal 5 | Vorige speler neemt 1 slok |
| Totaal 7 | Gooier neemt 1 slok |
| Totaal 9 | Volgende speler neemt 1 slok |
| Minstens één dobbelsteen toont 3, of totaal deelbaar door 3 | 3-man neemt 1 slok, dubbel 3-man neemt 2 |

Expliciete interpretaties om met jullie te verfijnen:

- De 3-man-regel telt één keer per worp, ook als meerdere voorwaarden overeenkomen (3+3 = één 3-man-trigger).
- Andere opdrachten stapelen: 3+6 geeft de volgende speler 1 slok én de 3-man zijn opdracht.
- 2–1 wijst eerst de rol toe, waarna de nieuwe 3-man ook de bijhorende slok krijgt.
- Een andere gooier met 2–1 neemt de rol over; de factor start opnieuw op ×1.
- Dubbel blijft ×2. Geen driedubbele of onbeperkte vermenigvuldiging.
- Na elke worp is de volgende speler aan de beurt, ook na dubbel. Vorige/volgende volgen de spelersvolgorde.
- De app wijst geen ontvanger voor uitgedeelde slokken aan: dat kiezen jullie zelf.

## Lokale gegevens

Namen en de huidige partij worden bewaard onder `zatlapp.v1` in `localStorage`, op één toestel/browser. Er zijn geen accounts, analytics of serverrequests voor spelgegevens. Lettertypes worden geladen via Google Fonts, met systeemfonts als fallback. Geblokkeerde opslag geeft een melding en laat spelen in het geheugen toe. Een wijziging in namen of spelersvolgorde begint een nieuwe partij. Nieuwe partij wist alleen worpen en rolstatus; spelers blijven bewaard. Worp terug bewaart maximaal 50 stappen in het geheugen, tot herladen. Namen worden als tekst ontsmet voor weergave.

## Verificatie

`npm test` controleert alle 36 worpen, rolwissels en verdubbeling, overlappende regels, beurtvolgorde, ongeldige invoer en willekeurige dobbelwaarden. Browsercontrole omvat spelers toevoegen, handmatige worpen, 3-man-toewijzing, terugdraaien, herladen en hervatten. De mobiele layout is gecontroleerd in een browserframe van 390 pixels breed; nog te testen op een fysiek toestel.

Nieuwe webapp vanaf een schone start. De oude Flutter-bestanden en branches maken geen deel uit van deze basis.

Officiële configuratiereferenties: [statische assets](https://developers.cloudflare.com/workers/static-assets/binding/) en [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).
