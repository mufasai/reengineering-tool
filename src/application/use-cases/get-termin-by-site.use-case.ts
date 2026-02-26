import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { TerminSubmission } from '../../domain/entities/termin-submission.entity';

export class GetTerminBySiteInteractor {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(siteId: string, terminNumber: number): Promise<TerminSubmission | null> {
        return await this.terminRepository.findBySiteAndNumber(siteId, terminNumber);
    }
}
