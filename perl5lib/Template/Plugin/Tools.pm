package Template::Plugin::Tools;
use strict;
use warnings;
use v5.10;
use Path::Tiny;
use base 'Template::Plugin';

sub new {
    my ($class, $context) = @_;
    bless { name => $context->stash->{template}{name}, }, $class;
}

sub get_dir {
    my ($self, $subdir) = @_;
    return path('src/' . $self->{name})->parent;
}

sub get_up_path {
    my $self = shift;
    return '../' x length($self->{name} =~ s![^/]!!gr);
}

sub make_list {
    my ($self, $subdir) = @_;
    my $this_dir = my $target_dir = $self->get_dir;
    if (defined $subdir && length $subdir) {
        $target_dir = $this_dir->child($subdir);
    }

    # We want the list of directories in the target_dir, but relative to
    # this_dir.
    my @wanted =
      map  { substr($_, length($this_dir) + 1) }
      grep { $_->is_dir && $_->child('sketch.js')->exists }
      path($target_dir)->children;

    # sort case-independent
    return [ sort @wanted ];
}

sub source_link {
    my $self = shift;
    my $link = $self->get_dir->child('sketch.js');
    $link =
      'https://github.com/danubedataflow/danubedataflow-site/blob/master/' . $link;
    return $link;
}

sub add_dependencies {
    my $self    = shift;
    my $dir     = $self->get_dir;
    my $up_path = $self->get_up_path;
    my $script  = $dir->child('sketch.js')->slurp;

    # Try to detect some libraries.
    my @dependency_indicators = (
        [
            qr/\bmakeSlider\(/ => [ 'deps/nouislider.min.css', 'deps/nouislider.min.js' ]
        ],
        [ qr/\bchroma\./       => 'deps/chroma.min.js' ],
        [ qr/\brough.canvas\b/ => 'deps/rough.js' ],
    );

    # Preserve the order given in the indicators in case those libraries depend
    # on each other.
    my %did_include_lib;
    my $html = '';
    for my $spec (@dependency_indicators) {
        my ($re_spec, $deps_spec) = @$spec;

        # both elements can be scalars or arrays
        $re_spec   = [$re_spec]   unless ref $re_spec eq 'ARRAY';
        $deps_spec = [$deps_spec] unless ref $deps_spec eq 'ARRAY';
        for my $re (@$re_spec) {
            if ($script =~ $re) {
                for my $dependency (@$deps_spec) {
                    next if $did_include_lib{$dependency};
                    if ($dependency =~ /\.js$/) {
                        $html .= qq!<script src="$up_path$dependency"></script>\n!;
                    } elsif ($dependency =~ /\.css$/) {
                        $html .= qq!<link href="$up_path$dependency" rel="stylesheet">\n!;
                    }
                    $did_include_lib{$dependency}++;
                }
            }
        }
    }
    return $html;
}
1;
