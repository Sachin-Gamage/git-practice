# Engineering Team Gallery — Git Practice Sandbox

Welcome to the team! This repository is a practice ground for interns to learn professional Git and GitHub collaborative workflows. It is a modern **Team Profile Gallery** dashboard.

Your goal is to get onboarded by adding your profile card to this gallery!

---

## Getting Started (Run the App Locally)

To view the dashboard locally, you will need a simple HTTP server to avoid CORS issues when fetching the JSON database files.

### Option 1: Python (Recommended)
Mac and Linux machines usually have Python pre-installed. Run the following command in your terminal from inside this folder:

```bash
# Python 3
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Option 2: Node.js (npx)
If you have Node.js installed, you can spin up a server using `npx`:

```bash
npx serve
```
Open your browser and navigate to the port output in your terminal (usually `http://localhost:3000` or `5000`).

---

## Onboarding Assignments

### 🛠️ Assignment 1: The Clean Merge
Create a new feature branch and add your profile details file. Since this file is unique to you, your changes will merge cleanly.

1. Switch to the `main` branch and update:
   ```bash
   git switch main
   git pull origin main
   ```
2. Create your own feature branch:
   ```bash
   git switch -c feature/profile-<your-name>
   ```
3. Inside the `profiles/` directory, create a new file named `profile-intern-<a/b/c/d/e>.json`. (e.g., `profile-intern-a.json`).
4. Copy the structure from `profiles/mentor.json`, modifying the values with your personal name, role, bio, and skills list. Use a unique slug for `"id"` (e.g. `"intern-a"`).
5. Stage, commit, and push your branch:
   ```bash
   git add profiles/profile-intern-<letter>.json
   git commit -m "feat: add profile card for <your-name>"
   git push -u origin feature/profile-intern-<letter>
   ```
6. Go to GitHub and open a Pull Request (PR). Assign one of your fellow interns to review and approve your PR.
7. Merge your PR into `main` after it has been approved.

---

## 💥 Assignment 2: The Merge Conflict
Now that your profile file is merged, you must register your ID in the central registry so the app knows to display it. 
All 5 interns will edit the central list `team.json` at the same time, leading to a merge conflict.

1. Switch back to `main` and get the latest updates:
   ```bash
   git switch main
   git pull origin main
   ```
2. Create a registration feature branch:
   ```bash
   git switch -c feature/register-<your-name>
   ```
3. Open `team.json`. Add your ID (e.g. `"intern-a"`) to the list. Make sure to separate list items with commas and maintain valid JSON formatting!
   ```json
   {
     "members": [
       "mentor",
       "intern-a"
     ]
   }
   ```
4. Stage, commit, and push:
   ```bash
   git add team.json
   git commit -m "feat: register <your-name> in team roster"
   git push -u origin feature/register-<your-name>
   ```
5. Open a PR on GitHub.
6. **The Race Begins:** 
   - The first intern to merge their PR will succeed cleanly.
   - The other 4 interns will see a "Merge Conflict" warning.
7. **Resolving the Conflict:**
   - On your computer, pull the latest changes into your local `main`:
     ```bash
     git switch main
     git pull origin main
     ```
   - Switch back to your registration branch:
     ```bash
     git switch feature/register-<your-name>
     ```
   - Merge `main` into your branch:
     ```bash
     git merge main
     ```
   - Resolve the conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) in `team.json` by combining the roster so **both** entries are present.
   - Save the file, stage `team.json`, commit, and push.
   - Go back to GitHub and merge your PR!

---

## Git Cheat Sheet

| Command | Description |
| :--- | :--- |
| `git status` | Shows current branch state and modified files |
| `git log --oneline` | View commit history in a single line format |
| `git diff` | Show changes made in working directory compared to HEAD |
| `git checkout -b <branch>` | Create and checkout new branch (older command) |
| `git switch -c <branch>` | Create and switch to new branch (modern command) |
| `git stash` | Safely save modifications to temporary buffer |
| `git stash pop` | Restore stashed modifications |
| `git restore <file>` | Revert uncommitted changes in your working directory |
| `git revert <hash>` | Undo an existing commit safely with a new commit |
