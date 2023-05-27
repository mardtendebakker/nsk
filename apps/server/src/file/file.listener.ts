import { Injectable } from "@nestjs/common";
import { FileService } from "./file.service";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class FileListener {
  constructor(private readonly fileService: FileService) {}

  @OnEvent('product_attribute.deleted')
  handleProductAttributeDeletedEvent(productId: number) {
    this.fileService.delete(productId);
  }
}
