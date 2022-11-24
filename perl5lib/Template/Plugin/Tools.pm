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

sub make_list {
    my ($self, $subdir) = @_;
    my $this_dir = my $target_dir = $self->get_dir;
    if (defined $subdir) { $target_dir = $this_dir->child($subdir) }

    # We want the list of directories in the target_dir, but relative to
    # this_dir.
    my @wanted =
      map { substr($_, length($this_dir) + 1) }
      grep { $_->is_dir } path($target_dir)->children;
    my @spec = $self->dirs_to_exhibit_specs(@wanted);

    # sort case-independent
    return [ sort { uc($a->{name}) cmp uc($b->{name}) } @spec ];
}

sub dirs_to_exhibit_specs {
    my ($self, @dirs) = @_;
    my @spec = map { { dir => $_, name => $_ } } @dirs;

    # For each of those directories, look into the sketch.js file and try to
    # find a title.
    for (@spec) {
        my $js = $self->get_dir->child($_->{dir})->child('sketch.js')->slurp;
        my ($title, $author);
        if ($js =~ /\.title\('(.*?)'/)  { $title  = $1 }
        if ($js =~ /\.author\('(.*?)'/) { $author = $1 }
        if ($title) {
            $_->{name} = $title;
            if ($author) {
                $_->{name} .= " by $author";
            }
        } else {

            # Try to clean up the name a bit: change dashes to spaces; add
            # spaces around slashes (subdirs).
            for ($_->{name}) {
                s!/! / !g;
                s/\w\K-(?=\w)/ /g;
            }
        }
    }
    return @spec;
}

sub source_link {
    my $self   = shift;
    my $link = $self->get_dir->child('sketch.js');
    $link = 'https://github.com/danubedataflow/danubedataflow-site/blob/master/' . $link;
    return $link;
}

sub add_dependencies {
    my $self = shift;
    my $dir  = $self->get_dir;

    # JavaScript lib paths (starting with 'deps/' etc.) are relative to the
    # root. We want to have relativ links to the libs so determine how many
    # directories we need to go up. It is '../' times the number of slashes in
    # $dir.
    my $prefix = '../' x length($dir =~ s![^/]!!gr);
    my $script = $dir->child('sketch.js')->slurp;

    # Try to detect some libraries.
    my @dependency_indicators = (
        [
            qr/\bmakeSlider\(/ => [ 'deps/nouislider.min.css', 'deps/nouislider.min.js' ]
        ],
        [ qr/\bchroma\./       => 'deps/chroma.min.js' ],
        [ qr/\bp5\.Ease\(/     => 'deps-manual/p5.func.min.js' ],

        # https://github.com/kgolid/chromotome
        # https://unpkg.com/chromotome@1.19.1/dist/index.umd.js
        [ qr/\bchromotome\b/ => 'deps-manual/chromotome.js' ],

        # https://github.com/SYM380/p5.pattern
        # https://cdn.jsdelivr.net/gh/SYM380/p5.pattern@latest/p5.pattern.js
        [ qr/new Transformer\(/    => 'deps-manual/transformer.js' ],
        [ qr/\brough.canvas\b/     => 'deps/rough.js' ],
        [   [   qr/\bmatter\.(init|makeBarrier)\(/,
                qr/\bMatter\.(Engine|Render|World|Bodies|Composite)/
            ] => [ 'deps-manual/mattermin.js', 'deps-manual/p5-mattermin.js' ]
        ],

        # takawo-specific
        [ qr/\bMetPalettes\b/ => 'deps-manual/takawo-metpalettes.js' ],
    );

    # Preserve the order given in the indicators. For example,
    # 'rhill-voronoi-core.js' needs to be included before 'p5voronoimin.js'.
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
                        $html .= qq!<script src="$prefix$dependency"></script>\n!;
                    } elsif ($dependency =~ /\.css$/) {
                        $html .= qq!<link href="$prefix$dependency" rel="stylesheet">\n!;
                    }
                    $did_include_lib{$dependency}++;
                }
            }
        }
    }
    return $html;
}
1;
