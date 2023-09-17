ignoreControlChange:
- in utils.js ignoreControlChange is initialized with 1. When the form is done,
  it is set to 0 so controlsDidChange() will have an effect from then on.
- ignoreControlChange is necessary so form elements don't randomly call
  readControls() and updateURL() on half-empty forms, i.e. before everything is
  set up.

- if seed is given in URL, that is used. If not, a random seed is used.
- The seed that is used is shown.
-  oth the redraw button and the change-parameters-randomly button will
   generate a new seed. (Rationale: if the redraw button didn't generate a new
   seed, you couldn't get the exact same image with the shown seed because
   every time you redraw it calls random() again.
- To be able to regenerate the exact same image, copy the URL including the
  seed.

Note: For some reason the seed doesn't work with Ctrl-R (reloading a page).
Maybe updateURL() doesn't affect what Ctrl-R is doing. Best not to use Ctrl-R;
use the provided buttons (redraw, randomize controls etc.) instead.

===

Experiment 2023.04.27:
- diamond needs stricter palette
- number of tiles horizontally and vertically can be different
- skew? cf. "Bridget Riley 0000"

Zorn palette

convert -size 200x200 xc:#777777 thumbnail.png

===

Analyse: Werke von anderen analysieren, erklären und parametrisieren.


https://en.wikipedia.org/wiki/HSL_and_HSV
(HSV == HSB)

create a section that explains how to use my system yourself

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




Creative spaces / Digital Nomads
Westbahnhof: UG Heberer, EG Ströck, OG Backwerk
Hauptbahnhof
Hotel Schani
Fladerei
Cafe Caspar
Cafe Jelinek
Cafe Sperl
Cafe Bräunerhof
Cafe Dommayer
Kaffee Alt Wien
Café Anno
Futuregarden (Schadekgasse)
Metalab (€30 pro Monat)
Go7
Akademie der bildenden Künste, Mensa
Mama Liu's Cafe (früher "Fain")
Museumsquartier
Kleines Cafe (Franziskanerplatz)
Kaffee Alt Wien
Zollergasse
Uni Wien Arkadenhof
MAK-Garten https://wien.orf.at/stories/3207130/
TU-Mensa
Schillerpark, auch auf den Stufen der Statue

Praha, Manhattan
cafes, walking, art

hypnagogia -> creativity

polygon collision
https://twitter.com/andyduboc
https://github.com/bmoren/p5.collide2D/blob/master/README.md
https://gorillasun.de/blog/an-algorithm-for-polygon-intersections

matter.js
https://brm.io/matter-js/
also http://palmerpaul.com/p5-matter/ ?


:%w !pbcopy
:r !pbpaste
.\{-}


if (url.searchParams.has(variableName)) {
  value = url.searchParams.get(variableName);
}


// Vera Molnar's state machine for colors with three states and random transitions
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


S2022-008:
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




Happy accidents
Allow yourself to be surprised.
Curated randomness: You can regenerate the sketch many times and select the most pleasing ones.
Art calculus
Drawing machines

Some artists are more interested in success than in art. The art world ruled by connections and money, and those are people wanting to make a career, sidling up to art critics and and galleries and museums.
Weil ich mir durch meinem Brotberuf finanziell unabhängig bin, habe ich das nicht nötig.
I prefer to have my own separate means of living, a separate income, and be free to create art without having to bow to commercial interests.
A digital artist doesn't have to rent an extremely expensive art studio in New York. There is very little cost involved. You just need a laptop, an Internet connection and a web site, things like that. And as long as your basic needs are covered, you can concentrate on creating art.

What is the driving force behind these works? I would say it is linear alignment, lines and squares. In nature there is no linear alignment.

Who is creative? Is it the programmer of the algorithm or is it the machine that executes the algorithm?
Cf. Sol LeWitt's wall drawing instructions.

I concentrate on one single tool; in this case p5.js and, in a broader sense, JavaScript. I don't want to be a "jack of all trades, master of none". I deliberately restrict myself so I can concentrate on one technology for months or years and become settled and comfortable in those tools.

Ich studiere die Skizzen von anderen; zumeist auf https://editor.p5js.org/ . Dadurch lerne ich neue Techniken, vor allem die der Bildbearbeitung durch einfache mathematische Operationen.

describe my workflow. vim, tools etc.

The following lines are inspired by an interview that Jean-Michel Jarre gave.

When classical instruments like the piano or the violin appeared, they changed the nature of music. That same happened and is still happening today with electronic and purely digital instruments. And you can see the same in different art forms.

Technology determines the style.

In an interview from 2017 Jean-Michel Jarre said that without the "Massive" plugin by Native Instruments there probably wouldn't be the Dubstep genre. I have also heard elsewhere that some plugins had a big effect on the electronic music genres.

In generative design you can also see that with WebGL, Processing, p5.js and other tools. But we shouldn't be dependent on the software that we use for generative design.

We rely on these technologies, but you shouldn't expect too much from them. What differentiates the artists who use these technologies is how they use them.

I see my parametrised works in a similar way. Certain groups of parameters are like virtual instruments that give the work a certain "sound quality".

This is an example of how one art form - electronic music - can influence another art form - creative design.


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

Wie findet man Gleichgesinnte?
Gibt es einen Discord-Server dafür?

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
- das "Maki Solitaire"-Gebäude in Düsseldorf

Victor Vasarely, Yellow Manifest

Photographiere diese schlichte Ästhetik in der Architektur und im Design, wenn Du in Tokyo bist

Das Maki Solitaire in Düsseldorf ist inspiriert durch das Hillside West in Shibuya, auch von Maki Fumihiko

Kanji sind auch geometrisch, basieren auf Funktion und Bedeutung. Eine "Formensprache" im wahrsten Sinne.

===

stable diffusion emoji prompt
abstract geometric

===

cfg 5, 7.5, 10, 12.5
steps 20, 50, 100
🛰 🌈 🕳 abstract geometric colorful
1232822638
512x512

abstract geometric
abstract detailed geometric
abstract geometric colorful

various 3d geometric shapes floating, abstract, render, vibrant, artstation award winning

Gedanken

Einer der attraktiven Aspekte der generativen Gestaltung ist, daß ich mein Atelier immer bei mir haben kann. Ich brauche nur einen Laptop. Allerdings bedarf es auch eines Raumes, in den man sich zurückziehen kann und in dem man kreativ inspiriert werden kann.

Meine parametrisierten Werke ermöglichen eine kontrolliertere Gestaltung als man sie mit einem Prompt für eine Text-zu-Bild-KI wie Stable Diffusion oder Midjourney erreichen kann.

In der zweiten Hälfte des 19. Jahrhunderts wurde mit Hilfe der Wissenschaft eine Realität jenseits der sichtbaren Welt entdeckt. Elektrizität, Gammastrahlen, Röntgenstrahlen, radioaktive Strahlen, Radio, Telephon, Photographie, Ultraschall, Bakterien unter einem Mikroskop, Elektronen, Psychologie usw. Die sichtbare Welt stellte sich als lediglich dünner Streifen der wahren Realität heraus. War das erst der Anfang des Weges, das Göttliche zu quantifizieren, zu entmystifizieren und es sich dienstbar zu machen? Mit Hilfe von Ouija-Boards ("Tischerlrücken") mit Verstorbenen, Geistern und Lichtwesen kommunizieren? Siehe Hilmar af Klint und ihre Gruppe. Anfang der abstrakten Malerei; verwurzelt in der Theosophie. Spirituelle Bewegungen; esoterisch.

Die Wissenschaft gibt uns Karten und Diagramme, mit denen wir die Realität besser verstehen können. Manche Künstler des späten 19. Jahrhunderts wollten die unsichtbaren Kräfte auf andere Arten sichtbar machen.

Eine visuelle Sprache, um die Kräfte zu beschreiben, die die Welt vorantreiben. Nicht eine alternative Welt erschaffen, sondern jenseits der sichtbaren Formen schauen?

Früher war alle Kunst gegenständlich: Ein Stilleben, Menschen, Natur (Wiese, Blumen, Bäume, Berge usw.). Immer weiter vereinfacht (Kandinsky, Malewitsch). Auch Musik und Philosophie wurden abstrakter.

Heute blicken wir hundert oder hundertfünfzig Jahre zurück und sehen, wie vereinfacht, überoptimistisch und oft auch falsch die Menschen damals die Welt gesehen haben. Vermutlich wird man in fünfzig oder hundert Jahren auch so auf uns zurückblicken, wie wir erste, einfache Schritte mit KI gemacht haben.


===

“Art when really understood is the province of every human being. It is simply a question of doing things, anything, well. It is not an extra outside thing. When the artist is alive in any person, whatever his kind of work may be, he becomes an inventive, searching, daring, self-expressive person. The world would stagnate without him, for he is interesting to others. where there is the art spirit there will be precious works to fill museums.”

“The object isn't to make art, it's to be in that wonderful state which makes art inevitable.”

from “The Art Spirit” by Robert Henri

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

