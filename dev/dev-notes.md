FIXME
W2023.09.13: tileDim?
double quotes vs single quotes

Analyse: Werke von anderen analysieren, erklären und parametrisieren.

Zorn palette

- Werke für "Wiederholungen" adaptieren.
- Interruptions: fieldset "Wiederholungen" wie bei W2023.09.21. 50 x 50. Pro
  Kachel: Skalierung 125%; eine Linie in zufälligem Winkel int(random(12)) * 30
  Grad. Zufällig versetzt in x, y.

Dialog für Tastaturkürzel, wie bei innerspace.

Techniken:
- visualize brewer palettes
- scale(0, -1), scale(-1, 0) etc. to flip vertically, horizontally etc.
- https://en.wikipedia.org/wiki/HSL_and_HSV (HSV == HSB)
- is black alpha 127 the same as 777?

rough.js verwendet Math.random(). Damit das Werk reproduzierbar bleibt:
Math.random = random;   // use the p5.js random() function

matter.js, tumbling squares. black, to create white spaces in-between.

sharded polygons, also black to create white spaces in-between.

movers create rectangular lines. different colors where they intersect.

draw several permutations on the same canvas, one per tile:
arr.permutations().shuffle().slice(...)

Schotter:
- randomness function
- 0 <= x <= 1, 0 <= y <= 1.
- f(x,y) =
- y (increasing towards the bottom)
- x (increasing towards the right)
- 1 - y (increasing towards the top)
- 1 - x (increasing towards the left)
- (x + y) / 2 (increasing towards the lower right)
- increasing towards the center, zero in the corners
- increasing towards the corners, zero in the center
- also see file:///Users/marcel/www/creative-coding-3rd/sketches/takawo--221023a/index.html Convert the rectangular coordinates (x, y) to the polar coordinates (r, a) and use them in these formulas.

permuted values could be the lengths of vertical bars, or the positions of notches in a 3x3 subsquare.

Tetris shapes; each of the four squares in a shape can be filled or stroked. Random rotation, color etc.

Unmonotone fractals:
T-square fractal
Cantor square fractal

Rectangular to polar coordinates:
x = r * cos(a)
y = r * sin(a)

Polar to rectangular coordinates:
r = sqrt(x ** 2 + y ** 2);
a = atan (y / x)

https://www.skillshare.com/en/blog/35-geometric-patterns-and-how-to-design-your-own/
https://square-the-circle.com/

Motto Brot
Westbahnhof: UG Heberer, EG Ströck, OG Backwerk
Hauptbahnhof
Bänke bei der Kirche am Schulhof 1
Bänke in der TU, Getreidemarkt
Bank in der Reitschulgasse, beim Taxi-Standplatz
Metalab (aber €30 pro Monat ist zuviel)
Go7
Museumsquartier
Uni Wien Arkadenhof
MAK-Garten https://wien.orf.at/stories/3207130/
Schillerpark, auch auf den Stufen der Statue

Hypnagogie und Kreativität

matter.js
https://brm.io/matter-js/
also http://palmerpaul.com/p5-matter/ ?

:%w !pbcopy
:r !pbpaste
.\{-}

/* Vera Molnar's state machine for colors with three states and random
 * transitions.
 *
 * Assume the a circle with states in the order 'R', 'G' and 'B'.
 * From each state, there is a 70% to go to the next state, a 15% chance
 * to go to the previous state and a 15% chance to stay in the same state.
 */
function* colorStateMachine() {
    state = 'R';
    while (1) {
        let r = Math.random();
        if (state == 'R') {
            if (r < 0.7) state = 'G'
            else if (r < 0.85) state = 'B'
            else state = 'R';
        } else if (state == 'G') {
            if (r < 0.7) state = 'B'
            else if (r < 0.85) state = 'R'
            else state = 'G';
        } else if (state == 'B') {
            if (r < 0.7) state = 'R'
            else if (r < 0.85) state = 'G'
            else state = 'B';
        }
        yield state;
    }
}

Bitwise operations
AND: &, &=
NOT: ~
OR: |, |=
XOR: ^, ^=
bit shifting >>, <<

W2022.09.01:
neue formen: viertelkreis, halbkreis, dreiviertelkreis
formen-checkboxen:
- deskriptive namen, nicht nummeriert
subgrid (fieldset)
- numTiles >= 0
- margin
reverb (fieldset): nacheinander kleinere, ineinander gezeichnete Quadrate
- x offset, y offset = delay
- decay (in size)
- steps = number of repetitions
- fade (transparency)

===

