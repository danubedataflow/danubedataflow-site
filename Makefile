WWW = ~/www/danubedataflow
DEPS = src/deps

.PHONY: site deps watch nginx icons clean test open-all npm-update
# live

site: clean
	@ttree -f etc/ttreerc
	@find src -name lang\*.json | xargs ./bin/assemble-i18n-dicts >$(WWW)/js/i18n-dicts.js
	@find $(WWW) -name \*.html | xargs html-beautify -m 1 -r -q

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
	cp more-deps/highlight.js/*.{css,js} $(DEPS)/
	cp more-deps/highlight.js/LICENSE $(DEPS)/LICENSE-highlight.js.txt
	cp more-deps/qrcode.js/qrcode.min.js $(DEPS)/
	cp more-deps/qrcode.js/LICENSE $(DEPS)/LICENSE-qrcode.js.txt

watch:
	bin/live-reload

nginx:
	cp etc/nginx-danubedataflow.conf $(shell brew --prefix)/etc/nginx/servers/
	nginx -s reload

# live:
# 	rsync -av --delete $(WWW)/ hetzner:www/danubedataflow.com/
# 	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon

clean:
	@rm -rf $(WWW) build.noindex

test:
	perl t/sketches.t

open-all:
	./bin/open-all

npm-update:
	npm update --save

