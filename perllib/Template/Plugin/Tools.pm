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

# for a URL
sub get_current_parent_path {
    my $self = shift;
    return path($self->{context}->stash->{template}{name})->parent;
}

# for the filesystem
sub get_current_parent_dir {
    my $self = shift;
    return path('src/' . $self->{context}->stash->{template}{name})->parent;
}

sub get_default_name {
    my $self = shift;
    return $self->get_current_parent_dir->basename;
}

sub get_subdirs_starting_with {
    my ($self, $prefix) = @_;

    # don't directly return a sort() result
    my @dirs =
      sort { $b cmp $a }
      map  { $_->basename }
      grep { $_->is_dir } $self->get_current_parent_dir->children(qr/^$prefix/);
    return @dirs;
}

sub does_file_exist_in_current_dir {
    my ($self, $basename) = @_;
    $self->get_current_parent_dir->child($basename)->is_file;
}

1;
