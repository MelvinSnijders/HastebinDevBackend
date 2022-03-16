import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    return await this.documentRepository.findOne(id);
  }

  async insert(document: Document): Promise<InsertResult> {
    return await this.documentRepository.insert(document);
  }

  async remove(id: string): Promise<void> {
    await this.documentRepository.delete(id);
  }
}
