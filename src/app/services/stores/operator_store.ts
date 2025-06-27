import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";
import { IOperator, OperatorStoreType } from "../models/Operator";
import { OperatorApi } from "../backend/httpRequests/OperatorApi";

const initialStoreState: OperatorStoreType = {
    loading: false,
    operators: [],
    filter: { query: '', order: 'asc' },
};


export const OperatorStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        Count: computed(() => store.operators().length),

        operatorsByCountry: computed(() => {

            return store.operators().filter(item => {

                if (item.country) {
                   return (item.country._id == store.filter.query())
                } else {
                   return null;
                }
            })
        })

    })),

    withMethods((store, Api = inject(OperatorApi)) => ({

        updateQuery(query: string): void {
            // 👇 Updating state using the `patchState` function.
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },


        async addOperator(data:IOperator): Promise<void> {
            patchState(store, {loading: true });
            Api.create(data).then(async resp => {
                console.log('oper create result: ', resp.data)
                patchState(store, {
                    loading: false,
                    operators: [...store.operators(), resp.data]
                });
            }).catch(Error => {
                console.log('AddOperator ERR: ', Error)
                patchState(store, {loading: false});
            })

        },

        async updateOperator(data:IOperator, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    operators: [...store.operators().map(item => item._id === id ? resp.data : item )]
                });
            }).catch(Error => {
                console.log('update Operator error: ', Error)
                patchState(store, {loading: false});
            })
        },

        async getAll(): Promise<void> {
            patchState(store, {loading: true });
            Api.getAll().then(resp => {
                // console.log('Operators : ', resp.data)
                let arr = resp.data.map((item:any) => {
                    return (item._doc) ? {image: item.image, ...item._doc} : item
                })
                patchState(store, {
                    loading: false,
                    operators: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, operators: []});
            })
        },

        async deleteOperator(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    operators:  [ ...store.operators().filter((item:IOperator) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<OperatorStoreType>('operatorStore');
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


