import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { TerminSubmission, PayTerminRequest } from '../../domain/entities/termin-submission.entity';

export class PayTerminInteractor {
    private terminRepository: TerminRepository;

    constructor(terminRepository: TerminRepository) {
        this.terminRepository = terminRepository;
    }

    async execute(terminId: string, payment: PayTerminRequest): Promise<TerminSubmission> {
        return await this.terminRepository.pay(terminId, payment);
    }
}
