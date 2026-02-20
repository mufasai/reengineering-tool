import type { WorkOrder, WOStatus } from "../entities/work-order.entity";
import type { Team, Personnel } from "../entities/team.entity";
import type { Termin, PaymentStatus } from "../entities/payment.entity";
import type { MaterialTransaction } from "../entities/material.entity";

import type { LoginRequest, LoginResponse } from "../entities/auth.entity";

export interface AuthRepository {
    login(credentials: LoginRequest): Promise<LoginResponse>;
    logout(): void;
    getToken(): string | null;
    saveToken(token: string): void;
}

export interface WorkOrderRepository {
    findById(id: string): Promise<WorkOrder | null>;
    findAll(): Promise<WorkOrder[]>;
    save(workOrder: WorkOrder): Promise<void>;
    updateStatus(id: string, status: WOStatus): Promise<void>;
}

export interface TeamRepository {
    findById(id: string): Promise<Team | null>;
    findAll(): Promise<Team[]>;
    save(team: Team): Promise<void>;
    addPersonnel(teamId: string, personnel: Personnel): Promise<void>;
}

export interface PaymentRepository {
    findTerminsByWorkOrder(workOrderId: string): Promise<Termin[]>;
    updateTerminStatus(terminId: string, status: PaymentStatus, proofUrl?: string): Promise<void>;
    saveTermin(termin: Termin): Promise<void>;
}

export interface MaterialRepository {
    findByWorkOrder(workOrderId: string): Promise<MaterialTransaction[]>;
    saveTransaction(transaction: MaterialTransaction): Promise<void>;
}
