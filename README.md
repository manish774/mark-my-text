# Mark It - Persistent Code Highlighter

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/mark-it-extension)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.74%2B-brightgreen.svg)](https://code.visualstudio.com/)

A powerful VS Code extension that allows you to mark and highlight important code snippets with persistent blue highlighting that survives VS Code restarts.

![Mark It Demo](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/demo.gif)

## ✨ Features

- **🎯 One-Click Marking**: Simply select text and right-click to mark it
- **💾 Persistent Storage**: All marks are saved and restored when you reopen files
- **🔄 Smart Updates**: Marks automatically adjust when you edit code
- **🗂️ Multi-File Support**: Each file maintains its own independent marks
- **🎨 Customizable Colors**: Configure highlight and border colors to your preference
- **📍 Navigation**: Easily navigate between all marked snippets
- **🧹 Easy Management**: Unmark individual snippets or clear all marks at once

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions view
3. Search for "Mark It - Persistent Code Highlighter"
4. Click **Install**

### From VSIX File

1. Download the `.vsix` file from [releases](https://github.com/yourusername/mark-it-extension/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` and type "Extensions: Install from VSIX..."
4. Select the downloaded `.vsix` file

## 🎯 Usage

### Marking Code

1. **Select** any text or code snippet in the editor
2. **Right-click** on the selection
3. Choose **"Mark It"** from the context menu
4. The selected text will be highlighted with a blue background

![Marking Code](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/mark-code.png)

### Unmarking Code

1. **Place cursor** on any marked text
2. **Right-click**
3. Choose **"Unmark It"** from the context menu

### Managing Marks

- **View All Marks**: `Ctrl+Shift+P` → "Mark It: List All Marks"
- **Clear All Marks**: `Ctrl+Shift+P` → "Mark It: Clear All Marks"
- **Navigate**: Use the Quick Pick menu to jump between marks

![Managing Marks](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/manage-marks.png)

## ⌨️ Commands

| Command                     | Description                        | Default Keybinding |
| --------------------------- | ---------------------------------- | ------------------ |
| `Mark It: Mark Selection`   | Mark the currently selected text   | -                  |
| `Mark It: Unmark Selection` | Remove mark from text at cursor    | -                  |
| `Mark It: List All Marks`   | Show all marks in current file     | -                  |
| `Mark It: Clear All Marks`  | Remove all marks from current file | -                  |

## ⚙️ Configuration

Customize the extension through VS Code settings:

```json
{
  "markIt.highlightColor": "rgba(0, 123, 255, 0.3)",
  "markIt.borderColor": "#007bff",
  "markIt.showInOverviewRuler": true
}
```

### Available Settings

| Setting                      | Description                      | Default                  | Type    |
| ---------------------------- | -------------------------------- | ------------------------ | ------- |
| `markIt.highlightColor`      | Background color for marked text | `rgba(0, 123, 255, 0.3)` | string  |
| `markIt.borderColor`         | Border color for marked text     | `#007bff`                | string  |
| `markIt.showInOverviewRuler` | Show marks in the overview ruler | `true`                   | boolean |

### Color Examples

```json
// Green theme
"markIt.highlightColor": "rgba(40, 167, 69, 0.3)",
"markIt.borderColor": "#28a745"

// Purple theme
"markIt.highlightColor": "rgba(108, 117, 125, 0.3)",
"markIt.borderColor": "#6c757d"

// Yellow theme
"markIt.highlightColor": "rgba(255, 193, 7, 0.3)",
"markIt.borderColor": "#ffc107"
```

## 🎨 Screenshots

### Basic Marking

![Basic Usage](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/basic-usage.png)

### Multiple Marks

![Multiple Marks](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/multiple-marks.png)

### Quick Pick Navigation

![Navigation](https://raw.githubusercontent.com/yourusername/mark-it-extension/main/images/navigation.png)

## 🔧 How It Works

- **Persistent Storage**: Uses VS Code's `globalState` API to store marks across sessions
- **Smart Positioning**: Automatically adjusts mark positions when you edit code
- **File-Based**: Each file maintains its own set of marks independently
- **Performance Optimized**: Only processes active editors and uses efficient decoration APIs

## 📋 Use Cases

### 👨‍💻 **Code Review**

- Mark important code sections during review
- Highlight areas that need attention
- Keep track of changes across multiple files

### 📚 **Learning & Study**

- Highlight key concepts while studying code
- Mark important patterns or techniques
- Create visual bookmarks in large codebases

### 🐛 **Debugging**

- Mark problematic code sections
- Highlight areas for investigation
- Track related code across files

### 📝 **Documentation**

- Mark code that needs documentation
- Highlight examples for documentation
- Track API usage patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mark-it-extension.git
cd mark-it-extension

# Install dependencies
npm install

# Compile
npm run compile

# Run extension
code .
# Press F5 to start debugging
```

### Building

```bash
# Package the extension
npm install -g vsce
vsce package
```

## 📝 Changelog

### [1.0.0] - 2025-01-XX

#### Added

- Initial release
- Right-click context menu integration
- Persistent mark storage
- Configurable colors
- Navigation between marks
- Smart position adjustment on text edits

## 🐛 Known Issues

- Marks may not persist correctly if files are moved outside of VS Code
- Very large files (>10MB) may experience slight performance impact

## 📮 Feedback & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mark-it-extension/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/mark-it-extension/discussions)
- **Email**: your.email@example.com

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

## ⭐ Support

If you find this extension helpful, please:

- ⭐ Star the repository
- 📝 Leave a review on the VS Code Marketplace
- 🐛 Report any bugs or issues
- 💡 Suggest new features

---

**Enjoy marking your code!** 🎉

---

## 📊 Stats

- **Active Installs**: Coming Soon
- **Rating**: ⭐⭐⭐⭐⭐ (5.0/5)
- **Downloads**: Coming Soon

## 🏷️ Tags

`highlight` `bookmark` `code-marking` `persistent` `productivity` `navigation` `code-review` `study` `debugging`
