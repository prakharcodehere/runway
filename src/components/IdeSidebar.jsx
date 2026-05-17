import { useState, useRef, useEffect, useCallback } from "react";

export default function IdeSidebar({
  files, activeFile, onFileSelect, onNewFile,
  detectedPackages = [], extraPackages = [],
  onAddPackage, onRemovePackage,
  projectName, onRenameProject,
}) {
  // "idle" | "picking" | "file" | "folder"
  const [mode, setMode] = useState("idle");
  const [newName, setNewName] = useState("");
  const [folderPrefix, setFolderPrefix] = useState("");
  const [editingProject, setEditingProject] = useState(false);
  const [projectInput, setProjectInput] = useState(projectName);
  const projectInputRef = useRef(null);
  const [pkgOpen, setPkgOpen] = useState(false);
  const [pkgInput, setPkgInput] = useState("");
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const pkgInputRef = useRef(null);

  useEffect(() => {
    if (mode === "file" || mode === "folder") inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (editingProject) projectInputRef.current?.focus();
  }, [editingProject]);

  const commitProjectName = useCallback(() => {
    const name = projectInput.trim();
    if (name && name !== projectName) onRenameProject(name);
    setEditingProject(false);
  }, [projectInput, projectName, onRenameProject]);

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

  const commitPkg = useCallback(() => {
    const pkg = pkgInput.trim().toLowerCase();
    if (pkg) { onAddPackage(pkg); setPkgInput(""); }
  }, [pkgInput, onAddPackage]);

  const allPkgCount = detectedPackages.length + extraPackages.length;

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

      <div className="tree-root-label" onDoubleClick={() => { setProjectInput(projectName); setEditingProject(true); }}>
        <span className="tree-caret">▾</span>
        {editingProject ? (
          <input
            ref={projectInputRef}
            type="text"
            className="tree-project-input"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitProjectName();
              if (e.key === "Escape") setEditingProject(false);
            }}
            onBlur={commitProjectName}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span title="Double-click to rename">{projectName}</span>
        )}
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
      {/* ── Packages panel ── */}
      <div className="pkg-section">
        <button
          type="button"
          className="pkg-header"
          onClick={() => setPkgOpen((o) => !o)}
        >
          <span className="pkg-header-label">
            <span className="pkg-header-caret">{pkgOpen ? "▾" : "▸"}</span>
            Packages
          </span>
          {allPkgCount > 0 && (
            <span className="pkg-count">{allPkgCount}</span>
          )}
        </button>

        {pkgOpen && (
          <div className="pkg-body">
            {/* Auto-detected */}
            {detectedPackages.length > 0 && (
              <div className="pkg-group">
                <div className="pkg-group-label">auto-detected</div>
                {detectedPackages.map((name) => (
                  <div key={name} className="pkg-chip pkg-chip-auto">
                    <span className="pkg-chip-dot" />
                    {name}
                  </div>
                ))}
              </div>
            )}

            {/* Manually added */}
            {extraPackages.length > 0 && (
              <div className="pkg-group">
                <div className="pkg-group-label">added</div>
                {extraPackages.map((name) => (
                  <div key={name} className="pkg-chip pkg-chip-manual">
                    <span className="pkg-chip-dot" />
                    {name}
                    <button
                      type="button"
                      className="pkg-chip-remove"
                      onClick={() => onRemovePackage(name)}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add package input */}
            <div className="pkg-input-row">
              <input
                ref={pkgInputRef}
                type="text"
                className="pkg-input"
                placeholder="axios, lodash, date-fns…"
                value={pkgInput}
                onChange={(e) => setPkgInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitPkg();
                  if (e.key === "Escape") setPkgInput("");
                }}
              />
              <button
                type="button"
                className="pkg-add-btn"
                onClick={commitPkg}
                disabled={!pkgInput.trim()}
              >+</button>
            </div>
          </div>
        )}
      </div>
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
