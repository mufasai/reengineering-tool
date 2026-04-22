import { createSignal, createEffect } from 'solid-js';
import type { Project } from '../../domain/entities/project.entity';
import { ProjectRepositoryImpl } from '../../infrastructure/repositories/project.repository.impl';

export const useProjects = () => {
    const [projects, setProjects] = createSignal<Project[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const projectRepository = new ProjectRepositoryImpl();

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await projectRepository.findAll();
            setProjects(data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount
    createEffect(() => {
        fetchProjects();
    });

    return {
        projects,
        loading,
        error,
        refetch: fetchProjects
    };
};