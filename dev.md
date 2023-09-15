ignoreControlChange:
- in utils.js ignoreControlChange is initialized with 1. When the form is done,
  it is set to 0 so controlsDidChange() will have an effect from then on.
- ignoreControlChange is necessary so form elements don't randomly call
  readControls() and updateURL() on half-empty forms, i.e. before everything is
  set up.

- if seed is given in URL, that is used. If not, a random seed is used.
- The seed that is used is shown.
-  oth the redraw button and the change-parameters-randomly button will
   generate a new seed. (Rationale: if the redraw button didn't generate a new
   seed, you couldn't get the exact same image with the shown seed because
   every time you redraw it calls random() again.
- To be able to regenerate the exact same image, copy the URL including the
  seed.

Note: For some reason the seed doesn't work with Ctrl-R (reloading a page).
Maybe updateURL() doesn't affect what Ctrl-R is doing. Best not to use Ctrl-R;
use the provided buttons (redraw, randomize controls etc.) instead.

===

Avoid the Template Toolkit in JS files:

ack '\[%' src/**/*.js

?lang=de

// have a fixed dictionary
dictionary = {
  key1: { en: '...', de: '...', ja: '...' },
  ...
};

clicking on a flag just changes the 'lang' URL search parameter. Does it need a
page reload so setupForm() etc. use the new dictionary entries?

then we don't need to generate language-specific versions of the web site. no
more src/lang and src/root; it's all one site

and since src/**/*.js files don't use the Template Toolkit anymore, we can tidy
it in vim with Ctrl-F.

