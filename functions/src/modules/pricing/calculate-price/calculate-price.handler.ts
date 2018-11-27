import { PriceCalcReqs } from './model/price-calc-reqs.model';

import { FunctionHandler } from '../../../base/function/handler/function-handler.class';
import { Context } from '../../../base/context/context.interface';
import { PriceConfig } from './model/price-config.model';


export class CalculatePriceHandler extends FunctionHandler<PriceCalcReqs, Number>
{
  public execute(data: PriceCalcReqs, context: Context): Promise<Number>
  {
    this._logger.log(() => `Calculating price for ${data.noStudents} students and ${data.noTeachers} teachers.`);

    const configRepo = this._tools.getRepository('config');

    return configRepo.getDocumentById('pricing')
                     .then(priceConf => 
                              this._calculatePrice(data, <PriceConfig> priceConf));
  }
  
  private _calculatePrice(vars: PriceCalcReqs, pricingConfig: PriceConfig) {

    // A cool and fair pricing algorithm now reduced to dummy data.
    const price = vars.noStudents + vars.noTeachers + pricingConfig.ourPricingConfiguration;

    return price;
  
  }
}


// export const calcPriceHttp = functions.https.onCall((data, context) => {

//   if (data.noTeachers && data.noStudents) {

//     console.log(`Request for Price Calculation. Calculating Base Price for data.`);

//     const store = admin.firestore();

//     return store.collection('config')
//       .doc('pricing').get()
//       .then(pricingConfig => {
//         return { price: calculatePrice(data, <PriceConfig> pricingConfig.data()) }
//       });
//   }
//   else {
//     console.log(`Request for Price Calculation. Insufficient data since noTeachers or noStudents is null.`);

//     return new Error('Insufficient data.');
//   }
// });


// Listen for any change on document `marie` in collection `users`
// export const calculatePriceOfProspect = firestore
//   .document('prospects/{prospectId}')
//   .onUpdate(
//     (change, context) => {
//       const prospectData = change.after.data();

//       if (prospectData.noTeachers && prospectData.noStudents) {

//         console.log(`Detected change in Prospect. Calculating Price for prospect ${change.after.data().id}`);

//         const store = admin.firestore();

//         return store.collection('config')
//           .doc('pricing').get()
//           .then(pricingConfig => _setPrice(change, prospectData, <PriceConfig> pricingConfig.data()));

//       }
//       else {
//         console.log(`Detected change in Prospect. Waiting for noTeachers and noStudents to calculate price.`);
//         return null;
//       }
//     });


// function _setPrice(change, prospectData: any, pricingConfig: PriceConfig) {
//   const price = calculatePrice(prospectData, pricingConfig);

//   // Update doc
//   return change.after.ref.set({ price }, { merge: true });
// }
