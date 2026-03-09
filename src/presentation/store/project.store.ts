import { createSignal } from 'solid-js';
import type { Project } from '../../domain/entities/project.entity';
import { projectRepository } from '../../infrastructure/repositories/project.repository.impl';

// Global signal for projects
const [projects, setProjects] = createSignal<Project[]>([]);
const [loading, setLoading] = createSignal(false);

// Load projects from API
const loadProjects = async () => {
    setLoading(true);
    try {
        const data = await projectRepository.findAll();
        setProjects(data);
    } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
    } finally {
        setLoading(false);
    }
};

// Refresh projects (call after CRUD operations)
const refreshProjects = () => {
    loadProjects();
};

// Initialize on first import
loadProjects();

export const projectStore = {
    projects,
    loading,
    loadProjects,
    refreshProjects
};
