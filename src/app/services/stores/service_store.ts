import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";

import { ServiceStoreType, IService } from "../models/service";
import { ServiceApi } from "../backend/httpRequests/serviceApi";
import { Notifier } from "@utilities";



const initialStoreState: ServiceStoreType = {
    loading: false,
    services: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};




export const ServiceStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        Count: computed(() => store.services().length),

        filtered: computed(() => {
            return store.services().filter((item:IService) => {
                const source = item.code.concat(item.name).trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selected: computed(() => {
            return store.services().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(ServiceApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },

        async add(data:IService): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {loading: false, services: [...store.services(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
            }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })

        },


        async update(data:IService, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    services: [...store.services().map(item => item._id === id ? resp.data : item )]
                });
                notifier.notify({message: "Operation reussie", status: 'success'})
            }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })
        },

        async getAll(): Promise<void> {
            patchState(store, {loading: true });
            Api.getAll().then(resp => {
                let arr = resp.data.map((item:any) => {
                    return (item._doc) ? {...item._doc} : item
                })
                patchState(store, {loading: false, services: [ ...arr] });
            }).catch(err => {
                patchState(store, {loading: false, services: []});
            })
        },

        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    services:  [ ...store.services().filter((item:IService) => item._id !== deleted_id ) ]
                });
                notifier.notify({message: "Operation reussie", status: 'success'})
            }).catch(err => {
                patchState(store, {loading: false});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })
        },

    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<ServiceStoreType>('serviceStore');
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


