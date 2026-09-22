import {
  DataverseClient,
  IEntity,
  Guid,
  EntityCollection,
  WebApiExecuteRequest,
  EntityReference,
  odataify,
  setMetadataCache,
  toEntityReference,
  getMetadataByLogicalName,
} from "dataverse-ify";
import {
  FetchRetrieveMultipleOptions,
  ODataRetrieveMultipleOptions,
} from "dataverse-ify/lib/dataverse-ify/DataverseClient/DataverseClient";
import {
  Config,
  CreateRequest,
  UpdateRequest,
  DynamicsWebApi,
} from "dynamics-web-api";
import "dotenv/config";
import { getAccessToken } from "../utils/dataverse-token";
import { DATAVERSE_AUTH_FILE } from "../auth/dataverse-auth.setup";
import { metadataCache } from "../types";

export interface IExtendedDataverseClient extends DataverseClient {
  retrieve<T extends IEntity>(
    entityName: string,
    id: Guid,
    columnSet: string[] | boolean,
    signal?: AbortSignal
  ): Promise<T>;
  retrieveMultiple<T extends IEntity>(
    query: string,
    options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions,
    signal?: AbortSignal
  ): Promise<EntityCollection<T>>;
  create(
    entity: IEntity,
    createOptions?: Omit<CreateRequest, "collection" | "data" | "key">
  ): Promise<string>;
  update(
    entity: IEntity,
    updateOptions?: Omit<UpdateRequest, "collection" | "data" | "key">
  ): Promise<void>;
  executeMultiple<T>(
    requests: (WebApiExecuteRequest | WebApiExecuteRequest[])[]
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
        const token = await getAccessToken(
          process.env.DataverseUrl!,
          DATAVERSE_AUTH_FILE
        );
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
    columnSet: string[] | boolean
  ): Promise<T>;
  async retrieve<T extends IEntity>(
    entityName: string,
    id: Guid,
    columnSet: string[] | boolean,
    signal?: AbortSignal
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async retrieveMultiple<T extends IEntity>(
    query: string,
    options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions
  ): Promise<EntityCollection<T>>;
  async retrieveMultiple<T extends IEntity>(
    query: string,
    options?: FetchRetrieveMultipleOptions | ODataRetrieveMultipleOptions,
    signal?: AbortSignal
  ): Promise<EntityCollection<T>> {
    throw new Error("Method not implemented.");
  }

  async create(
    entity: IEntity,
    createOptions?: Omit<CreateRequest, "collection" | "data" | "key">
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
    updateOptions?: Omit<UpdateRequest, "collection" | "data" | "key">
  ): Promise<void> {
    // Get the primary key attribute
    const entityMetadata = getMetadataByLogicalName(entity.logicalName);
    const record = await odataify("Update", entity);

    let id = entity[entityMetadata.primaryIdAttribute] as string | undefined;
    // If there is no primary id attribute set, but the id is set then use that
    if (!id && entity.id) {
      id = entity.id;
    } else if (!id) {
      throw new Error(
        "Either id or the primary id attribute must be set to update the record"
      );
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
      throw new Error("Error during update:" + (ex as Error).message);
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
    entityName: string,
    entityId: string,
    relationship: string,
    relatedEntities: EntityReference[]
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  disassociate(
    entityName: string,
    entityId: string,
    relationship: string,
    relatedEntities: EntityReference[]
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  execute<T>(request: WebApiExecuteRequest): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }

  executeMultiple<T>(
    requests: (WebApiExecuteRequest | WebApiExecuteRequest[])[]
  ): Promise<T[] | undefined> {
    throw new Error("Method not implemented.");
  }
}