Statt um ein einzelnes Bild geht es mehr um den Prozeß, der die Bilder generiert. Die einzelnen generierten Bilder sind nicht so wichtig wie die Art, durch die der Algorithmus und die Parameter beeinflußen, welche Art von Bildern entstehen.

Generative Gestaltung ist geprägt durch glückliche Zufälle. Ich lasse mich von den Zeichenmaschinen überraschen. Es ist eine Art kuratierte Zufälligkeit; ich kann das Werk viele Male neu generieren und die ansprechendsten Variationen auswählen.

Wer ist kreativ? Ist es der Programmierer des Algorithmus oder ist es die Maschine, die den Algorithmus ausführt?  Das erinnert mich an die Anleitungen zu den Wandzeichnungen von Sol LeWitt. Es ist eine Art Kunstkalkül.

Ich nehme mich eine Ebene zurück; nicht ich bestimme, wie das Bild aussieht, sondern der Algorithmus, den ich schreibe.

Den Zufall muß man dabei erst gezielt dazuprogrammieren. Es st nicht so wie bei analoger Kunst, wo man oft gezielt versucht, den Zufall zu vermeiden.

Den Algorithmus zu finden ist für mich ein iterativer Prozeß. Ich weiß am Anfang nicht wirklich, was dabei herauskommt, sondern taste mich Schritt für Schritt vorwärts. Oft überrascht mich, was dabei herauskommt.

---

Je mehr Parameter ein Werk hat, umso vielfältiger ist die Bandbreite der dadurch erzeugten Bilder.

---

Was ist die treibende Kraft hinter meinen Arbeiten? Ich würde sagen, es ist eine lineare Ausrichtung, Linien und Quadrate. In der Natur gibt es keine lineare Ausrichtung.

---

Ich konzentriere mich auf ein einziges Werkzeug; in diesem Fall ist es p5.js und im weiteren Sinne JavaScript. Ich möchte kein Hansdampf in allen Gassen sein. Ich schränke mich bewusst ein, damit ich mich über Monate oder Jahre hinweg auf eine Technologie konzentrieren und mich mit diesen Werkzeugen vertraut machen kann.

---

Einer der attraktiven Aspekte der generativen Gestaltung ist, daß ich mein Studio immer bei mir haben kann. Ich brauche nur einen Laptop. Allerdings bedarf es auch eines Raumes, in den man sich zurückziehen kann und in dem man kreativ inspiriert werden kann.

---

Das Internet ist der natürliche Lebensraum der digitalen Kunst. Es ist nicht nötig, selbst "dort" sein zu müssen, um die Nuancen wie Größe, Farben und Textur zu erleben. Um digitale Kunst anzusehen, muß man nicht in verschiedene Städte reisen, um sie in einer Galerie zu sehen.

===

Beschreibe meinen Arbeitsfluß: Vim, git usw.

- shapes that sit on points on a path (circle, Ulam spiral etc.) or on grid positions
- also on a path generated by the superformula?

