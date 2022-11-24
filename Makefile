WWW = ~/www/danubedataflow
DEPS = $(WWW)/deps

.PHONY: default site deps watch deploy icons beauty clean test

default:
	$(error Specify a Makefile target)

site: clean
	ttree -f etc/ttreerc
	make deps

deps:
	mkdir -p $(DEPS)
	cp node_modules/chroma-js/chroma.min.js $(DEPS)/
	cp node_modules/roughjs/bundled/rough.js $(DEPS)/
	cp node_modules/nouislider/dist/nouislider.min.css $(DEPS)/
	cp node_modules/nouislider/dist/nouislider.min.js $(DEPS)/
	cp node_modules/p5/lib/p5.min.js $(DEPS)/
	mkdir -p $(DEPS)/bootstrap-icons-font/fonts
	cp -a node_modules/bootstrap-icons/font/bootstrap-icons.css $(DEPS)/bootstrap-icons-font/
	cp -a node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff* $(DEPS)/bootstrap-icons-font/fonts/

watch:
	bin/live-reload

deploy:
	rsync -av --delete $(WWW)/ hetzner:www/danubedataflow.com/
	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon

beauty:
	find src -name sketch.js -exec js-beautify -r {} +

clean:
	rm -rf $(WWW) build

test:
	perl t/sketches.t

