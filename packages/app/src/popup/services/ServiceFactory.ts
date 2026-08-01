import type IService from './IService'
import type { ChainType } from '../configs/network'
import ServiceLocator from '@lopan/utils/ioc/ServiceLocator'
import EVMService from './evm/Service'
import BitcoinRestApiService from './bitcoin/RestApiService'

export default class ServiceFactory {
  private static services: ServiceLocator<IService> | null = null

  static getService(type: ChainType): IService {
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
      })
    }

    const service = ServiceFactory.services.getService(type)

    if(service === null) {
      throw new Error(`Service for chain type ${type} not found`)
    }

    return service as IService
  }
}
