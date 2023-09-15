package Template::Plugin::Tools;
use strict;
use warnings;
use v5.10;
use Path::Tiny;
use base 'Template::Plugin';

sub new {
    my ($class, $context) = @_;
    bless { context => $context }, $class;
}

sub get_lang {
    my $self = shift;
    return $self->{context}->stash->{lang} // 'en';    # fallback language
}

sub get_dir {
    my $self = shift;
    return path('src/' . $self->{context}->stash->{template}{name})
      ->parent->basename;
}
sub get_default_name { $_[0]->get_dir }

# Helper method to be more concise
sub sl {
    my ($self, $en, $de, $ja) = @_;
    my %translations = (en => $en, de => $de // $en, ja => $ja // $en);
    return $translations{ $self->get_lang };
}
sub numTiles { $_[0]->sl('Number of tiles', 'Anzahl der Kacheln', 'タイルの数') }

sub numTilesX {
    $_[0]->sl('Number of horizontal tiles',
        'Anzahl der horizontalen Kacheln', '水平タイルの数');
}

sub numTilesY {
    $_[0]
      ->sl('Number of vertical tiles', 'Anzahl der vertikalen Kacheln', '垂直タイルの数');
}
sub numLines  { $_[0]->sl('Number of lines',  'Anzahl der Zeilen', '線の数') }
sub numColors { $_[0]->sl('Number of colors', 'Anzahl der Farben', '色の数') }

sub numRects {
    $_[0]->sl('Number of rectangles', 'Anzahl der Rechtecke', '長方形の数');
}
sub numSides     { $_[0]->sl('Number of sides', 'Anzahl der Seiten', '辺の数') }
sub maxDepth     { $_[0]->sl('Maximum depth',   'Maximale Tiefe',    '最大の深さ') }
sub strokeWeight { $_[0]->sl('Stroke weight',   'Strichstärke',      '線の太さ') }

sub alpha {
    $_[0]->sl('Transparency (Alpha)', 'Transparenz (Alpha)', '透明度（アルファ値）');
}
sub scale { $_[0]->sl('Scale', 'Skalierung', '目盛') }
1;
