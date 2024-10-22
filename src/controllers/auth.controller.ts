import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/auth/login-response.dto';
import { RegisterResponseDto } from '../dto/auth/register-response.dto';
import { UserProfileDto } from '../dto/auth/user-profile.dto';
import { LoginDto } from '../dto/auth/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({
    description: 'Incluye el usuario y contraseña para validación',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      return await this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error en la autenticación');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { message: 'Usuario creado con éxito', userId: user.id };
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
