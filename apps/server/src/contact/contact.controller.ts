import { Authorization, CognitoUser } from '@nestjs-cognito/auth';
import {
  Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { FindContactsResponeDto } from './dto/find-contact-response.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactEntity } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindManyDto } from './dto/find-many.dto';
import {
  ALL_MAIN_GROUPS, CognitoGroups, LOCAL_GROUPS, PARTNERS_GROUPS,
} from '../common/types/cognito-groups.enum';
import { requiredModule } from '../common/guard/required-modules.guard';

@ApiBearerAuth()
@Authorization(ALL_MAIN_GROUPS)
@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(protected readonly contactService: ContactService) {}

  @Get('')
  @ApiResponse({ type: FindContactsResponeDto })
  findAll(
  @Query() query: FindManyDto,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.contactService.findAll(query);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.contactService.findAll(query, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Get(':id')
  @ApiResponse({ type: ContactEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  findOne(
  @Param('id') id: number,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.contactService.findOne(id);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.contactService.findOne(id, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Post('')
  @ApiResponse({ type: ContactEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  create(
  @Body() body: CreateContactDto,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.contactService.create(body);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.contactService.create(body, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Put(':id')
  @ApiResponse({ type: ContactEntity })
  @UseGuards(requiredModule('customer_contact_action'))
  update(
  @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.contactService.update(id, updateContactDto);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.contactService.update(id, updateContactDto, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Delete(':id')
  @UseGuards(requiredModule('customer_contact_action'))
  delete(
  @Param('id') id: number,
    @CognitoUser(['groups', 'email'])
    {
      groups,
      email,
    }: {
      groups: CognitoGroups[];
      email: string;
    },
  ) {
    if (groups.some((group) => LOCAL_GROUPS.includes(group))) {
      return this.contactService.delete(id);
    } if (groups.some((group) => PARTNERS_GROUPS.includes(group))) {
      return this.contactService.delete(id, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }
}
