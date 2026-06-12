import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('brixo_token');

const apiCall = async (method, path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

/**
 * useProject — load, save, auto-save, publish, or delete a single project.
 * Uses /api/website/:id endpoints (existing backend).
 */
export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    apiCall('GET', `/website/${projectId}`)
      .then((d) => setProject(d.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const saveProject = useCallback(
    async (updates) => {
      if (!projectId) return;
      setSaving(true);
      try {
        const data = await apiCall('PUT', `/website/${projectId}`, updates);
        setProject(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setSaving(false);
      }
    },
    [projectId]
  );

  /** Debounce saves — waits 2 s after last call before hitting the network */
  const autoSave = useCallback(
    (updates) => {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => saveProject(updates), 2000);
    },
    [saveProject]
  );

  const publishProject = useCallback(async () => {
    if (!projectId) return null;
    const data = await apiCall('POST', `/website/${projectId}/publish`);
    return data.data?.publishedUrl || data.data?.url;
  }, [projectId]);

  const deleteProject = useCallback(async () => {
    if (!projectId) return;
    await apiCall('DELETE', `/website/${projectId}`);
  }, [projectId]);

  return { project, loading, saving, error, saveProject, autoSave, publishProject, deleteProject };
}

/**
 * useProjects — list all projects for the current user, and create new ones.
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('brixo_user') || 'null');
      if (!user?.id) return;
      const data = await apiCall('GET', `/website/user/${user.id}`);
      setProjects(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (payload = {}) => {
    const data = await apiCall('POST', '/website', payload);
    setProjects((prev) => [data.data, ...prev]);
    return data.data;
  };

  return { projects, loading, error, fetchProjects, createProject };
}

export default useProject;
