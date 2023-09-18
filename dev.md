Zorn palette

===

Analyse: Werke von anderen analysieren, erklären und parametrisieren.

https://en.wikipedia.org/wiki/HSL_and_HSV
(HSV == HSB)

Tiled sketches

Adapt existing sketches to use a (sub)grid so a sketch can show multiple at the same time. Use this for drawings that are not in a grid already and that have randomness.

for (each tile) {
  let len = tile length;
  translate to the tile's upper left corner;
  push();

  // add margin whose center is the tile's center
  translate(len / 2, len / 2);
  scale(0.9);
  translate(-len / 2, -len / 2);

  drawTile(len);
  pop();
}

drawTile(len) draws the shapes assuming (0,0) is the upper left and the tile length is len.


popup for keyboard shortcuts. Icon like for innerspace

is black alpha 127 the same as 777?

Techniken: visualize brewer palettes

technique: scale(0, -1), scale(-1, 0) etc. to flip vertically, horizontally etc.

rough.js verwendet Math.random(). Damit die Skizze reproduzierbar bleibt:
Math.random = random;   // use the p5.js random() function

matter.js, tumbling squares. black, to create white spaces in-between.

sharded polygons, also black to create white spaces in-between.

movers create rectangular lines. different colors where they intersect.

draw several permutations on the same canvas, one per tile:
arr.permutations().shuffle().slice(...)


Schotter:
randomness function
0 <= x <= 1, 0 <= y <= 1.
f(x,y) =
y (increasing towards the bottom)
x (increasing towards the right)
1 - y (increasing towards the top)
1 - x (increasing towards the left)
(x + y) / 2 (increasing towards the lower right)
increasing towards the center, zero in the corners
increasing towards the corners, zero in the center
also see file:///Users/marcel/www/creative-coding-3rd/sketches/takawo--221023a/index.html Convert the rectangular coordinates (x, y) to the polar coordinates (r, a) and use them in these formulas.

permuted values could be the lengths of vertical bars, or the positions of notches in a 3x3 subsquare.


Tetris shapes; each of the four squares in a shape can be filled or stroked. Random rotation, color etc.


Unmonotone fractals:
T-square fractal
Cantor square fractal




Rectangular to polar coordinates: x = r * cos(a)
y = r * sin(a)

Polar to rectangular coordinates:
r = sqrt(x ** 2 + y ** 2)
a = atan (y / x)

ack -w cos src


My self-imposed restrictions
how to use (keyboard shortcuts etc.)


add the ability to create a square canvas of arbitrary size, for wallpapers, prints etc. using pixelDensity() ?


https://www.skillshare.com/en/blog/35-geometric-patterns-and-how-to-design-your-own/
https://square-the-circle.com/



Kaffeehäuser und Konditoreien:
- Cafe Caspar
- Cafe Jelinek
- Cafe Sperl
- Cafe Bräunerhof
- Cafe Dommayer
- Cafe Anno
- Kleines Cafe (Franziskanerplatz)
- Paremi
- Kaffee Alt Wien
- Mama Liu's Cafe (vormals "Fain")
Andere Lokale:
- Hotel Schani
- Fladerei
- Futuregarden (Schadekgasse)
- Westbahnhof: UG Heberer, EG Ströck, OG Backwerk
- Hauptbahnhof
Mensen:
- Akademie der bildenden Künste, Mensa
- TU-Mensa
Bänke:
- Bänke bei der Kirche am Schulhof 1
- Bänke in der TU, Getreidemarkt
- Bank in der Reitschulgasse, beim Taxi-Standplatz
Metalab (aber €30 pro Monat ist zuviel)
Go7
Museumsquartier
Uni Wien Arkadenhof
MAK-Garten https://wien.orf.at/stories/3207130/
Schillerpark, auch auf den Stufen der Statue

Praha, NYC

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


