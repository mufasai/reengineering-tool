import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { TerminSubmission } from '../../domain/entities/termin-submission.entity';

export interface GetAllTerminsUseCase {
    execute(): Promise<TerminSubmission[]>;
}

export class GetAllTerminsInteractor implements GetAllTerminsUseCase {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(): Promise<TerminSubmission[]> {
        return await this.terminRepository.findAll();
    }
}
