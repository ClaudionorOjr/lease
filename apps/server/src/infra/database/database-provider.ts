export interface DatabaseProvider {
  onModuleInit(): Promise<void>;
  onModuleDestroy(): Promise<void>;
}
