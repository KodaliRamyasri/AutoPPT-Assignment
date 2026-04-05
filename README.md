# AutoPPT AI

AutoPPT AI is an end-to-end presentation generator built with a React web interface and a Python backend. The system accepts a single prompt, uses an LLM to plan the presentation, and then builds a themed `.pptx` file automatically.

## What this project does

- Accepts a user prompt from the frontend UI
- Generates slide titles, bullet points, and image queries using an LLM
- Uses two custom MCP servers to fetch images and render slides
- Produces a downloadable PowerPoint file (`.pptx`)
- Supports both web UI and backend-driven generation

## Architecture

The app uses a dual MCP server design:

- `frontend/` – React + Vite UI
- `backend/main.py` – FastAPI backend for generate/export/image proxy routes
- `backend/mcp_server.py` – MCP server that renders PowerPoint slides with `python-pptx`
- `backend/web_search_mcp.py` – MCP server that searches Pexels for slide images
- `backend/agent.py` – optional CLI entrypoint for agentic generation

Flow:

1. User enters a topic in the frontend
2. Frontend sends `POST /generate` to the backend
3. Backend asks the LLM for a slide plan
4. Backend opens two MCP servers:
   - one to search and return image URLs
   - one to build the presentation
5. The backend returns slide metadata to the frontend
6. The frontend displays the generated slides and downloads the `.pptx`

## Key files

- `backend/main.py` – FastAPI app, handles `/generate`, `/export`, `/history`, and `/image-proxy`
- `backend/agent.py` – command-line interface for direct generation without web UI
- `backend/mcp_server.py` – custom MCP server that creates and saves `.pptx` slides
- `backend/web_search_mcp.py` – custom MCP server that searches the Pexels API for images
- `frontend/src/App.jsx` – main app logic, generation flow, and download handling
- `frontend/src/components/` – UI components for the home page, modal, topbar, slide cards, and preview canvas
- `docs/` – example generated presentations and supporting files
- `reflection.md` – project reflection and assignment write-up

## Setup

### Prerequisites

- Python 3.11+ (project uses `venv`)
- Node.js 18+
- `npm` for frontend dependencies
- Hugging Face API token
- Pexels API key

### Install backend dependencies

```powershell
cd c:\Users\Ramyasri Kodali\Downloads\assignment\assignment
python -m venv venv
.\.\venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### Install frontend dependencies

```powershell
cd c:\Users\Ramyasri Kodali\Downloads\assignment\assignment\frontend
npm install
```

### Environment variables

Create a `.env` file in the project root containing:

```env
HUGGINGFACEHUB_API_TOKEN=hf_your_token_here
MODEL_ID=Qwen/Qwen2.5-7B-Instruct
TEMPERATURE=0.2
PEXELS_API_KEY=your_pexels_api_key_here
```

## Running the application

### Start the backend

```powershell
cd c:\Users\Ramyasri Kodali\Downloads\assignment\assignment
.\.\venv\Scripts\Activate.ps1
uvicorn backend.main:app --reload --port 8000
```

### Start the frontend

```powershell
cd c:\Users\Ramyasri Kodali\Downloads\assignment\assignment\frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

## CLI usage

Generate a presentation directly from the command line:

```powershell
cd c:\Users\Ramyasri Kodali\Downloads\assignment\assignment
.\.\venv\Scripts\Activate.ps1
python backend\agent.py "Create a 5-slide presentation about the future of electric vehicles"
```

## What makes it agentic

- The LLM plans the full slide outline before slide generation begins
- Two MCP servers coordinate sequentially:
  - image search via `web_search_mcp.py`
  - PowerPoint rendering via `mcp_server.py`
- The result is a fully generated `.pptx` file without manual slide assembly

## Notes

- Slide branding is set to `AutoPPT AI`
- Generated PowerPoints are saved in `docs/` when using CLI
- The frontend download flow triggers the backend export endpoint

## Project structure

- `backend/` – Python backend and MCP servers
- `frontend/` – React UI
- `docs/` – generated examples and documentation
- `reflection.md` – assignment reflection

## Troubleshooting

- If the backend fails with `ModuleNotFoundError: No module named 'mcp'`, verify the virtual environment is active and dependencies are installed
- If the frontend does not start, run `npm install` inside `frontend/`
- If image generation fails, ensure `PEXELS_API_KEY` is valid

## Credits

Built as an AI presentation generator for an MCP-based agent project. The system combines React, FastAPI, `python-pptx`, and custom MCP tooling to make automated slide decks.
