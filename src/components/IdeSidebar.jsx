import { useState, useRef, useEffect, useCallback } from "react";

export default function IdeSidebar({ files, activeFile, onFileSelect, onNewFile }) {
  // "idle" | "picking" | "file" | "folder"
  const [mode, setMode] = useState("idle");
  const [newName, setNewName] = useState("");
  const [folderPrefix, setFolderPrefix] = useState(""); // for file-inside-folder
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (mode === "file" || mode === "folder") inputRef.current?.focus();
  }, [mode]);

  // Close picker if clicked outside
  useEffect(() => {
    if (mode !== "picking") return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMode("idle");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mode]);

  const commit = useCallback(() => {
    const name = newName.trim();
    if (!name) { setMode("idle"); setNewName(""); return; }

    if (mode === "file") {
      // Default to .tsx for React Native components, .ts for pure logic
      const withExt = name.includes(".") ? name : `${name}.tsx`;
      const fullName = folderPrefix ? `${folderPrefix}/${withExt}` : withExt;
      onNewFile(fullName);
    } else if (mode === "folder") {
      // Create a placeholder file inside the folder so it shows up in the tree
      onNewFile(`${name}/.gitkeep`);
    }
    setMode("idle");
    setNewName("");
    setFolderPrefix("");
  }, [mode, newName, folderPrefix, onNewFile]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") { setMode("idle"); setNewName(""); setFolderPrefix(""); }
  }, [commit]);

  // Group files into folders (hide placeholder .gitkeep)
  const visibleFiles = files.filter((f) => !f.name.endsWith("/.gitkeep"));
  const grouped = visibleFiles.reduce((acc, file) => {
    const parts = file.name.split("/");
    if (parts.length === 1) {
      acc.__root__ = acc.__root__ ?? [];
      acc.__root__.push(file);
    } else {
      const folder = parts[0];
      acc[folder] = acc[folder] ?? [];
      acc[folder].push(file);
    }
    return acc;
  }, {});

  return (
    <aside className="ide-sidebar">
      <div className="sidebar-section-header">
        <span>Files</span>
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            type="button"
            className="sidebar-new-btn"
            title="New file or folder"
            onClick={() => setMode(mode === "picking" ? "idle" : "picking")}
          >
            +
          </button>
          {mode === "picking" && (
            <div className="new-item-menu">
              <button type="button" className="new-item-option" onClick={() => { setMode("file"); setFolderPrefix(""); }}>
                <span className="new-item-icon">📄</span> New File
              </button>
              <button type="button" className="new-item-option" onClick={() => setMode("folder")}>
                <span className="new-item-icon">📁</span> New Folder
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="tree-root-label">
        <span className="tree-caret">▾</span>
        runway-prototype
      </div>

      {/* New file/folder input */}
      {(mode === "file" || mode === "folder") && (
        <div className="tree-new-input-wrap">
          <span className="tree-new-icon">{mode === "folder" ? "📁" : "📄"}</span>
          <input
            ref={inputRef}
            type="text"
            className="tree-new-input"
            placeholder={mode === "folder" ? "folder-name" : "filename.tsx"}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
          />
        </div>
      )}

      {/* Root-level files */}
      {(grouped.__root__ ?? []).map((file) => (
        <TreeItem
          key={file.name}
          file={file}
          indent={1}
          isActive={file.name === activeFile}
          onSelect={onFileSelect}
        />
      ))}

      {/* Folders */}
      {Object.entries(grouped)
        .filter(([key]) => key !== "__root__")
        .map(([folder, folderFiles]) => (
          <div key={folder}>
            <div className="tree-item tree-folder" style={{ paddingLeft: 16 }}>
              <span className="tree-caret">▾</span>
              <span className="tree-name">{folder}/</span>
            </div>
            {folderFiles.map((file) => (
              <TreeItem
                key={file.name}
                file={file}
                indent={2}
                isActive={file.name === activeFile}
                onSelect={onFileSelect}
              />
            ))}
          </div>
        ))}
    </aside>
  );
}

function TreeItem({ file, indent, isActive, onSelect }) {
  const shortName = file.name.split("/").at(-1);
  return (
    <button
      type="button"
      className={`tree-item${isActive ? " is-active" : ""}`}
      style={{ paddingLeft: 8 + indent * 10 }}
      onClick={() => onSelect(file.name)}
    >
      <span className={`tree-dot ${file.accent}`} />
      <span className="tree-name">{shortName}</span>
    </button>
  );
}
