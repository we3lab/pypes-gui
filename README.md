# PyPES GUI
Graphical user interface (GUI) to help you build models in [pype-schema](https://github.com/we3lab/pype-schema).

## Installation

First, make sure you have all required packages installed:

```bash
pip install streamlit pype-schema networkx matplotlib pyvis pandas pint
```

Or from `requirements.txt`:

```bash
pip install -r requirements.txt
```

# Project Structure

```
pypes-gui/
├── main.py
├── visualize.py
├── nodes.py
├── connections.py
├── tags.py
└── export.py
```

# Usage
Open your terminal/command prompt, navigate to the directory containing the files, and run `main.py`:

```bash 
cd pypes-gui
streamlit run main.py
```

Streamlit will automatically:
- Start a local web server
- Open your default browser
- Display the URL (typically `http://localhost:8501`)

You should see output like:

```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.1.x:8501
```

## Quick Start

To quickly test if everything works:

1. Launch the app with `streamlit run main.py`
2. Click "Create New Network" in the sidebar
3. Enter a network name and click "Create Network"
4. Try adding a simple Junction node
5. Check the Visualize tab