import { PlanInfo } from '../types'

export const defaultPlanInfo: PlanInfo = {
    concurrentBots: 5,
    requestsPerSecond: 2,
    tokenDiscount: 0,
    price: '0',
    billingScheme: 'per_unit',
    currency: 'usd',
    interval: 'month',
    active: true,
    livemode: false,
    title: 'Pay as you go',
    type: 'PayAsYouGo',
}
