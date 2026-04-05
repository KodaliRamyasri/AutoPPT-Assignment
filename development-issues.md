# Development Issues and Solutions - AutoPPT AI Project

As I built the AutoPPT AI project, I encountered several challenges that are common when developing a full-stack AI application with MCP servers. Here's a compilation of the issues I faced and how I overcame them, to help other developers avoid similar pitfalls.

## 1. Virtual Environment Setup Issues

**Issue:** On Windows, creating and activating a Python virtual environment was tricky. The `venv` module wasn't working as expected, and activation scripts were missing.

**What I faced:** Initially, `python -m venv venv` created a folder but without the Scripts directory, leading to "Activate.ps1 not found" errors.

**Solution:** I recreated the virtual environment using `python -m venv venv --clear` and ensured I was using PowerShell. For activation, I used `& .\venv\Scripts\Activate.ps1` instead of the bash-style command. Also, made sure Python was properly installed and added to PATH.

## 2. MCP Package Installation Problems

**Issue:** The `mcp` package wasn't installing via pip, causing `ModuleNotFoundError` when running the backend.

**What I faced:** Even after running `pip install -r requirements.txt`, the mcp module wasn't available. This was because the package wasn't in the standard PyPI initially.

**Solution:** I installed it separately with `pip install mcp`. It turned out the package was available but needed explicit installation. Also, ensured the virtual environment was activated before installing.

## 3. API Key Configuration

**Issue:** The application required HuggingFace and Pexels API keys, but they weren't set up properly.

**What I faced:** The `.env` file existed but had placeholder values, leading to API failures during generation.

**Solution:** I obtained real API keys from HuggingFace (for the LLM) and Pexels (for image search), and updated the `.env` file with actual values. Remember to keep `.env` in `.gitignore` to avoid committing secrets.

## 4. Running Multiple Servers Simultaneously

**Issue:** Coordinating the backend (FastAPI) and frontend (Vite) servers was challenging, especially with hot reloading.

**What I faced:** Ports conflicts and difficulty managing two terminal sessions.

**Solution:** I used background processes for the servers. For backend: `uvicorn backend.main:app --reload --port 8000` in one terminal. For frontend: `npm run dev` in another. Used `--reload` for auto-restart on code changes.

## 5. CORS and Proxy Configuration

**Issue:** Frontend couldn't communicate with the backend due to CORS restrictions.

**What I faced:** API calls from React to FastAPI were blocked by browser CORS policy.

**Solution:** I configured Vite's proxy in `vite.config.js` to forward API requests to the backend:

```javascript
server: {
  proxy: {
    '/generate': 'http://localhost:8000',
    '/export': 'http://localhost:8000',
    // etc.
  }
}
```

Also ensured FastAPI had CORS middleware enabled.

## 6. Node.js Dependencies Installation

**Issue:** Frontend dependencies weren't installing properly, causing "vite not recognized" errors.

**What I faced:** Even after `npm install`, the vite command wasn't available in the terminal.

**Solution:** I ran `npm install` again and ensured Node.js was installed correctly. Sometimes clearing node_modules and package-lock.json helps: `rm -rf node_modules package-lock.json && npm install`.

## 7. Python Package Conflicts

**Issue:** Version conflicts between Python packages, especially with MCP and other libraries.

**What I faced:** Import errors due to incompatible versions.

**Solution:** I used `pip install --upgrade` for problematic packages and checked `requirements.txt` for pinned versions. Also, recreated the virtual environment if needed.

## 8. Image Loading and Canvas Export

**Issue:** When exporting presentations, images weren't loading properly in the canvas capture.

**What I faced:** Exported PPTX had missing images because html2canvas captured before images loaded.

**Solution:** Added delays and promises to wait for images to load:

```javascript
await Promise.all(imgs.map(img => {
  if (img.complete) return Promise.resolve()
  return new Promise(resolve => {
    img.onload = resolve
    img.onerror = resolve
  })
}))
```

## 9. MCP Server Communication

**Issue:** The MCP servers (web_search_mcp.py and mcp_server.py) weren't communicating properly with the main backend.

**What I faced:** Stdio client sessions failing to start.

**Solution:** Ensured the MCP server scripts were executable and in the correct path. Used absolute paths for server commands and handled stderr properly.

## 10. Environment Variable Loading

**Issue:** `.env` file wasn't being loaded by the Python scripts.

**What I faced:** API keys were undefined even though the file existed.

**Solution:** Used `python-dotenv` and called `load_dotenv()` at the start of scripts, ensuring the path to `.env` was correct (usually in the root directory).

## General Tips

- Always activate the virtual environment before running Python commands
- Use `pip list` to verify package installations
- Check terminal output for error messages carefully
- Use browser dev tools to debug frontend-backend communication
- Keep dependencies updated but pinned to avoid breaking changes
- Test API endpoints individually before integrating
- Use logging in Python scripts for better debugging

These issues taught me the importance of thorough setup documentation and environment consistency. The project runs smoothly now, but these were the hurdles I had to overcome during development.