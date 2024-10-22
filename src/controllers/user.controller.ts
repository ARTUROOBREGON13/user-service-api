import { Controller, Post, Body, Get, Param, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserServiceResponseDto } from '../dto/user/user-service-response.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'El usuario ha sido creado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(@Body() createUsuarioDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de todos los usuarios.', type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId/services')
  @ApiOperation({ summary: 'Obtener todos los servicios asociados a un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de servicios asociados', type: [UserServiceResponseDto] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserServices(@Param('userId') user: number) {
    try {
      const userServices = await this.userService.getUserServices(user);
      return userServices.map(service => service.service);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }

  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener el detalle de un usuario' })
  @ApiResponse({ status: 200, description: 'Detalles del usuario', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserDetails(@Param('userId') user: number) {
    try { 
      return this.userService.findOne(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}