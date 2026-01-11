# danubedataflow.com

To build the website, install the CPAN Perl dependencies. First, install
`cpanminus`, either via a package manager like Homebrew, or manually.

    brew install cpanminus
    cpanm Template Path::Tiny

Also install the other dependencies:

    npm install

Then:

    make site

This installs the website in `~/www/danubedataflow`.
