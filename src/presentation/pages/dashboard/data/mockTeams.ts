// Mock data for teams - for testing stage progression
export const mockTeams = [
    {
        id: 'team-1',
        nama: 'Tim Alpha Jakarta',
        project_type: 'RESCOPING',
        status_aktif: true,
        regional: 'Jakarta',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
    },
    {
        id: 'team-2',
        nama: 'Tim Beta Bandung',
        project_type: 'STANDARD',
        status_aktif: true,
        regional: 'Bandung',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
    },
    {
        id: 'team-3',
        nama: 'Tim Gamma Surabaya',
        project_type: 'RESCOPING',
        status_aktif: true,
        regional: 'Surabaya',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
    }
];

export const mockPeople = [
    {
        id: 'person-1',
        name: 'John Doe',
        nik: '1234567890',
        jabatan: 'Team Leader',
        regional: 'Jakarta',
        no_hp: '08123456789'
    },
    {
        id: 'person-2',
        name: 'Jane Smith',
        nik: '0987654321',
        jabatan: 'Field Engineer',
        regional: 'Bandung',
        no_hp: '08198765432'
    },
    {
        id: 'person-3',
        name: 'Bob Wilson',
        nik: '1122334455',
        jabatan: 'Team Leader',
        regional: 'Surabaya',
        no_hp: '08111223344'
    }
];

export const mockTeamMembers = [
    {
        id: 'tm-1',
        team_id: 'team-1',
        person_id: 'person-1',
        role: 'Team Leader'
    },
    {
        id: 'tm-2',
        team_id: 'team-2',
        person_id: 'person-2',
        role: 'Field Engineer'
    },
    {
        id: 'tm-3',
        team_id: 'team-3',
        person_id: 'person-3',
        role: 'Team Leader'
    }
];