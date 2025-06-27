import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";
import { AccountApi } from "../backend/httpRequests/accountApi";
import { ISubscription, SubscriptionStoreType } from "../models/subscription";
import { SubscriptionApi } from "../backend/httpRequests/subscriptionApi";


const initialStoreState: SubscriptionStoreType = {
    loading: false,
    subscriptions: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};




export const SubscriptionStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        Count: computed(() => store.subscriptions().length),

        filtered: computed(() => {
            return store.subscriptions().filter((item:ISubscription) => {
                const source = item.service.srv_name.concat(item.user.name).trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selected: computed(() => {
            return store.subscriptions().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(SubscriptionApi)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },


        async add(data:ISubscription): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {
                    loading: false,
                    subscriptions: [...store.subscriptions(), resp.data]
                });
            }).catch(Error => {
                patchState(store, {loading: false});
            })

        },
       

        async update(data:ISubscription, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    subscriptions: [...store.subscriptions().map(item => item._id === id ? resp.data : item )]
                });
            }).catch(Error => {
                console.log('update Subscription error: ', Error)
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
                    subscriptions: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, subscriptions: []});
            })
        },
        
        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false, 
                    subscriptions:  [ ...store.subscriptions().filter((item:ISubscription) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<SubscriptionStoreType>('subscriptionStore');
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


