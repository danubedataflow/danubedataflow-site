package Template::Plugin::Tools;
use strict;
use warnings;
use v5.10;
use base 'Template::Plugin';

sub new {
    my ($class, $context) = @_;
    bless { lang => $context->stash->{lang} }, $class;
}

sub s {
    my ($self, $lang_hash) = @_;
    my $lang = $self->{lang} // 'en';    # fallback language
    return $lang_hash->{$lang};
}

# Helper method to be more concise
sub sl {
    my ($self, $en, $de, $ja) = @_;
    my %translations = (en => $en, de => $de // $en, ja => $ja // $en);
    return $translations{ $self->{lang} };
}
sub numTiles     { $_[0]->sl('Number of tiles', 'Anzahl der Kacheln', 'タイル数') }
sub numLines     { $_[0]->sl('Number of lines', 'Anzahl der Zeilen',  '線数') }
sub strokeWeight { $_[0]->sl('Stroke weight',   'Strichstärke',       '線の太さ') }
1;
