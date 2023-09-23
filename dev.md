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
