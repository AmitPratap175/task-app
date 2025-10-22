run:
	podman-compose up db -d
	. .venv/bin/activate && npm run dev

stop:
	podman-compose down

build: 
	podman-compose build db
	@make run