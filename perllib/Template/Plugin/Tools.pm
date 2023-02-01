package Template::Plugin::Tools;
use strict;
use warnings;
use v5.10;
use Path::Tiny;
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
    my ($self, $en, $de, $jp) = @_;
    my %translations = (en => $en, de => $de // $en, jp => $jp // $en);
    return $translations{ $self->{lang} };
}
1;
