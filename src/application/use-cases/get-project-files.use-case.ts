import type { ProjectRepository } from '../../domain/repositories/interfaces';
import type { ProjectFile } from '../../domain/entities/project-file.entity';

export interface GetProjectFilesUseCase {
    execute(projectId: string): Promise<ProjectFile[]>;
}

export class GetProjectFilesInteractor implements GetProjectFilesUseCase {
    private projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(projectId: string): Promise<ProjectFile[]> {
        return await this.projectRepository.getFiles(projectId);
    }
}
