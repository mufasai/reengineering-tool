import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { ReviewTerminRequest, TerminSubmission } from '../../domain/entities/termin-submission.entity';

export class ReviewTerminInteractor {
    constructor(private terminRepository: TerminRepository) { }

    async execute(terminId: string, review: ReviewTerminRequest): Promise<TerminSubmission> {
        return await this.terminRepository.review(terminId, review);
    }
}
