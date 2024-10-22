import { Controller, Post, Body, Get, Param, Put, UseGuards, Delete } from '@nestjs/common';
import { ServiceCatalogService } from '../services/service-catalog.service';
import { CreateServiceDto } from '../dto/service/create-service.dto';
import { ServiceCatalog } from '../entities/service-catalog.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceResponseDto } from '../dto/service/service-response.dto';
import { UpdateServiceDto } from '../dto/service/update-service.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('services')
@Controller('services')
export class ServiceCatalogController {
  constructor(private readonly servicioService: ServiceCatalogService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiResponse({ status: 201, description: 'El servicio ha sido creado exitosamente.', type: ServiceCatalog })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(@Body() createServicioDto: CreateServiceDto): Promise<ServiceCatalog> {
    return this.servicioService.create(createServicioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de todos los usuarios.', type: [ServiceCatalog] })
  async findAll(): Promise<ServiceCatalog[]> {
    return this.servicioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  @ApiResponse({ status: 200, description: 'Detalles del servicio', type: ServiceResponseDto })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  getServiceById(@Param('id') id: number){
    return this.servicioService.getServiceById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un servicio' })
  @ApiResponse({ status: 200, description: 'Servicio actualizado correctamente', type: ServiceResponseDto })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  updateService(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicioService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un servicio' })
  @ApiResponse({ status: 200, description: 'Servicio eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Servicio' })
  deleteService(@Param('id') id: number) {
    return this.servicioService.deleteService(id);
  }
}