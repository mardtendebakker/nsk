import { Authorization } from "@nestjs-cognito/auth";
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { FindTaskResponseDto, FindTasksResponeDto } from "./dto/find-task-response.dto";
import { FindManyDto } from "./dto/find-many.dto";
import { TaskEntity } from "./entities/task.entity";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { INTERNAL_GROUPS } from "../common/types/cognito-groups.enum";

@ApiBearerAuth()
@Authorization(INTERNAL_GROUPS)
@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(protected readonly taskService: TaskService) {}
  @Get('')
  @ApiResponse({type: FindTasksResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({type: FindTaskResponseDto})
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({type: TaskEntity})
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Post()
  @ApiResponse({type: TaskEntity})
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }
}
