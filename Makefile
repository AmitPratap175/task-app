run:
	podman-compose up db -d
	. .venv/bin/activate && npm run dev

stop:
	podman-compose down

build: 
	uv venv -n
	. .venv/bin/activate && uv sync
	podman-compose build db
	@make run