#!/usr/bin/env perl
use strict;
use warnings;
use v5.10;
use Test::More;
use Path::Tiny;
my $iter = path('src')->iterator({ recurse => 1 });
while (my $next = $iter->()) {
    next unless $next =~ m!/sketch.js$!;
    subtest $next, sub {
        my $js = $next->slurp;
        ok $js =~ /^'use strict';\n/,                "starts with 'use strict'";
        ok $js =~ /^const config = new Config\(\)/m, 'defines a config object';

        # Avoid `let foo = ...` in the global scope; assign in initSketch(). Or
        # use `const`.
        ok $js !~ /^let \w+\s*=/m,
          'does not assign variable values in the global scope';
        ok $js =~ /^\s*\.title\('.*?'\)/m, 'sets a title';
        ok $js !~ /^function drawSketch\(\) \{/, 'defines function drawSketch()';
        ok $js !~ /\bframeCount\b/,              'does not use frameCount';

        # check for forbidden function calls
        my @forbidden_calls = qw(
          noLoop
          loop
          loadImage
          loadFont
          createWriter);
        for my $call (@forbidden_calls) {
            ok $js !~ /\b\Q$call\E\(/, "does not call $call()";
        }

        # check for forbidden function definitions
        my @forbidden_fn = qw(
          preload
          setup
          draw
          keyPressed
          keyTyped
          mouseClicked
          mouseDragged
          mousePressed
          mouseReleased);

        for my $fn (@forbidden_fn) {
            ok $js !~ /function \Q$fn\E\b \{/, "does not define $fn() function";
        }
    };
}
done_testing;
