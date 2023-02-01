WWW = ~/www/danubedataflow
DEPS = $(WWW)/deps

.PHONY: default site deps watch nginx deploy icons clean test

default:
	$(error Specify a Makefile target)

site: clean
	cp -a src/root $(WWW)
	ttree -f etc/ttreerc --dest $(WWW)/de --define lang=de
	ttree -f etc/ttreerc --dest $(WWW)/en --define lang=en
	ttree -f etc/ttreerc --dest $(WWW)/ja --define lang=ja
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
	cp more-deps/highlight.js/*.{css,js} $(DEPS)

watch:
	bin/live-reload

nginx:
	cp etc/nginx-danubedataflow.conf $(shell brew --prefix)/etc/nginx/servers/
	nginx -s reload

deploy:
	rsync -av --delete $(WWW)/ hetzner:www/danubedataflow.com/
	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon

clean:
	rm -rf $(WWW) build

test:
	perl t/sketches.t

