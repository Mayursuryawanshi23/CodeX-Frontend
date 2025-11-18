import React, { useEffect, useState, useRef } from 'react';
import Editor2 from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

// Detect language from file extension
const detectLanguage = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const languageMap = {
    'py': 'python3',
    'js': 'javascript',
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'java': 'java',
    'html': 'html',
    'htm': 'html',
    'css': 'css'
  };
  return languageMap[ext] || null;
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [projectData, setProjectData] = useState(null);
  const [fileTree, setFileTree] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createContext, setCreateContext] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [resizing, setResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const containerRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  // Output panel resizing and collapse
  const [outputWidth, setOutputWidth] = useState(360); // px
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const [outputResizing, setOutputResizing] = useState(false);
  const outputRef = useRef(null);
  const editorAreaRef = useRef(null);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${api_base_url}/getProject`, {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: localStorage.getItem('token'),
            projectId: id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProjectData(data.project);
          
          if (data.project.fileTree && data.project.fileTree.length > 0) {
            setFileTree(data.project.fileTree);
            const firstFile = findFirstFile(data.project.fileTree);
            if (firstFile) {
              setCurrentFile(firstFile);
              setCode(firstFile.content || '');
            }
          } else {
            const defaultFile = {
              id: generateId(),
              name: `main.${getExtension(data.project.language)}`,
              type: 'file',
              content: data.project.code || '',
              language: data.project.language,
              children: []
            };
            setFileTree([defaultFile]);
            setCurrentFile(defaultFile);
            setCode(defaultFile.content);
          }
        } else {
          toast.error(data.msg);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // initialize output width based on editor area on mount
  useEffect(() => {
    const setInitial = () => {
      if (editorAreaRef.current) {
        const total = editorAreaRef.current.getBoundingClientRect().width;
        const initial = Math.max(240, Math.floor(total * 0.33));
        setOutputWidth(initial);
      }
    };
    setInitial();
    window.addEventListener('resize', setInitial);
    return () => window.removeEventListener('resize', setInitial);
  }, []);

  const findFirstFile = (nodes) => {
    for (let node of nodes) {
      if (node.type === 'file') return node;
      if (node.children && node.children.length > 0) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getExtension = (language) => {
    const extensions = {
      python: 'py', javascript: 'js', java: 'java', cpp: 'cpp',
      c: 'c', go: 'go', bash: 'sh'
    };
    return extensions[language] || 'txt';
  };

  const getLanguageFromExtension = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const map = {
      py: 'python', js: 'javascript', ts: 'typescript',
      java: 'java', cpp: 'cpp', c: 'c', go: 'go',
      sh: 'bash', html: 'html', css: 'css', json: 'json'
    };
    return map[ext] || 'text';
  };

  const getFileIcon = (type, name) => {
    if (type === 'folder') return '📁';
    const ext = name.split('.').pop().toLowerCase();
    const icons = {
      py: '🐍', js: '⚙️', ts: '📘', java: '☕', cpp: '⚡',
      c: '🔧', go: '🐹', sh: '🔗', html: '🌐', css: '🎨',
      json: '{}', txt: '📄'
    };
    return icons[ext] || '📄';
  };

  // Add new file/folder
  const addNewItem = () => {
    if (!newItemName.trim()) {
      toast.error('Name required');
      return;
    }

    const newItem = {
      id: generateId(),
      name: newItemName,
      type: createContext.type,
      ...(createContext.type === 'file' ? {
        content: '',
        language: getLanguageFromExtension(newItemName)
      } : {
        children: []
      })
    };

    const updatedTree = addItemToTree(fileTree, createContext.parentId, newItem);
    setFileTree(updatedTree);

    if (createContext.type === 'file') {
      setCurrentFile(newItem);
      setCode('');
    } else {
      setExpandedFolders(new Set([...expandedFolders, newItem.id]));
    }

    setNewItemName('');
    setShowCreateModal(false);
    setCreateContext(null);
    toast.success(`${createContext.type === 'file' ? 'File' : 'Folder'} created`);
  };

  const addItemToTree = (nodes, parentId, newItem) => {
    if (!parentId) {
      return [...nodes, newItem];
    }

    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        return {
          ...node,
          children: [...(node.children || []), newItem]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addItemToTree(node.children, parentId, newItem)
        };
      }
      return node;
    });
  };

  // Delete file/folder
  const deleteItem = (itemId) => {
    if (window.confirm('Delete this item?')) {
      const updatedTree = removeItemFromTree(fileTree, itemId);
      setFileTree(updatedTree);
      
      if (currentFile?.id === itemId) {
        const firstFile = findFirstFile(updatedTree);
        if (firstFile) {
          setCurrentFile(firstFile);
          setCode(firstFile.content || '');
        } else {
          setCurrentFile(null);
          setCode('');
        }
      }
      toast.success('Deleted');
    }
  };

  const removeItemFromTree = (nodes, itemId) => {
    return nodes
      .filter(node => node.id !== itemId)
      .map(node => {
        if (node.children) {
          return {
            ...node,
            children: removeItemFromTree(node.children, itemId)
          };
        }
        return node;
      });
  };

  // Toggle folder
  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Render file tree recursively
  const FileTreeNode = ({ node, depth = 0 }) => {
    const isExpanded = expandedFolders.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={`group mb-0.5 rounded flex items-center px-2 py-1 cursor-pointer transition-colors ${
            currentFile?.id === node.id
              ? 'bg-blue-600/30 text-blue-200'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <>
              <button
                onClick={() => toggleFolder(node.id)}
                className="mr-1 flex-shrink-0 w-4 text-center text-xs hover:bg-gray-700 rounded"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
              <span className="text-lg mr-1">📁</span>
              <span className="flex-1 truncate text-sm">{node.name}</span>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateContext({ parentId: node.id, type: 'file' });
                    setShowCreateModal(true);
                  }}
                  className="px-1.5 py-0.5 bg-green-600/20 hover:bg-green-600/40 text-green-300 text-xs rounded transition-colors"
                  title="New File"
                >
                  +F
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateContext({ parentId: node.id, type: 'folder' });
                    setShowCreateModal(true);
                  }}
                  className="px-1.5 py-0.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs rounded transition-colors"
                  title="New Folder"
                >
                  +D
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(node.id);
                  }}
                  className="px-1.5 py-0.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs rounded transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-lg mr-1">{getFileIcon('file', node.name)}</span>
              <span 
                className="flex-1 truncate text-sm"
                onClick={() => {
                  setCurrentFile(node);
                  setCode(node.content || '');
                }}
              >
                {node.name}
              </span>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(node.id);
                  }}
                  className="px-1.5 py-0.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs rounded transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </>
          )}
        </div>

        {node.type === 'folder' && isExpanded && hasChildren && (
          <div>
            {node.children.map(child => (
              <FileTreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Save current file
  const saveFile = async (silent = false) => {
    if (!currentFile) return;
    if (isSaving) return; // avoid concurrent saves

    setIsSaving(true);
    try {
      const updatedTree = updateFileContent(fileTree, currentFile.id, code);

      const res = await fetch(`${api_base_url}/saveProject`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          projectId: id,
          code: code,
          fileTree: updatedTree
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFileTree(updatedTree);
        setCurrentFile({ ...currentFile, content: code });
        if (!silent) toast.success('Saved');
      } else {
        if (!silent) toast.error(data.msg);
      }
    } catch (err) {
      console.error('Save error:', err);
      if (!silent) toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFileContent = (nodes, fileId, content) => {
    return nodes.map(node => {
      if (node.id === fileId && node.type === 'file') {
        return { ...node, content };
      }
      if (node.children) {
        return {
          ...node,
          children: updateFileContent(node.children, fileId, content)
        };
      }
      return node;
    });
  };

  // Keyboard shortcut for save
  useEffect(() => {
    const handleSave = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    };
    window.addEventListener('keydown', handleSave);
    return () => window.removeEventListener('keydown', handleSave);
  }, [currentFile, code]);

  // Auto-save: debounce saves when code changes
  useEffect(() => {
    if (!currentFile) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    // Debounce interval: 1.5s after last change
    saveTimeoutRef.current = setTimeout(() => {
      saveFile(true); // silent auto-save
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [code, currentFile?.id]);

  // Run code with intelligent language detection
  const runCode = async () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }
    // If output pane is collapsed, expand it so user can see results
    if (outputCollapsed) setOutputCollapsed(false);

    const language = detectLanguage(currentFile.name);
    if (!language) {
      toast.error(`Unsupported file type: ${currentFile.name}`);
      return;
    }

    try {
      setOutput('Executing...');

      const className = currentFile.name.replace('.java', '').split('/').pop();
      const filename = language === 'python3' ? 'main.py' : 
                      language === 'javascript' ? 'main.js' :
                      language === 'c' ? 'main.c' :
                      language === 'cpp' ? 'main.cpp' :
                      language === 'java' ? `${className}.java` :
                      currentFile.name;

      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language,
          version: "*",
          files: [{
            filename: filename,
            content: code
          }]
        })
      });

      const data = await res.json();

      // Handle compile errors (C, C++, Java)
      if (data.compile && data.compile.stderr) {
        setOutput(`❌ COMPILATION ERROR:\n\n${data.compile.stderr}`);
        setError(true);
        return;
      }

      // Handle HTML preview
      if (language === 'html') {
        setOutput(`<preview>${code}</preview>`);
        setError(false);
        return;
      }

      // Handle CSS styling
      if (language === 'css') {
        setOutput(`<style>${code}</style>`);
        setError(false);
        return;
      }

      // Handle runtime execution
      if (data.run) {
        const output = data.run.output || '';
        const stderr = data.run.stderr || '';
        
        if (stderr) {
          setOutput(`❌ RUNTIME ERROR:\n\n${stderr}\n\n--- Output ---\n${output}`);
          setError(true);
        } else if (output) {
          setOutput(output);
          setError(false);
        } else {
          setOutput('Program executed successfully with no output');
          setError(false);
        }
      } else {
        setOutput('No output received from execution');
        setError(true);
      }
    } catch (err) {
      toast.error('Error running code');
      setOutput(`Error: ${err.message}`);
      setError(true);
      console.error(err);
    }
  };

  // Output panel resizing handlers
  const handleOutputMouseDown = (e) => {
    e.preventDefault();
    setOutputResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!outputResizing || !editorAreaRef.current) return;
      const rect = editorAreaRef.current.getBoundingClientRect();
      const newWidth = Math.max(200, rect.right - e.clientX);
      // constrain max width to 80% of editor area
      const maxW = Math.floor(rect.width * 0.8);
      setOutputWidth(Math.min(newWidth, maxW));
    };

    const handleMouseUp = () => {
      if (outputResizing) setOutputResizing(false);
    };

    if (outputResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [outputResizing]);

  const toggleOutput = () => {
    if (outputCollapsed) {
      // restore to previous or default
      setOutputCollapsed(false);
    } else {
      setOutputCollapsed(true);
    }
  };

  // Handle resize
  const handleMouseDown = () => {
    setResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizing) return;
      const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setResizing(false);
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div ref={containerRef} className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded transition-colors mr-2"
            aria-label="Back to projects"
          >
            ← Back
          </button>
          <div className="text-2xl">💻</div>
          <div>
            <h1 className="text-white font-bold text-lg ml-1">{projectData?.name}</h1>
            <p className="text-gray-400 text-xs">{projectData?.language}</p>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="bg-gray-950 border-r border-gray-800 overflow-y-auto"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Toolbar */}
          <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-3 space-y-2">
            <h2 className="text-white font-semibold text-sm">File Explorer</h2>
            <div className="flex gap-2">
              <button
                onClick={() => saveFile(false)}
                className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                title="Save"
              >
                {isSaving ? 'Saving...' : '💾 Save'}
              </button>
              <button
                onClick={() => {
                  setCreateContext({ parentId: null, type: 'file' });
                  setShowCreateModal(true);
                }}
                className="flex-1 px-2 py-1.5 text-xs bg-green-600/20 hover:bg-green-600/40 text-green-300 rounded transition-colors font-medium"
              >
                + File
              </button>
              <button
                onClick={() => {
                  setCreateContext({ parentId: null, type: 'folder' });
                  setShowCreateModal(true);
                }}
                className="flex-1 px-2 py-1.5 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded transition-colors font-medium"
              >
                + Folder
              </button>
            </div>
          </div>

          {/* File Tree */}
          <div className="p-2">
            {fileTree.length === 0 ? (
              <div className="text-gray-500 text-xs p-4 text-center">
                No files. Create one!
              </div>
            ) : (
              fileTree.map(node => (
                <FileTreeNode key={node.id} node={node} depth={0} />
              ))
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-gray-950 border-b border-gray-800 px-4 py-2">
            {currentFile && (
              <div className="flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span>{getFileIcon(currentFile.type, currentFile.name)}</span>
                  <span className="truncate max-w-[60vw]">{currentFile.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={runCode}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                    title="Run"
                  >
                    ▶
                  </button>
                  <button
                    onClick={toggleOutput}
                    className="px-2 py-1 text-xs text-gray-200 bg-gray-800 hover:bg-gray-700 rounded"
                    title={outputCollapsed ? 'Maximize output' : 'Minimize output'}
                  >
                    {outputCollapsed ? '🔼' : '🔽'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Editor + Output */}
          <div ref={editorAreaRef} className="flex-1 flex gap-1 overflow-hidden bg-black p-1">
            {/* Editor */}
            <div className="flex-1 overflow-hidden rounded bg-gray-950">
              {currentFile ? (
                <Editor2
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  language={currentFile.language || 'javascript'}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Select a file to edit
                </div>
              )}
            </div>
            {/* Resize handle between editor and output */}
            {!outputCollapsed && (
              <div
                onMouseDown={handleOutputMouseDown}
                className={`w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors`}
              />
            )}

            {/* Output */}
            <div
              ref={outputRef}
              className="flex flex-col rounded bg-gray-950 border border-gray-800 overflow-hidden transition-all duration-150"
              style={{ width: outputCollapsed ? 0 : `${outputWidth}px` }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900">
                <span className="text-white font-semibold text-sm">Output</span>
                <span className="text-gray-400 text-xs">{outputCollapsed ? 'Collapsed' : `${Math.round(outputWidth)}px`}</span>
              </div>

              <div style={{ display: outputCollapsed ? 'none' : 'block' }}>
                <pre
                  className={`flex-1 overflow-auto p-4 text-xs font-mono whitespace-pre-wrap break-words ${
                    error ? 'text-red-400' : 'text-gray-300'
                  }`}
                >
                  {output || '(output here)'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div
          onClick={(e) => e.target.classList.contains('modal-bg') && setShowCreateModal(false)}
          className="modal-bg fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 shadow-2xl">
            <h2 className="text-white font-bold mb-4">
              New {createContext?.type === 'file' ? 'File' : 'Folder'}
            </h2>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={createContext?.type === 'file' ? 'index.js' : 'src'}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && addNewItem()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewItemName('');
                  setCreateContext(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addNewItem}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