- space-filling curves
- Cellular automata. Rules: Game of Life etc. Visualization: Number of living neighbors, age of the living cell. As parameters for colors and sizes of shapes. Cf. “Generative Art” (2011) Kapitel 7.
- Strips in sequential splits: n-th prime number, n-th Fibonacci number, n-th power of two etc. Cf. James Siena, 2-256, 1-1024 etc.)
- displayed shapes are state machines. idea via sasj-continuum-parade-2021.js
- Unicode 2500-25FF; 1D300-1D35F (Tai Xuan Jing)
- Sequenzen (vgl. Hofstadter)
- The On-Line Encyclopedia of Integer Sequences https://oeis.org/
- Parkettierung (siehe "Mathewelten - Rätselhafte Fünfecke" und https://de.wikipedia.org/wiki/Parkettierung )
- Game of Life

===

Generative Gestaltung
Algorithmische Kunst
Kreatives Programmieren
Digitale Kunst
Creative Coding
p5.js

===

Facebook-Gruppe: danubedataflow
Instagram: danubedataflow

===

Warum mache ich das? Ist das nur geometrische und mathematische Spielerei?

Japanische Ästhetik.
- leave things to be appreciated, uncluttered. the silence between notes is most important. cf. architecture. find your own way.
- Gerade Linien, Schlichtheit. Unscheinbar, unaufgeregt. kühl, Understatement
- hält die Hektik des Alltages auf Distanz.
- Elemente der traditionellen japanischen Architektur.

Victor Vasarely, Yellow Manifest

Kanji sind auch geometrisch, basieren auf Funktion und Bedeutung. Eine "Formensprache" im wahrsten Sinne.

https://www.artsy.net/artist/vera-molnar-1

In Anlehnung an Gerhard Richter
sechs zufällige Zahlen bedeutungslos
aber wenn es die richtigen Lottozahlen sind, bekommen sie bedeutung.
Selektive Wahrnehmung
=> Zufâllige Linien: wenn ihre Anordnung ein uns bekanntes Muster ergibt - ein Rechteck, oder eine spitze Klammer etwa, messen wir dem Bedeutung zu. Aber diese Anordnung ist genauso zufällig wie jede andere.
Die Bedeutung entsteht für uns aus dem, was zwischen den Linien ist. Aber das ist eine menschliche Wahrnehmung, keine Aussage der Maschine.
Vgl. Rorschach-Test
Vgl. Räume sind das, was zwischen Wänden ist.

ddf-edit -i W2022.12.13 => vim .../W2022.12.13/sketch.js
-i: edit index.html
-a: edit all files: index.html, sketch.js
default: edit sketch.js

Druckansicht:
- höhere Auflösung
- html canvas 300dpi?
- volle Breite
- pixelDensity?

save canvas as STE20xx.xx.xx.png

workflow for thumbnails
import thumbnail: take such a png, resize to 200x200, move to corresponding directory as thunbnail.png
Neuer thumbnail:
convert -size 200x200 xc:#777777 thumbnail.png

===

Serien-Galerie:

jedes Bild ist vorgeneriert aus einer URL und als png gespeichert, mit thumbnail.
Eine Galerie pro Werk? Bilder sind aufsteigend numeriert.

===

Idee: jedesmal, bevor ich eine Linie zeichne, rotiere und skaliere ich die Leinwand zufällig.

vertikale streifen, in f(n) balken unterteilt. vgl siena 2^n, aber auch mit anderen sequenzen

gitter von m x n spline-Punkten
punkte zufällig verschieben
in mehreren schritten

„Generative Art“ Kapitel 7
GOL isa CA
classes for the CA and for Cell
also have cell age
cell also knows the number of live neighbours
run() calls a callback, passing the current cell
different works will interpret the cell differently.
e.g. as length, rotation, size, color etc

===

strange attractors

W2022.11.19: auch 'Winkel auf dem Farbkreis' statt fixer Farben? Auch HSV?

don't call noStroke() if you afterward call stroke().
ack -l -w stroke src/**/sketch.js | xargs ack noStroke

Fieldset für numTilesX und numTilesY

W2023.10.03:
Hier: zwei ineinander verschachtelte Quadrate, aber können mehr sein.
Generalisiert:
Verschachtelungen: Anzahl (von-bis); Skalierung pro Ebene (von-bis)
Gefüllt oder nur Umriß
zufälliger Versatz pro Ebene

===

Verallgemeinern
- Unterteilungen (subdivisions) (Chance; max. Tiefe)
    - z.B. W2023.10.02 ist unterteilt (Wahrscheinlichkeit = 100%; Tiefe = 1; Unterteilungen pro Ebene = 3 bis 5; kein Rand)
    - Nur Kacheln an den Enden des Unterteilungs-Baumes können skaliert sein oder einen Rand haben; unterteilte Flächen nicht
    - Wahrscheinlichkeit, daß eine Fläche unterteilt wird (in %)
    - Anzahl der Unterteilungen pro Ebene (von-bis)
    - maximuale Unterteilungstiefe
- Kacheln:
    - Rand (ja/nein; Strichstärke)
    - Rotation (von-bis)
    - Skalierung der Kachel (x, y, je von-bis)
    - Verschiebung (x, y, je von-bis) (= “Versatz”)
    - Scherung (shear) (x, y, je von-bis)

OOP: Werke sind Klassen.
JSDoc3 -> Dokumentation + Codeansicht für Site generieren

Der Benutzer kann gewisse Parameter einrasten / feststellen, damit sie bei Zufallswerten nicht verändert werden. Unterklassen von Werken können gewisse Parameter der Oberklassen fixieren.

Unaufgeregt; ich hab nicht das Gefühl, daß ich ständig mehr machen müßte wie das beim Go der Fall ist, selbst wenn ich dort dann eh nichts gemacht hab. Ohne schlechtes Gewissen lesen, spazieren gehen, Filme anschauen, kochen oder Dinge im Haushalt machen. Niemand, der aktiv gegen mich arbeitet, wie das bei einer Go-Partie der Fall ist. Und programmieren macht mir mehr Spaß als Go, und ich bin auch besser darin. Und ich habe nicht das Gefühl, vor einer unbewältigbaren Aufgabe zu stehen.

Beschränkt auf wenige Formen. Reduzierte Farbpalette. Prozeß - wer ist der Künstler? Manuell kann man einige Variationen eines Bildes machen. Der Computer kann beliebig viele Variationen machen; dabei kann durch Zufall etwas entstehen, auf das man selbst nicht gekommen wäre (siehe Vera Molnár über Zufall und Intuition).

===

createCanvas(...).parent("sketch");

convert ~/Downloads/canvas.png -resize 200x200 thumbnail.png

https://codepen.io/DonKarlssonSan
https://codepen.io/DonKarlssonSan/post/random-walk

===

Voreinstellungen mit zufälligen Mathematiksymbolen
https://www.compart.com/en/unicode/block/U+2200
Ist aber nur sinnvoll bei einem Werk, das durch viele Parameter besonders abwechslungsreiche Bilder erzeugt.
Vgl. https://github.com/doersino/uji

===

makeSelectBlendMode() uses p5.js's constants, but in the i18n dicts we
need to use the values of these constants.

- ADD == lighter
- BLEND == source-over
- BURN == color-burn
- DARKEST == darken
- DIFFERENCE == difference
- DODGE == color-dodge
- EXCLUSION == exclusion
- HARD_LIGHT == hard-light
- LIGHTEST == lighten
- MULTIPLY == multiply
- OVERLAY == overlay
- REMOVE == destination-out
- REPLACE == copy
- SCREEN == screen
- SOFT_LIGHT == soft-light

===

Vera Molnár

"Ich bin Malerin. Was mich umtreibt und schon immer fasziniert hat, ist die Kunst, Formen und Farben zu kombinieren, indem ich sie auf einer Fläche anordne. Die Grundelemente meiner Arbeit sind die einfachsten geometrischen Formen: Quadrate, Rechtecke. Ich war schon immer fasziniert von der Schönheit, der kristallinen Reinheit bestimmter Formen, bestimmter elementarer Konstruktionen."

===

math art

10:50 500 ml Apfel-Karottensaft

nestedLoops(
    [0, 1, 80],
    [0, 1, 80],
    function (u, v) { … })

poo callback
split args into scalars and arrays
split arrays into first and remaining

if first array {
    for (element in spec) {
        nestedLoops(scalars, element, remaining arrays, callback)
    }
} else {
    callback(scalars)
}

===

danubedataflow

Max Bense
Vera Molnar
Herbert W. Franke
Manfred Mohr
A. Michael Noll
Frieder Nake
Georg Nees

===

Matrix multiplication (Frieder Nake)
https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript

===

existenzermittlung

https://www.slideshare.net/jowe/slides-long-talk-bordeaux2017

http://digitalart.joachim-wedekind.de/
https://www.slideshare.net/jowe/slides-long-talk-bordeaux2017

https://zkm.de/de/werk/matritzenmultiplikation-serie-32
http://dada.compart-bremen.de/item/agent/68

http://dada.compart-bremen.de/item/artwork/4
http://dada.compart-bremen.de/item/publication/233
http://dada.compart-bremen.de/item/artwork/381
http://dada.compart-bremen.de/item/artwork/648
http://dada.compart-bremen.de/item/artwork/649
http://dada.compart-bremen.de/item/artwork/1157
https://www.slideshare.net/jowe/kunst-und-computer

makeSchotterGrid() has a callback that is called with coordinates and an angle; the callback then draws a tile.
In the simplest form, the callback just draws a rectangle, filled or empty
The rectangle could be drawn with a black fill and an alpha corresponding to y.
The rectangle could be drawn with a fill whose color is determined by a palette. Choose randomly from the palette, or by iterating )modulo) through the palette.

===

W2023.09.22:
- redo like W2024.03.03
- add tiling; each tile gets its own sketch

W2022.10.22:
- use W2024.03.03\s randomPath()


math.js
array.js
dom.js = makeSlider…, SelectControl…, makeDiv, makeLabel, setIntlAttributes etc.

angleMode(DEGREES);
rectMode(CORNERS);

sin(), cos(): Math.sin(radians), Math.cos(radians)

random(array) -> array.randomElement()
random(n) -> random() *n
random(m, n) -> m + random() * (n - m)

circle => arc
push() => ctx.save()
pop() => ctx.restore()
stroke(color) => ctx.strokeStyle = color
scale
translate
rotate
shear

ack 'blendMode\(BLEND\)' => ctx,globalCompositeOperation = 'source-over'
add missing blend modes? 'xor'

remove "p5.js" from <meta> in lib/head, package.json, deps, licences etc.

utils: circle(): fill or stroke? note third parameter is radius vs p5.js's diameter

===

James Juszczyk
Robert Swain

