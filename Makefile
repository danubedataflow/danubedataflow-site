WWW = ~/www/danubedataflow
DEPS = src/deps

.PHONY: site deps watch nginx icons clean test npm-update live

site: clean
	@ttree -f etc/ttreerc
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
	cp more-deps/qrcode.js/qrcode.min.js $(DEPS)/
	cp more-deps/qrcode.js/LICENSE $(DEPS)/LICENSE-qrcode.js.txt
	cp more-deps/lindenmayer/lindenmayer.browser.min.js $(DEPS)/
	cp more-deps/lindenmayer/LICENSE $(DEPS)/LICENSE-lindenmayer.txt

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
	@rm -rf $(WWW) build.noindex

npm-update:
	npm update --save

