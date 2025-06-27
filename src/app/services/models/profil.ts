

export interface IProfil {
    _id?: string;
    code_profil: string;
    desi_profil: string;
    desc_profil: string;
}


export interface ProfilStoreType {
    loading: boolean;
    profils: IProfil[];
    filter: { query: string; order: 'asc' | 'desc' };
}

