import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const [isCreateModalShow, setIsCreateModalShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch user data and projects
  const getUserData = async () => {
    try {
      const res = await fetch(api_base_url + "/getUserData", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: localStorage.getItem("token")
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserName(data.user.name || "Developer");
      } else {
        toast.error(data.msg || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const getProjects = async () => {
    try {
      const res = await fetch(api_base_url + "/getProjects", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: localStorage.getItem("token")
        })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        toast.error(data.msg || "Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    getUserData();
    getProjects();
  }, []);

  const createProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!projectDescription.trim()) {
      toast.error("Project description is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(api_base_url + "/createProj", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          token: localStorage.getItem("token")
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project created successfully!");
        setProjectName("");
        setProjectDescription("");
        setIsCreateModalShow(false);
        getProjects();
      } else {
        toast.error(data.msg || "Failed to create project");
      }
    } catch (err) {
      toast.error("Error creating project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectId: id,
        token: localStorage.getItem("token")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        toast.success("Project deleted successfully");
        getProjects();
      } else {
        toast.error(data.msg || "Failed to delete project");
      }
    });
  };

  const openProject = (projectId) => {
    navigate("/editior/" + projectId);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gray-950 border-b border-gray-800 px-8 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              👋 Welcome, {userName}
            </h1>
            <p className="text-gray-400">Manage your coding projects and continue where you left off</p>
          </div>
          <button
            onClick={() => setIsCreateModalShow(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Projects list (spans 2 columns on md+) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Your Projects</h2>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 hover:bg-gray-900/80 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => openProject(project._id)}
                      >
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {project.description || "No description provided"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📅 {new Date(project.created_at || project.date).toLocaleDateString()}</span>
                          <span>🕐 {new Date(project.created_at || project.date).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <button
                          onClick={() => openProject(project._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-gray-400 text-lg">No projects yet</p>
                <p className="text-gray-500 text-sm mt-2">Create your first project to get started</p>
              </div>
            )}
          </div>

          {/* Right: Metrics and Activity Graph */}
          <div className="md:col-span-1 space-y-6">
            {/* Stats Cards (stacked for smaller footprint) */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold text-white mt-2">{projects.length}</p>
                  </div>
                  <div className="text-4xl">📁</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Sessions</p>
                    <p className="text-3xl font-bold text-white mt-2">0</p>
                  </div>
                  <div className="text-4xl">🔴</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Last Active</p>
                    <p className="text-xl font-bold text-white mt-2">Today</p>
                  </div>
                  <div className="text-4xl">⏱️</div>
                </div>
              </div>
            </div>

            {/* Activity Graph Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Activity Graph</h3>
              <div className="h-48 bg-gray-950 rounded-lg flex items-center justify-center border border-gray-800">
                <div className="text-center">
                  <p className="text-5xl mb-2">📊</p>
                  <p className="text-gray-500">Your activity chart will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modal-backdrop")) {
              setIsCreateModalShow(false);
            }
          }}
          className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Project Description
                </label>
                <textarea
                  placeholder="What is your project about?"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setIsCreateModalShow(false);
                  setProjectName("");
                  setProjectDescription("");
                }}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
