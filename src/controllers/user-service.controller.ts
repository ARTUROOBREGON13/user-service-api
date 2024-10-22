import { Controller, Post, Param,  Delete } from '@nestjs/common';
import { UserServiceService } from '../services/user-service.service';
import { AssignServiceUserDto } from '../dto/user/assign-service-user.dto';
import { UserService } from '../entities/user-service.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("users")
@Controller('users')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Post(':userId/services/:serviceId')
  @ApiOperation({ summary: 'Asignar un servicio a un usuario' })
  @ApiResponse({ status: 201, description: 'La operación resulto exitosa.', type: String })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async assignServiceToUser (@Param('userId') user: number, @Param('serviceId') service: number): Promise<UserService> {
    const assignServiceUserDto: AssignServiceUserDto = {user, service};
    return this.userServiceService.assignServiceToUser(assignServiceUserDto);
  }

  @Delete(':userId/services/:serviceId')
  @ApiOperation({ summary: 'Eliminar la relación de un servicio con un usuario' })
  @ApiResponse({ status: 200, description: 'Servicio desvinculado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario o Servicio no encontrado' })
  removeServiceFromUser(@Param('userId') userId: number, @Param('serviceId') serviceId: number) {
    return this.userServiceService.removeServiceFromUser(userId, serviceId);
  }

}