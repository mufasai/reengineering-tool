import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { ApproveTerminRequest, TerminSubmission } from '../../domain/entities/termin-submission.entity';

export class ApproveTerminInteractor {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(terminId: string, approval: ApproveTerminRequest): Promise<TerminSubmission> {
        return await this.terminRepository.approve(terminId, approval);
    }
}
