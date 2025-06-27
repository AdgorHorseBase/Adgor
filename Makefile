.PHONY: all admin website prod-build prod-serve setup

# Set to use the admin panel
export ActiveAdmin ?= true

all: website

admin:
	@cd admin && npm start

website:
	cd website && npm start

prod-build:
	cd admin && npm run build
	cd website && npm run build

prod-serve:
	cd admin && npm run start
	cd website && npm run start

setup:
	cd admin && npm i
	cd website && npm i