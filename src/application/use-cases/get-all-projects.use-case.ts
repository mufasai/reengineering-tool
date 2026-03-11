import type { ProjectRepository } from '../../domain/repositories/interfaces';
import type { Project } from '../../domain/entities/project.entity';

export interface GetAllProjectsUseCase {
    execute(): Promise<Project[]>;
}

export class GetAllProjectsInteractor implements GetAllProjectsUseCase {
    private projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(): Promise<Project[]> {
        return await this.projectRepository.findAll();
    }
}
