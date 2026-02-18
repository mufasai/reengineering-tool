export type TeamType = 'INEOM_REGISTERED' | 'NOT_INEOM_REGISTERED';

export interface Personnel {
    id: string;
    name: string;
    ktpNumber: string;
    email: string;
    phoneNumber: string;
    role: string;
    vendorName?: string;
    deviceId?: string;
    imei1?: string;
    imei2?: string;
    verificationPhotos: {
        ktp: string; // URL/Path
        selfie: string;
        nda: string;
    };
}

export interface Team {
    id: string;
    name: string;
    type: TeamType;
    leaderId: string;
    members: Personnel[];
}
