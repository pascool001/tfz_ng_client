export interface ITransferType {
  _id?: string;
  designation: string;
}

export interface TransferTypeStoreType {
    loading: boolean;
    transfertypes: ITransferType[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}
