import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";

import { TransferTypeApi } from "@backend/httpRequests/transferTypeApi";
import { ITransferType, TransferTypeStoreType } from "@models/transferType";

import { Notifier } from "@utilities";


const initialStoreState: TransferTypeStoreType = {
    loading: false,
    transfertypes: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};




export const TransferTypeStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        Count: computed(() => store.transfertypes().length),

        filtered: computed(() => {
            return store.transfertypes().filter((item:ITransferType) => {
                const source = item?.designation.trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selected: computed(() => {
            return store.transfertypes().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(TransferTypeApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },


        async add(data:ITransferType): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {
                    loading: false,
                    transfertypes: [...store.transfertypes(), resp.data]
                });
                notifier.notify({message: "création reussie", status: 'success'})
            }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Creation échouée", status: 'error'})
            })

        },

        async update(data:ITransferType, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    transfertypes: [...store.transfertypes().map(item => item._id === id ? resp.data : item )]
                });
                notifier.notify({message: "Modification reussie", status: 'success'})
            }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Modification échouée !!", status: 'error'})
            })
        },

        async getAll(): Promise<void> {
            patchState(store, {loading: true });
            Api.getAll().then(resp => {
                let arr = resp.data.map((item:any) => {
                    return (item._doc) ? {...item._doc} : item
                })
                patchState(store, {
                    loading: false,
                    transfertypes: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, transfertypes: []});
            })
        },

        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    transfertypes:  [ ...store.transfertypes().filter((item:ITransferType) => item._id !== deleted_id ) ]
                });
            }).catch(err => {
                console.log('Store deletion error: ', err)
                patchState(store, {loading: false});
            })
        },

    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<TransferTypeStoreType>('TransferTypeStore');
                    if (localStore) {
                        patchState(store, localStore)
                    }
                },
                onDestroy() {
                    console.log('Store onDestroy ...')
                    patchState(store, initialStoreState)
                },
        }
    })
  );


