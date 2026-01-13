DEPS = src/deps

.PHONY: blocks tidy deps nginx icons test npm-update live

blocks:
	./bin/update-blocks

tidy:
	find src -name \*.html | xargs html-beautify -m 1 -r -q

deps:
	mkdir -p $(DEPS)
	cp node_modules/chroma-js/chroma.min.js $(DEPS)/
	cp node_modules/chroma-js/LICENSE $(DEPS)/LICENSE-chroma.js.txt
	cp node_modules/nouislider/dist/nouislider.min.css $(DEPS)/
	cp node_modules/nouislider/dist/nouislider.min.js $(DEPS)/
	cp node_modules/nouislider/LICENSE.md $(DEPS)/LICENSE-nouislider.md
	cp more-deps/qrcode.js/qrcode.min.js $(DEPS)/
	cp more-deps/qrcode.js/LICENSE $(DEPS)/LICENSE-qrcode.js.txt
	cp more-deps/lindenmayer/lindenmayer.browser.min.js $(DEPS)/
	cp more-deps/lindenmayer/LICENSE $(DEPS)/LICENSE-lindenmayer.txt

nginx:
	cp etc/nginx-danubedataflow.conf $(shell brew --prefix)/etc/nginx/servers/
	nginx -s reload

live:
	rsync -av --delete src/ hetzner:www/danubedataflow.com/
	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon

npm-update:
	npm update --save

