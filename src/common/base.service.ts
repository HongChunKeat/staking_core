import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BaseService<Entity extends ObjectLiteral> {
  constructor(
    private readonly repository: Repository<Entity>,
    protected readonly dataSource: DataSource,
  ) {}

  // method to get the entity name from metadata
  protected getEntityName(): string {
    const metadata = this.dataSource.getMetadata(this.repository.target);
    return metadata.name;
  }

  // exists - return boolean
  async existsBy(findData: FindOptionsWhere<Entity>): Promise<Boolean> {
    return this.repository.existsBy(findData);
  }

  // read - return single
  async findOneBy(findData: FindOptionsWhere<Entity>): Promise<Entity | null> {
    return this.repository.findOneBy(findData);
  }

  // read - return multiple
  async findBy(findData: FindOptionsWhere<Entity>): Promise<Entity[]> {
    return this.repository.findBy(findData);
  }

  // update - with where and set
  @Transactional()
  async updateWhereSet(
    where: Partial<Entity>,
    set: Partial<Entity>,
  ): Promise<UpdateResult> {
    const res = await this.repository.update(where, set);
    return res;
  }

  // delete
  @Transactional()
  async delete(id: Uuid): Promise<DeleteResult> {
    return await this.repository.softDelete(id);
  }
}
