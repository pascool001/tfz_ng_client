import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";
import { AccountStoreType, IAccount } from "../models/account";
import { AccountApi } from "../backend/httpRequests/accountApi";
// import { CountryApi } from "../backend/httpRequests/countryApi";
// import { OperatorApi } from "../backend/httpRequests/OperatorApi";


const initialStoreState: AccountStoreType = {
    loading: false,
    accounts: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};




export const AccountStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        countryCount: computed(() => store.accounts().length),

        filteredCountry: computed(() => {
            return store.accounts().filter((item:IAccount) => {
                const source = item.phone_number.trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selectedCountry: computed(() => {
            return store.accounts().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(AccountApi)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },


        async add(data:IAccount): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {
                    loading: false,
                    accounts: [...store.accounts(), resp.data]
                });
            }).catch(Error => {
                patchState(store, {loading: false});
            })

        },
       

        async update(data:IAccount, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    accounts: [...store.accounts().map(item => item._id === id ? resp.data : item )]
                });
            }).catch(Error => {
                console.log('updateAccount error: ', Error)
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
                    accounts: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, accounts: []});
            })
        },
        
        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false, 
                    accounts:  [ ...store.accounts().filter((item:IAccount) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<AccountStoreType>('accountStore');
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


