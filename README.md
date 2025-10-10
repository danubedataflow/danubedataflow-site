# danubedataflow.com

Code für die Website.

Um die Website zu erstellen, installiere die Perl-Abhängigkeiten von CPAN. Dazu
installiere zuerst `cpanminus`, entweder über einen Package Manager wie
homebrew, oder manuell.

    brew install cpanminus
    cpanm Template Path::Tiny

Installiere auch die anderen Abhängigkeiten:

    npm install

Dann:

    make site

Das installiert die Website in `~/www/danubedataflow`.
