export interface IServicePricing {
  periodicite: string;
  cout: number;
  devise: string;
}

export interface IService {
    _id?: string;
    code: string;
    name: string;
    desc: string;
    toSuscribe: boolean;
    pricing: IServicePricing | null,
  }



export interface ServiceStoreType {
    loading: boolean;
    services: IService[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}


// const servicePricingSchema = new Schema(
//   {
//     periodicite: {type: String, required: true,  enum: ['DAY', 'MONTH', 'YEAR']},
//     cout: {type: Number, require: true },
//     devise: {type: String, default: 'FCFA'}
//   })


// const serviceSchema = new Schema(
//   {
//     name: {type: String, required: true},
//     code: {type: String },
//     desc: {type: String},
//     toSuscribe: {type: Boolean, default: false},
//     pricing: servicePricingSchema
//   },

