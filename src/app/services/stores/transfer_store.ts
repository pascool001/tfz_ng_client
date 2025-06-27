import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";

import { ITransfer, TransferStoreType } from "../models/transfer";
import { TransferApi } from "../backend/httpRequests/transferApi";



const initialStoreState: TransferStoreType = {
    loading: false,
    transfers: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};




export const TransferStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        Count: computed(() => store.transfers().length),

        filtered: computed(() => {
            return store.transfers().filter((item:ITransfer) => {
                const source = item.src_account.phone_number.concat(item.target_account.phone_number).trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selected: computed(() => {
            return store.transfers().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(TransferApi)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },


        async add(data:ITransfer): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {
                    loading: false,
                    transfers: [...store.transfers(), resp.data]
                });
            }).catch(Error => {
                patchState(store, {loading: false});
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
                    transfers: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, transfers: []});
            })
        },
        
        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false, 
                    transfers:  [ ...store.transfers().filter((item:ITransfer) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<TransferStoreType>('transferStore');
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


