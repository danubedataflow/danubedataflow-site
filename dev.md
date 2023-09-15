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

FICME: why does Ctrl-R generate a new seed even though the URL contains a seed?
