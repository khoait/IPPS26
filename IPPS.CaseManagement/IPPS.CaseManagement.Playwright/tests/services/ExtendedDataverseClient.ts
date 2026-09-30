import {
  type DataverseClient,
  type EntityCollection,
  type EntityReference,
  type Guid,
  getMetadataByLogicalName,
  type IEntity,
  odataify,
  setMetadataCache,
  toEntityReference,
  type WebApiExecuteRequest,
} from "dataverse-ify";
import type {
  FetchRetrieveMultipleOptions,
  ODataRetrieveMultipleOptions,
} from "dataverse-ify/lib/dataverse-ify/DataverseClient/DataverseClient";
import {
  type Config,
  type CreateRequest,
  DynamicsWebApi,
  type UpdateRequest,
} from "dynamics-web-api";
import "dotenv/config";
import { DATAVERSE_AUTH_FILE } from "../auth/dataverse-auth.setup";
import { metadataCache } from "../types";
import { getAccessToken } from "../utils/dataverse-token";

export interface IExtendedDataverseClient extends DataverseClient {
  retrieve<T extends IEntity>(
    entityName: string,
    id: Guid,
    columnSet: string[] | boolean,
    signal?: AbortSignal,
  ): Promise<T>;
  retrieveMultiple<T extends IEntity>(
    query: string,
    options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions,
    signal?: AbortSignal,
  ): Promise<EntityCollection<T>>;
  create(
    entity: IEntity,
    createOptions?: Omit<CreateRequest, "collection" | "data" | "key">,
  ): Promise<string>;
  update(
    entity: IEntity,
    updateOptions?: Omit<UpdateRequest, "collection" | "data" | "key">,
  ): Promise<void>;
  executeMultiple<T>(
    requests: (WebApiExecuteRequest | WebApiExecuteRequest[])[],
  ): Promise<T[] | undefined>;
  setWebApiConfig(config: Config): void;
}

export class ExtendedDataverseClient implements IExtendedDataverseClient {
  readonly webApi: DynamicsWebApi;

  constructor() {
    this.webApi = new DynamicsWebApi({
      serverUrl: process.env.DataverseUrl!,
      useEntityNames: true,
      onTokenRefresh: async () => {
        const token = await getAccessToken(process.env.DataverseUrl!, DATAVERSE_AUTH_FILE);
        return token.token;
      },
    });
    setMetadataCache(metadataCache);
  }

  setWebApiConfig(config: Config): void {
    this.webApi.setConfig(config);
  }

  async retrieve<T extends IEntity>(
    entityName: string,
    id: Guid,
    columnSet: string[] | boolean,
  ): Promise<T>;
  async retrieve<T extends IEntity>(
    _entityName: string,
    _id: Guid,
    _columnSet: string[] | boolean,
    _signal?: AbortSignal,
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async retrieveMultiple<T extends IEntity>(
    query: string,
    options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions,
  ): Promise<EntityCollection<T>>;
  async retrieveMultiple<T extends IEntity>(
    _query: string,
    _options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions,
    _signal?: AbortSignal,
  ): Promise<EntityCollection<T>> {
    throw new Error("Method not implemented.");
  }

  async create(
    entity: IEntity,
    createOptions?: Omit<CreateRequest, "collection" | "data" | "key">,
  ): Promise<string> {
    const odata = await odataify("Create", entity);
    const result = await this.webApi.create({
      collection: entity.logicalName,
      data: odata,
      ...createOptions,
    });

    return result;
  }

  async update(entity: IEntity): Promise<void>;
  async update(
    entity: IEntity,
    updateOptions?: Omit<UpdateRequest, "collection" | "data" | "key">,
  ): Promise<void> {
    // Get the primary key attribute
    const entityMetadata = getMetadataByLogicalName(entity.logicalName);
    const record = await odataify("Update", entity);

    let id = entity[entityMetadata.primaryIdAttribute] as string | undefined;
    // If there is no primary id attribute set, but the id is set then use that
    if (!id && entity.id) {
      id = entity.id;
    } else if (!id) {
      throw new Error("Either id or the primary id attribute must be set to update the record");
    }

    // We no longer need special handling of null values since it is now supported to null lookups inside a PATCH
    try {
      await this.webApi.update({
        collection: entity.logicalName,
        key: id,
        data: record,
        ...updateOptions,
      });
    } catch (ex) {
      throw new Error(`Error during update:${(ex as Error).message}`);
    }
  }

  async delete(entity: string | IEntity): Promise<void>;
  async delete(entity: string, id: Guid): Promise<void>;
  async delete(entity: unknown, id?: Guid): Promise<void> {
    if (typeof entity === "string") {
      await this.webApi.deleteRecord({
        collection: entity,
        key: id,
      });
    } else {
      const entityRef = toEntityReference(entity as IEntity);
      await this.webApi.deleteRecord({
        collection: entityRef.entityType,
        key: entityRef.id,
      });
    }
  }

  associate(
    _entityName: string,
    _entityId: string,
    _relationship: string,
    _relatedEntities: EntityReference[],
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  disassociate(
    _entityName: string,
    _entityId: string,
    _relationship: string,
    _relatedEntities: EntityReference[],
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  execute<T>(_request: WebApiExecuteRequest): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }

  executeMultiple<T>(
    _requests: (WebApiExecuteRequest | WebApiExecuteRequest[])[],
  ): Promise<T[] | undefined> {
    throw new Error("Method not implemented.");
  }
}
