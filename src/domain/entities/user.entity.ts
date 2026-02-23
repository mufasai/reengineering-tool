export interface User {
    id: string;
    name: string;
    email: string;
    role: 'backoffice_admin' | 'management' | 'team_leader' | 'finance' | 'engineer' | 'tracking-tool' | 'admin' | 'user';
}
