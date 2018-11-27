import { DataGuard } from "../../../base/function/guard/data/data.guard";
import { PriceCalcReqs } from "./model/price-calc-reqs.model";

import { GCFunction } from "../../../base/function/gc-function.class";

import { FirestoreUpdateRegistrar } from "../../../base/function/registrars/firestore/firestore-update.registrar";
import { RestRegistrar } from "../../../base/function/registrars/rest/rest-registrar.class";

import { CalculatePriceHandler } from "./calculate-price.handler";


const requiredData = new DataGuard(['noStudents', 'noTeachers']);
const handler = new CalculatePriceHandler();

export const calculatePricingDb 
  = new GCFunction<PriceCalcReqs, Number>('calculatePricingDb',
    new FirestoreUpdateRegistrar<PriceCalcReqs, Number>('prospects/{prospectId}', true, 'pricing'),
    [requiredData],
    handler)
  .build();

export const calculatePricing 
  = new GCFunction<PriceCalcReqs, Number>('calculatePricingRest',
    new RestRegistrar<PriceCalcReqs, Number>(),
    [requiredData],
    handler)
  .build();                                