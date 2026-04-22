import type { WorkOrder, WOStatus, Site, CreateSiteRequest, UpdateSiteStageRequest } from "../entities/work-order.entity";
import type { Team, SiteTeamMember, AddTeamToSiteRequest } from "../entities/team.entity";
import type { Termin, PaymentStatus } from "../entities/payment.entity";
import type { MaterialTransaction, Material, CreateMaterialRequest } from "../entities/material.entity";

import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../entities/auth.entity";

import type { Project, CreateProjectRequest, UpdateProjectRequest, ImportProjectRequest, ImportProjectResponse } from "../entities/project.entity";

import type { Person, CreatePersonRequest } from "../entities/person.entity";

import type { ProjectFile, UploadProjectFileRequest } from "../entities/project-file.entity";

import type { SiteFile, UploadSiteFileRequest } from "../entities/site-file.entity";
import type { SiteEvidence, UploadSiteEvidenceRequest } from "../entities/site-evidence.entity";

import type { CreateTerminRequest, TerminSubmission, ReviewTerminRequest, ApproveTerminRequest, PayTerminRequest } from "../entities/termin-submission.entity";

import type { User, UpdateUserRoleRequest } from "../entities/user.entity";

export interface ProjectRepository {
    findAll(): Promise<Project[]>;
    findById(id: string): Promise<Project>;
    create(project: CreateProjectRequest): Promise<Project>;
    delete(id: string): Promise<void>;
    update(id: string, project: UpdateProjectRequest): Promise<Project>;
    getFiles(projectId: string): Promise<ProjectFile[]>;
    uploadFile(projectId: string, request: UploadProjectFileRequest): Promise<ProjectFile>;
    importFromExcel(request: ImportProjectRequest): Promise<ImportProjectResponse>;
}


export interface SiteRepository {
    create(site: CreateSiteRequest): Promise<Site>;
    findByProjectId(projectId: string): Promise<Site[]>;
    findAll(): Promise<Site[]>;
    findById(id: string): Promise<Site>;
    getFiles(siteId: string): Promise<SiteFile[]>;
    uploadFile(siteId: string, request: UploadSiteFileRequest): Promise<SiteFile>;
    getEvidence(siteId: string): Promise<SiteEvidence[]>;
    uploadEvidence(siteId: string, request: UploadSiteEvidenceRequest): Promise<SiteEvidence>;
    getTeamStructure(siteId: string): Promise<SiteTeamMember[]>;
    addTeamToSite(siteId: string, request: AddTeamToSiteRequest): Promise<SiteTeamMember>;
    deleteTeamFromSite(siteId: string, teamMemberId: string): Promise<void>;
    updateStage(siteId: string, request: UpdateSiteStageRequest): Promise<Site>;
}

export interface PeopleRepository {
    findAll(): Promise<Person[]>;
    create(person: CreatePersonRequest): Promise<Person>;
}

export interface AuthRepository {
    login(credentials: LoginRequest): Promise<LoginResponse>;
    register(data: RegisterRequest): Promise<RegisterResponse>;
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
}

export interface PaymentRepository {
    findTerminsByWorkOrder(workOrderId: string): Promise<Termin[]>;
    updateTerminStatus(terminId: string, status: PaymentStatus, proofUrl?: string): Promise<void>;
    saveTermin(termin: Termin): Promise<void>;
}

export interface MaterialRepository {
    findByWorkOrder(workOrderId: string): Promise<MaterialTransaction[]>;
    saveTransaction(transaction: MaterialTransaction): Promise<void>;
    findBySiteId(siteId: string): Promise<Material[]>;
    findAll(): Promise<Material[]>;
    create(material: CreateMaterialRequest): Promise<Material>;
    importFromExcel(file: File, projectId: string): Promise<{
        imported_count: number;
        failed_count: number;
        errors?: string[];
    }>;
}

export interface TerminRepository {
    create(termin: CreateTerminRequest): Promise<TerminSubmission>;
    findById(terminId: string): Promise<TerminSubmission | null>;
    findBySiteAndNumber(siteId: string, terminNumber: number): Promise<TerminSubmission | null>;
    findAll(): Promise<TerminSubmission[]>;
    review(terminId: string, review: ReviewTerminRequest): Promise<TerminSubmission>;
    approve(terminId: string, approval: ApproveTerminRequest): Promise<TerminSubmission>;
    pay(terminId: string, payment: PayTerminRequest): Promise<TerminSubmission>;
}

export interface UserRepository {
    findAll(): Promise<User[]>;
    updateRole(userId: string, role: UpdateUserRoleRequest): Promise<User>;
    delete(userId: string): Promise<void>;
}
