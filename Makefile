WWW = ~/www/danubedataflow
DEPS = src/deps

.PHONY: site deps watch nginx live icons clean test

site:
	@ttree -f etc/ttreerc

deps:
	mkdir -p $(DEPS)
	cp node_modules/chroma-js/chroma.min.js $(DEPS)/
	cp node_modules/chroma-js/LICENSE $(DEPS)/LICENSE-chroma.js.txt
	cp node_modules/roughjs/bundled/rough.js $(DEPS)/
	cp node_modules/roughjs/LICENSE $(DEPS)/LICENSE-rough.js.txt
	cp node_modules/nouislider/dist/nouislider.min.css $(DEPS)/
	cp node_modules/nouislider/dist/nouislider.min.js $(DEPS)/
	cp node_modules/nouislider/LICENSE.md $(DEPS)/LICENSE-nouislider.md
	cp node_modules/p5/lib/p5.min.js $(DEPS)/
	cp node_modules/p5/license.txt $(DEPS)/LICENSE-p5.js.txt
	mkdir -p $(DEPS)/bootstrap-icons-font/fonts
	cp -a node_modules/bootstrap-icons/font/bootstrap-icons.css $(DEPS)/bootstrap-icons-font/
	cp -a node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff* $(DEPS)/bootstrap-icons-font/fonts/
	cp -a node_modules/bootstrap-icons/LICENSE.md $(DEPS)/bootstrap-icons-font/LICENSE-bootstrap-icons-font.md
	cp more-deps/highlight.js/*.{css,js} $(DEPS)/
	cp more-deps/highlight.js/LICENSE $(DEPS)/LICENSE-highlight.js.txt

watch:
	bin/live-reload

nginx:
	cp etc/nginx-danubedataflow.conf $(shell brew --prefix)/etc/nginx/servers/
	nginx -s reload

live:
	rsync -av --delete $(WWW)/ hetzner:www/danubedataflow.com/
	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon

clean:
	rm -rf $(WWW) build

test:
	perl t/sketches.t

