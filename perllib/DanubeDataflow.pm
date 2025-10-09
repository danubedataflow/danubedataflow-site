package DanubeDataflow;
use strict;
use warnings;
use feature qw(:5.36);
use JSON::PP;
use Path::Tiny;

sub import {
    my $caller = caller();
    no strict 'refs';
    *{"${caller}::$_"} = *{$_}{CODE} for qw(
      i18n_assemble_dicts
    );
}

sub i18n_assemble_dicts ($dir) {
    my $iter     = path($dir)->iterator({ recurse => 1 });
    my $combined = {};
    while (my $next = $iter->()) {
        next unless $next =~ /lang(-\w\w)?\.json$/;
        my $filename_locale =
          $next->basename('.json') =~ s/^lang-//r;    # 'lang-ja.json' => 'ja'
        my $data = JSON::PP->new->allow_nonref->pretty->decode($next->slurp_utf8);
        my $translation;
        while (my ($key, $value) = each $data->%*) {
            if (ref $value eq ref {}) {
                while (my ($locale, $translation) = each $value->%*) {
                    $combined->{$locale}{$key} = $translation;
                }
            } else {
                $combined->{$filename_locale}{$key} = $value;
            }
        }
    }
    return $combined;
}
1;
