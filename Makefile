.PHONY: update nginx icons test live

update:
	./bin/update-blocks
	find src -name \*.html | xargs html-beautify -m 1 -r -q
	find src/js src/work* -name \*.js | xargs js-beautify -m 1 -r -q

nginx:
	cp etc/nginx-danubedataflow.conf $(shell brew --prefix)/etc/nginx/servers/
	nginx -s reload

live:
	rsync -av --prune-empty-dirs --delete \
		--exclude={'.DS_Store','*.swp','*.un~'} \
		--delete-excluded \
		src/ hetzner:www/danubedataflow.com/
	ssh hetzner 'sudo bin/fix-permissions'

icons:
	bin/make-favicon
