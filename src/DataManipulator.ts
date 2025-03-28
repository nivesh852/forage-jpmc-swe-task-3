import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,    // (ask + bid) / 2
  price_def: number,
  ratio: number,        // price ABC / price DEF
  timestamp: Date,      // data timestamp for X axis
  upper_bound: number,  // + 0.05
  lower_bound: number,  // - 0.05
  trigger_alert: number | undefined,
}


export class DataManipulator {
    static generateRow(serverRespond: ServerRespond[]): Row {
        const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
        const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
        const ratio = priceABC / priceDEF;
        const upperBound = 1 + 0.05;
        const lowerBound = 1 - 0.05;
      return {
          price_abc: priceABC,
          price_def: priceDEF,
          ratio: ratio,
          timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
              serverRespond[0].timestamp : serverRespond[1].timestamp,
          upper_bound: upperBound,
          lower_bound: lowerBound,
           trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
  }
}
