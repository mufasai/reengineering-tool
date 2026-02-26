import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { TerminSubmission, CreateTerminRequest } from '../../domain/entities/termin-submission.entity';

export class CreateTerminInteractor {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(termin: CreateTerminRequest): Promise<TerminSubmission> {
        return await this.terminRepository.create(termin);
    }
}