S2022.09.01:
random size: min="0.5" max="2" step="0.5" (slider with two handles). dann kleines quadrat nicht mehr notwendig
random transparency: 0 - 100% (slider with two handles)
neue formen: viertelkreis, halbkreis, dreiviertelkreis
formen-checkboxen: deskriptive namen, nicht nummeriert
margin
subgrid (fieldset)
- numTiles >= 0
- margin
reverb (fieldset): successively smaller squares drawn inside each other
- x offset, y offset = delay
- decay (in size)
- steps = number of repetitions
- fade (transparency)
fill
- type: none, solid, other textures
stroke (fieldset)
- type: none, solid, dashed etc.
- weight
Andere Sets von Formen: z.B. Sets von Unicode-Zeichen



===

Generative Gestaltung ist geprägt durch glückliche Zufälle. Ich lasse mich von den Zeichenmaschinen überraschen. Es ist eine Art kuratierte Zufälligkeit; ich kann die Skizze viele Male neu generieren und die ansprechendsten Variationen auswählen.

Was ist die treibende Kraft hinter meinen Arbeiten? Ich würde sagen, es ist eine lineare Ausrichtung, Linien und Quadrate. In der Natur gibt es keine lineare Ausrichtung.

Wer ist kreativ? Ist es der Programmierer des Algorithmus oder ist es die Maschine, die den Algorithmus ausführt?  Das erinnert mich an die Anleitungen zu den Wandzeichnungen von Sol LeWitt. Es ist eine Art Kunstkalkül.

Ich konzentriere mich auf ein einziges Werkzeug; in diesem Fall ist es p5.js und im weiteren Sinne JavaScript. Ich möchte kein Hansdampf in allen Gassen sein. Ich schränke mich bewusst ein, damit ich mich über Monate oder Jahre hinweg auf eine Technologie konzentrieren und mich mit diesen Werkzeugen vertraut machen kann.

Einer der attraktiven Aspekte der generativen Gestaltung ist, daß ich mein Studio immer bei mir haben kann. Ich brauche nur einen Laptop. Allerdings bedarf es auch eines Raumes, in den man sich zurückziehen kann und in dem man kreativ inspiriert werden kann.

Meine parametrisierten Werke ermöglichen eine kontrolliertere Gestaltung als man sie mit einem Prompt für eine Text-zu-Bild-KI wie Stable Diffusion oder Midjourney erreichen kann.

In der zweiten Hälfte des 19. Jahrhunderts wurde mit Hilfe der Wissenschaft eine Realität jenseits der sichtbaren Welt entdeckt. Elektrizität, Gammastrahlen, Röntgenstrahlen, radioaktive Strahlen, Radio, Telephon, Photographie, Ultraschall, Bakterien unter einem Mikroskop, Elektronen, Psychologie usw. Die sichtbare Welt stellte sich als lediglich dünner Streifen der wahren Realität heraus. War das erst der Anfang des Weges, das Göttliche zu quantifizieren, zu entmystifizieren und es sich dienstbar zu machen? Mit Hilfe von Ouija-Boards ("Tischerlrücken") mit Verstorbenen, Geistern und Lichtwesen kommunizieren? Siehe Hilmar af Klint und ihre Gruppe. Anfang der abstrakten Malerei; verwurzelt in der Theosophie. Spirituelle Bewegungen; esoterisch.

Die Wissenschaft gibt uns Karten und Diagramme, mit denen wir die Realität besser verstehen können. Manche Künstler des späten 19. Jahrhunderts wollten die unsichtbaren Kräfte auf andere Arten sichtbar machen.

Eine visuelle Sprache, um die Kräfte zu beschreiben, die die Welt vorantreiben. Nicht eine alternative Welt erschaffen, sondern jenseits der sichtbaren Formen schauen?

Früher war alle Kunst gegenständlich: Ein Stilleben, Menschen, Natur (Wiese, Blumen, Bäume, Berge usw.). Immer weiter vereinfacht (Kandinsky, Malewitsch). Auch Musik und Philosophie wurden abstrakter.

Heute blicken wir hundert oder hundertfünfzig Jahre zurück und sehen, wie vereinfacht, überoptimistisch und oft auch falsch die Menschen damals die Welt gesehen haben. Vermutlich wird man in fünfzig oder hundert Jahren auch so auf uns zurückblicken, wie wir erste, einfache Schritte mit KI gemacht haben.

===

describe my workflow. vim, tools etc.

===

===

Japanese aesthetic: leave things to be appreciated, uncluttered. the silence between notes is most important. cf. architecture. find your own way.

