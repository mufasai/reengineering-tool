import type { ProjectRepository } from '../../domain/repositories/interfaces';
import type { ImportProjectRequest, ImportProjectResponse } from '../../domain/entities/project.entity';

export class ImportProjectInteractor {
    constructor(private projectRepository: ProjectRepository) { }

    async execute(request: ImportProjectRequest): Promise<ImportProjectResponse> {
        return await this.projectRepository.importFromExcel(request);
    }
}
