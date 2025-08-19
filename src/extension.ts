import * as vscode from "vscode";

interface MarkedRange {
  id: string;
  filePath: string;
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
  text: string;
  timestamp: number;
}

interface StoredMarks {
  [filePath: string]: MarkedRange[];
}

class MarkItManager {
  private context: vscode.ExtensionContext;
  private decorationType: vscode.TextEditorDecorationType;
  private markedRanges: Map<string, MarkedRange[]> = new Map();
  private readonly STORAGE_KEY = "markItData";

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.decorationType = this.createDecorationType();
    this.loadMarkedRanges();
    this.setupEventListeners();
  }

  private createDecorationType(): vscode.TextEditorDecorationType {
    const config = vscode.workspace.getConfiguration("markIt");

    return vscode.window.createTextEditorDecorationType({
      backgroundColor: config.get("highlightColor", "rgba(207, 222, 10, 0.85)"),
      border: `1px solid ${config.get("borderColor", "#fffb00ff")}`,
      borderRadius: "3px",
      overviewRulerColor: config.get("showInOverviewRuler", true)
        ? "#ecd526ff"
        : undefined,
      overviewRulerLane: vscode.OverviewRulerLane.Right,
      isWholeLine: false,
    });
  }

  private setupEventListeners() {
    // Listen for active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        this.updateDecorations(editor);
      }
    });

    // Listen for text document changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document) {
        this.handleDocumentChange(event);
      }
    });

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("markIt")) {
        this.decorationType.dispose();
        this.decorationType = this.createDecorationType();
        this.refreshAllDecorations();
      }
    });

    // Listen for file saves to persist marks
    vscode.workspace.onDidSaveTextDocument(() => {
      this.saveMarkedRanges();
    });
  }

  private handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
    const filePath = this.getRelativeFilePath(event.document.uri);
    const marks = this.markedRanges.get(filePath);

    if (!marks || marks.length === 0) return;

    // Update mark positions based on text changes
    for (const change of event.contentChanges) {
      this.adjustMarksForChange(marks, change);
    }

    // Update decorations
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this.updateDecorations(editor);
    }
  }

  private adjustMarksForChange(
    marks: MarkedRange[],
    change: vscode.TextDocumentContentChangeEvent
  ) {
    const changeStart = change.range.start;
    const changeEnd = change.range.end;
    const lineDelta =
      change.text.split("\n").length - 1 - (changeEnd.line - changeStart.line);

    for (let i = marks.length - 1; i >= 0; i--) {
      const mark = marks[i];

      // If change is before the mark, adjust the mark position
      if (
        changeEnd.line < mark.startLine ||
        (changeEnd.line === mark.startLine &&
          changeEnd.character <= mark.startCharacter)
      ) {
        mark.startLine += lineDelta;
        mark.endLine += lineDelta;
      }
      // If change overlaps with the mark, remove the mark
      else if (this.rangesOverlap(changeStart, changeEnd, mark)) {
        marks.splice(i, 1);
      }
    }
  }

  private rangesOverlap(
    changeStart: vscode.Position,
    changeEnd: vscode.Position,
    mark: MarkedRange
  ): boolean {
    const markStart = new vscode.Position(mark.startLine, mark.startCharacter);
    const markEnd = new vscode.Position(mark.endLine, mark.endCharacter);

    return !(changeEnd.isBefore(markStart) || changeStart.isAfter(markEnd));
  }

  public async markSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor found");
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showWarningMessage("Please select some text to mark");
      return;
    }

    const filePath = this.getRelativeFilePath(editor.document.uri);
    const selectedText = editor.document.getText(selection);

    const markedRange: MarkedRange = {
      id: this.generateId(),
      filePath,
      startLine: selection.start.line,
      startCharacter: selection.start.character,
      endLine: selection.end.line,
      endCharacter: selection.end.character,
      text: selectedText,
      timestamp: Date.now(),
    };

    // Add to marked ranges
    if (!this.markedRanges.has(filePath)) {
      this.markedRanges.set(filePath, []);
    }
    this.markedRanges.get(filePath)!.push(markedRange);

    // Update decorations
    this.updateDecorations(editor);

    // Save to persistent storage
    this.saveMarkedRanges();

    vscode.window.showInformationMessage(
      `Marked: "${selectedText.substring(0, 50)}${
        selectedText.length > 50 ? "..." : ""
      }"`
    );
  }
  public async chooseColor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor found");
      return;
    }
    const colorCombos = [
      {
        backgroundColor: "#1E293B", // Dark Blue Gray
        textColor: "#F1F5F9", // Soft White
        borderColor: "#334155", // Slate Gray
      },
      {
        backgroundColor: "#F43F5E", // Rose Red
        textColor: "#FFFFFF", // White
        borderColor: "#BE123C", // Dark Rose
      },
      {
        backgroundColor: "#10B981", // Emerald Green
        textColor: "#FFFFFF", // White
        borderColor: "#047857", // Deep Emerald
      },
      {
        backgroundColor: "#F59E0B", // Amber
        textColor: "#1E293B", // Navy Text
        borderColor: "#B45309", // Burnt Orange
      },
      {
        backgroundColor: "#3B82F6", // Blue
        textColor: "#FFFFFF", // White
        borderColor: "#1D4ED8", // Royal Blue
      },
      {
        backgroundColor: "#8B5CF6", // Violet
        textColor: "#FFFFFF", // White
        borderColor: "#6D28D9", // Deep Violet
      },
      {
        backgroundColor: "#EC4899", // Pink
        textColor: "#FFFFFF", // White
        borderColor: "#BE185D", // Dark Pink
      },
      {
        backgroundColor: "#F97316", // Orange
        textColor: "#FFFFFF", // White
        borderColor: "#C2410C", // Burnt Orange
      },
      {
        backgroundColor: "#14B8A6", // Teal
        textColor: "#FFFFFF", // White
        borderColor: "#0F766E", // Deep Teal
      },
      {
        backgroundColor: "#E5E7EB", // Light Gray
        textColor: "#111827", // Almost Black
        borderColor: "#9CA3AF", // Medium Gray
      },
    ];

    //giev option to user to select color
  }

  public async unmarkSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor found");
      return;
    }

    const filePath = this.getRelativeFilePath(editor.document.uri);
    const marks = this.markedRanges.get(filePath);

    if (!marks || marks.length === 0) {
      vscode.window.showInformationMessage("No marks found in this file");
      return;
    }

    const cursorPosition = editor.selection.active;

    // Find mark at cursor position
    const markIndex = marks.findIndex((mark) => {
      const markRange = new vscode.Range(
        mark.startLine,
        mark.startCharacter,
        mark.endLine,
        mark.endCharacter
      );
      return markRange.contains(cursorPosition);
    });

    if (markIndex === -1) {
      vscode.window.showInformationMessage("No mark found at cursor position");
      return;
    }

    const removedMark = marks[markIndex];
    marks.splice(markIndex, 1);

    // Update decorations
    this.updateDecorations(editor);

    // Save to persistent storage
    this.saveMarkedRanges();

    vscode.window.showInformationMessage(
      `Unmarked: "${removedMark.text.substring(0, 50)}${
        removedMark.text.length > 50 ? "..." : ""
      }"`
    );
  }

  public async clearAllMarks() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor found");
      return;
    }

    const filePath = this.getRelativeFilePath(editor.document.uri);
    const marks = this.markedRanges.get(filePath);

    if (!marks || marks.length === 0) {
      vscode.window.showInformationMessage("No marks found in this file");
      return;
    }

    const answer = await vscode.window.showWarningMessage(
      `Are you sure you want to clear all ${marks.length} marks from this file?`,
      { modal: true },
      "Yes",
      "No"
    );

    if (answer === "Yes") {
      this.markedRanges.set(filePath, []);
      this.updateDecorations(editor);
      this.saveMarkedRanges();
      vscode.window.showInformationMessage("All marks cleared from this file");
    }
  }

  public async listAllMarks() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor found");
      return;
    }

    const filePath = this.getRelativeFilePath(editor.document.uri);
    const marks = this.markedRanges.get(filePath);

    if (!marks || marks.length === 0) {
      vscode.window.showInformationMessage("No marks found in this file");
      return;
    }

    const items = marks.map((mark, index) => ({
      label: `Line ${mark.startLine + 1}: ${mark.text.substring(0, 60)}${
        mark.text.length > 60 ? "..." : ""
      }`,
      description: `Created: ${new Date(mark.timestamp).toLocaleString()}`,
      detail: mark.text,
      mark,
      index,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a mark to navigate to",
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (selected) {
      const range = new vscode.Range(
        selected.mark.startLine,
        selected.mark.startCharacter,
        selected.mark.endLine,
        selected.mark.endCharacter
      );

      editor.selection = new vscode.Selection(range.start, range.end);
      editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    }
  }

  private updateDecorations(editor: vscode.TextEditor) {
    const filePath = this.getRelativeFilePath(editor.document.uri);
    const marks = this.markedRanges.get(filePath) || [];

    const decorations: vscode.DecorationOptions[] = marks.map((mark) => ({
      range: new vscode.Range(
        mark.startLine,
        mark.startCharacter,
        mark.endLine,
        mark.endCharacter
      ),
      hoverMessage: `Marked: "${mark.text}"\nCreated: ${new Date(
        mark.timestamp
      ).toLocaleString()}`,
    }));

    editor.setDecorations(this.decorationType, decorations);
  }

  private refreshAllDecorations() {
    vscode.window.visibleTextEditors.forEach((editor) => {
      this.updateDecorations(editor);
    });
  }

  private loadMarkedRanges() {
    const storedData = this.context.globalState.get<StoredMarks>(
      this.STORAGE_KEY,
      {}
    );

    for (const [filePath, marks] of Object.entries(storedData)) {
      this.markedRanges.set(filePath, marks);
    }

    // Update decorations for currently open editors
    vscode.window.visibleTextEditors.forEach((editor) => {
      this.updateDecorations(editor);
    });
  }

  private saveMarkedRanges() {
    const dataToStore: StoredMarks = {};

    for (const [filePath, marks] of this.markedRanges.entries()) {
      if (marks.length > 0) {
        dataToStore[filePath] = marks;
      }
    }

    this.context.globalState.update(this.STORAGE_KEY, dataToStore);
  }

  private getRelativeFilePath(uri: vscode.Uri): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
      if (workspaceFolder) {
        return vscode.workspace.asRelativePath(uri, false);
      }
    }
    return uri.fsPath;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public dispose() {
    this.decorationType.dispose();
  }
}

let markItManager: MarkItManager;

export function activate(context: vscode.ExtensionContext) {
  console.log("Mark It extension is now active!");

  // Initialize the manager
  markItManager = new MarkItManager(context);

  // Register commands
  const commands = [
    vscode.commands.registerCommand("markIt.markSelection", () =>
      markItManager.markSelection()
    ),
    vscode.commands.registerCommand("markIt.unmarkSelection", () =>
      markItManager.unmarkSelection()
    ),
    vscode.commands.registerCommand("markIt.clearAllMarks", () =>
      markItManager.clearAllMarks()
    ),
    vscode.commands.registerCommand("markIt.listAllMarks", () =>
      markItManager.listAllMarks()
    ),
  ];

  context.subscriptions.push(...commands, markItManager);
}

export function deactivate() {
  if (markItManager) {
    markItManager.dispose();
  }
}
