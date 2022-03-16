import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  CacheInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Document } from './document.entity';
import { DocumentService } from './document.service';
import { InsertResult } from 'typeorm';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentIdDto } from './dto/document-id.dto';
import { DocumentDto } from './dto/document.dto';

@ApiTags('documents')
@Controller('document')
@UseInterceptors(CacheInterceptor)
export class DocumentController {
  constructor(private service: DocumentService) {}

  /**
   * Get a document from the database by its id.
   * @param id The id of the document to retrieve.
   * @returns The document object (with id, author, content, created_at, updated_at).
   */
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description:
      'The retrieved document with its content, author and other metadata.',
    type: DocumentDto,
  })
  @ApiResponse({ status: 404, description: 'No document found with the id.' })
  @Get('/:id')
  async getById(@Param() id: string): Promise<DocumentDto> {
    const document: Document = await this.service.findOne(id);

    if (document === undefined) {
      throw new NotFoundException('No document found with this id.');
    }

    return {
      id: document.id,
      author: document.author ? document.author.username : 'Anonymous',
      content: document.content,
      created_at: document.created_at,
      updated_at: document.updated_at,
    };
  }

  /**
   * Get the raw content of a document.
   * @param id The id of the document.
   * @returns The raw content of the document.
   */
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The raw content of the document.',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'No document found with the id.' })
  @Get('/:id/raw')
  async getRaw(@Param() id: string) {
    const document: Document = await this.service.findOne(id);

    if (document === undefined) {
      throw new NotFoundException('No document found with this id.');
    }

    return document.content;
  }

  /**
   * Insert a new document in the database.
   * @param content The content (aka code) to insert.
   * @returns The id of the inserted document which can be shared.
   */
  @ApiBody({
    description: 'The content (aka code) of the document',
    type: CreateDocumentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The id of the document.',
    type: DocumentIdDto,
  })
  @Post()
  async insertNew(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentIdDto> {
    const document: Document = new Document();
    document.id = await this.generateAvailableId();
    document.content = createDocumentDto.content;
    document.author = null;

    const result: InsertResult = await this.service.insert(document);

    return {
      id: result.identifiers[0].id,
    };
  }

  /**
   * Get a new id that's available in the database.
   * @returns An available id.
   */
  async generateAvailableId() {
    let id = this.generateId();

    while ((await this.service.findOne(id)) !== undefined) {
      id = this.generateId();
    }

    return id;
  }

  /**
   * Generate a random string which can be used as document id.
   * @returns A random id.
   */
  generateId(): string {
    let result: string = '';

    const characters: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;

    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
