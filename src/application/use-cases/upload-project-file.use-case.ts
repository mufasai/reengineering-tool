import type { ProjectRepository } from "../../domain/repositories/interfaces";
import type { ProjectFile } from "../../domain/entities/project-file.entity";
import type { UploadProjectFileRequest } from "../../domain/entities/project-file.entity";

export class UploadProjectFileInteractor {
    private projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(projectId: string, request: UploadProjectFileRequest): Promise<ProjectFile> {
        return await this.projectRepository.uploadFile(projectId, request);
    }
}
