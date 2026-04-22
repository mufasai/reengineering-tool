import { createSignal, createEffect } from 'solid-js';
import type { Material } from '../../domain/entities/material.entity';
import { MaterialRepositoryImpl } from '../../infrastructure/repositories/material.repository.impl';

export const useMaterials = () => {
    const [materials, setMaterials] = createSignal<Material[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const materialRepository = new MaterialRepositoryImpl();

    const fetchMaterials = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await materialRepository.findAll();
            setMaterials(data);
        } catch (err) {
            console.error('Failed to fetch materials:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch materials');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount
    createEffect(() => {
        fetchMaterials();
    });

    return {
        materials,
        loading,
        error,
        refetch: fetchMaterials
    };
};