- shapes that sit on points on a path (circle, Ulam spiral etc.) or on grid positions
- also on a path generated by the superformula?

shapes can be polygons (triangles, rectangles), crosses, Unicode characters etc.

examples:
black background. the same shape on random grid points, non-overlapping.
variations:
- different grid size (x, y). could be 50 x 30 or 4 x 1 etc.
- different number of shapes
- different shapes (from a set, like square, circle, cross, plus)
- different sizes (continuous or from a set of sizes)
- overlapping in size
- multiple shapes can be in the same position
- shapes can have different colors (from a palette).
- vary the stroke weight. different sizes and different stroke weights can create the feeling of depth (bigger shapes appear to be in front, smaller shapes appear to be further back)

- space-filling curves
- Cellular automata. Rules: Game of Life etc. Visualization: Number of living neighbors, age of the living cell. As parameters for colors and sizes of shapes. Cf. “Generative Art” (2011) Kapitel 7.
- Strips in sequential splits: n-th prime number, n-th Fibonacci number, n-th power of two etc. Cf. James Siena, 2-256, 1-1024 etc.)
- displayed shapes are state machines. idea via sasj-continuum-parade-2021.js
- Unicode 2500-25FF; 1D300-1D35F (Tai Xuan Jing)

===

The Internet is digital art's natural habitat. There is no talk about "having to be there in person" to experience the nuances like size, colors and texture; what you see is what you get.

To view digital art, you don't need to travel to different cities to see it in a gallery.

Also digital art has a longevity that traditional art cannot have.

===

Generative Design
Generative Art
Algorithmic Art
Creative Coding

===

Sequenzen (vgl. Hofstadter)
Parkettierung (siehe "Mathewelten - Rätselhafte Fünfecke" und https://de.wikipedia.org/wiki/Parkettierung )
Game of Life

Facebook-Gruppe: danubedataflow
Twitter, Instagram: danubedataflow oder marcel?

===

Warum mache ich das? Ist das nur geometrische und mathematische Spielerei?

Japanische Ästhetik.
Gerade Linien, Schlichtheit. Unscheinbar, unaufgeregt. kühl, Understatement
hält die Hektik des Alltages auf Distanz.
Elemente der traditionellen japanischen Architektur.
Siehe:
- das Buch "Tokyo Style".
- Das Maki Solitaire in Düsseldorf ist inspiriert durch das Hillside West in Shibuya, auch von Maki Fumihiko

Victor Vasarely, Yellow Manifest

Kanji sind auch geometrisch, basieren auf Funktion und Bedeutung. Eine "Formensprache" im wahrsten Sinne.

===

https://www.artsy.net/artist/vera-molnar-1

===

In Anlehnung an Gerhard Richter
sechs zufällige Zahlen bedeutungslos
aber wenn es die richtigen Lottozahlen sind, bekommen sie bedeutung.
Selektive Wahrnehmung
=> Zufâllige Linien: wenn ihre Anordnung ein uns bekanntes Muster ergibt - ein Rechteck, oder eine spitze Klammer etwa, messen wir dem Bedeutung zu. Aber diese Anordnung ist genauso zufällig wie jede andere.
Die Bedeutung entsteht für uns aus dem, was zwischen den Linien ist. Aber das ist eine menschliche Wahrnehmung, keine Aussage der Maschine.
Vgl. Rorschach-Test
Vgl. Räume sind das, was zwischen Wänden ist.

===

ack -h 'makeSlider\(' | perl -pE's/^\s*//; s/.*?,.*?,\K.*//' | sort | uniq -c | sort -n
refactor?
eindeutschen

ddf-edit -i S2022.12.13 => vim .../S2022.12.13/sketch.js
-i: edit index.html
-a: edit all files: index.html, sketch.js
default: edit sketch.js

qrcode.js für print

html canvas 300dpi?

save canvas as STE20xx.xx.xx.png

workflow for thumbnails
import thumbnail: take such a png, resize to 200x200, move to corresponding directory as thunbnail.png

print css:
<form> wiederherstellen
nur nouislider ist hidden
canvas width 100%
damit form drunter ist

warum einmal makeGrid, einmal manuell?

