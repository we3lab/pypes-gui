# PyPES GUI
Graphical user interface (GUI) to help you build models in [pype-schema](https://github.com/we3lab/pype-schema).

# Installation
```bash
git clone
cd pypes-gui
npm install
```

# Usage
```bash
npm run dev
```
Then the local server will be running at [http://localhost:3000](http://localhost:3000).

# Project Structure
```
pypes-gui/
├── components/          # Reusable React components
├── public/              # Static files (images, icons, etc.)
├── styles/              # Global styles
├── utils/               # Utility functions and constants
├── next.config.js       # Next.js configuration
├── package.json         # Project metadata and dependencies
├── README.md            # Project documentation
```

## Current Status
- Remove backend: Most of the backend and trpc features in flows-app are removed. Instead, everything is now implemented and stored in the frontend.
    - TODO: Clean up the codebase to remove unused files and folders.
- Simplified the pages: The pages are now simplified to focus on a single page of network editor, originally from flows-app's `data-ingestion` page. All login features are removed because now the app is only used for local usage.
- Network editor: Now it can create new nodes and connections with corresponding attributes. A simple export function is implemented to export the network as a JSON file, and a simple import function is implemented to import the network from a JSON file.
    - TODO: Implement the import and export functions to support the full pype-schema format. 
    - TODO: Add the icons for the new nodes.
    - TODO: Implement the virtual_tags editor to edit the virtual tags of the nodes, also in import and export functions.
