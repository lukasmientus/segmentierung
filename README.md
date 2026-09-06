# regelsegmentierung

Statische Webanwendung für regelbasierte Textsegmentierung, Wortzählung und Stapelverarbeitung von TXT-Dateien.

## Funktionen

- Einzeltexte nach auswählbaren Regeln segmentieren
- mehrere TXT-Dateien lokal im Browser verarbeiten
- Ergebnisse als TXT oder CSV exportieren
- Wortzählung mit CSV-Export
- keine serverseitige Verarbeitung und kein Upload von Textinhalten

## Branding

- Fakultätsfarbe FNW: `#05A535`
- bevorzugte Webschrift: `Barlow`
- offizielles FNW-Signet der Otto-von-Guericke-Universität Magdeburg
- Logo-Link: https://www.physikdidaktik.ovgu.de/

Die Anwendungslogik, Textverarbeitung und Exporte laufen vollständig clientseitig. Das offizielle FNW-Signet wird aus der offiziellen Corporate-Design-Quelle der OVGU geladen; falls diese Ressource nicht erreichbar ist, zeigt die Seite einen lokalen Text-Fallback. Die CSS-Schriftfamilie setzt `Barlow` an erste Stelle und fällt auf lokal verfügbare Systemschriften zurück, wenn Barlow auf dem Endgerät nicht installiert ist.

## GitHub Pages

Repository: `segmentierung`

1. Den Inhalt dieses Ordners in die oberste Ebene des GitHub-Repositories `segmentierung` hochladen.
2. Auf GitHub `Settings` → `Pages` öffnen.
3. Unter `Build and deployment` als Quelle `Deploy from a branch` wählen.
4. Branch `main` und Ordner `/(root)` auswählen und speichern.
5. Nach der Veröffentlichung ist die Seite normalerweise unter `https://<github-benutzername>.github.io/segmentierung/` erreichbar.

Alle internen Pfade sind relativ angelegt und funktionieren daher sowohl auf GitHub Pages als auch bei einer lokalen Bereitstellung über einen einfachen statischen Webserver.

## Entwicklung

Linus von Au und Lukas Mientus

## Lizenz

Für dieses Repository wurde bewusst keine Lizenzdatei hinzugefügt.
