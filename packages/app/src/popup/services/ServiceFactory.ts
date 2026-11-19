import type IService from './IService'
import type { INetwork } from '../configs/network'
import ServiceLocator from '@lopan/utils/ioc/ServiceLocator'
import EVMService from './evm/Service'
import BitcoinRestApiService from './bitcoin/RestApiService'
import SVMService from './svm/Service'

export default class ServiceFactory {
  private static services: ServiceLocator<IService> | null = null

  static getService(network: INetwork): IService {
    if(ServiceFactory.services === null) {
      ServiceFactory.services = new ServiceLocator<IService>()
      ServiceFactory.services.setServicesAsDefinition({
        'EVM': {
          classType: EVMService,
        },
        'BITCOIN': {
          classType: BitcoinRestApiService,
        },
        'BITCOIN_TESTNET': {
          classType: BitcoinRestApiService,
        },
        'BITCOIN_REGTEST': {
          classType: BitcoinRestApiService,
        },
        'SVM': {
          classType: SVMService,
        }
      })
    }

    const service = ServiceFactory.services.getService(network.chainType)
    if(service === null) {
      throw new Error(`Service for chain type ${network.chainType} not found`)
    }

    return service
  }
}
