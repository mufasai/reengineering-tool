import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { ReviewTerminRequest, TerminSubmission } from '../../domain/entities/termin-submission.entity';

export class ReviewTerminInteractor {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(terminId: string, review: ReviewTerminRequest): Promise<TerminSubmission> {
        return await this.terminRepository.review(terminId, review);
    }
}
